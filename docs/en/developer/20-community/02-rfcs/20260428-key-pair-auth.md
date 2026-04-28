---
title: Key-Pair Authentication
description: RFC for per-user key-pair authentication using public key cryptography.
---

- Tracking Issue: TBD

## Summary

Add per-user key-pair authentication to Databend, allowing users to authenticate by signing a JWT with their private key instead of using a password. The server stores the user's public key(s) and verifies the JWT signature. Supports RSA, ECDSA (ES256/ES384), and Ed25519 key types, with multiple keys per user for seamless rotation.

## Motivation

Password-based authentication has well-known limitations for programmatic access:

- Passwords must be stored or transmitted, increasing the attack surface.
- Password rotation requires coordinated updates across all clients.
- Automated systems (CI/CD pipelines, ETL jobs, connectors) need credentials that are harder to manage securely with passwords.

Key-pair authentication addresses these issues:

- The private key never leaves the client; only the public key is stored on the server.
- Key rotation is seamless — add a new key, update clients, remove the old key.
- No shared secret is transmitted during authentication; the client proves identity by signing a short-lived JWT.

This is a widely adopted pattern (Snowflake, SSH, mTLS) that Databend users have requested for production workloads.

## Guide-level Explanation

### Generating a Key Pair

Users generate a key pair locally using standard tools. For example, with OpenSSL (RSA 2048-bit):

```bash
# Generate private key (optionally encrypted with a passphrase)
openssl genrsa -out rsa_private_key.pem 2048

# Extract public key
openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
```

For Ed25519:

```bash
openssl genpkey -algorithm ed25519 -out ed25519_private_key.pem
openssl pkey -in ed25519_private_key.pem -pubout -out ed25519_public_key.pem
```

For ECDSA (ES256):

```bash
openssl ecparam -genkey -name prime256v1 -noout -out ec_private_key.pem
openssl ec -in ec_private_key.pem -pubout -out ec_public_key.pem
```

### Assigning a Public Key to a User

```sql
-- Create a new user with key-pair authentication
CREATE USER service_account IDENTIFIED WITH key_pair BY '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----';

-- Add an additional public key for rotation
ALTER USER service_account WITH ADD PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----';

-- Remove a key by its SHA256 fingerprint
ALTER USER service_account WITH REMOVE PUBLIC_KEY = 'SHA256:abc123...';

-- View key fingerprints
DESC USER service_account;
```

### Authenticating with a Key Pair

The client generates a short-lived JWT signed with the private key and sends it as a Bearer token:

```
Authorization: Bearer <jwt_token>
```

The JWT must contain:
- `sub` (subject): the username
- `iat` (issued at): current timestamp
- `exp` (expiration): a short TTL (e.g., 60 seconds)

The server decodes the JWT to extract the username, looks up the user's stored public keys, and verifies the signature. If any stored key validates the signature, authentication succeeds.

### Passphrase Support

If the private key is encrypted with a passphrase, the client is responsible for decrypting it before signing the JWT. The server never sees or stores the passphrase — it only stores and verifies against the public key.

## Reference-level Explanation

### Storage

A new `AuthInfo` variant is added:

```rust
pub enum AuthInfo {
    None,
    Password { hash_value: Vec<u8>, hash_method: PasswordHashMethod, need_change: bool },
    JWT,
    KeyPair { public_keys: Vec<String> },  // PEM-encoded public keys
}
```

The PEM format self-describes the key type (RSA, EC, Ed25519), so no separate key type field is needed. The key type is detected at verification time.

### Protobuf Schema

```protobuf
message AuthInfo {
  // ... existing fields ...
  message KeyPair {
    repeated string public_keys = 1;
  }

  oneof info {
    None none = 1;
    Password password = 2;
    JWT jwt = 3;
    KeyPair key_pair = 4;  // NEW
  }
}
```

### SQL Syntax

**AuthType**: A new `key_pair` authentication type is added alongside the existing types (`no_password`, `sha256_password`, `double_sha1_password`, `jwt`).

**CREATE USER**:

```sql
CREATE USER <username> IDENTIFIED WITH key_pair BY '<public_key_pem>';
```

This creates the user with a single public key. The `BY` clause carries the PEM-encoded public key.

**ALTER USER** (key management via user options):

```sql
-- Add a public key to the user's key list
ALTER USER <username> WITH ADD PUBLIC_KEY = '<public_key_pem>';

-- Remove a public key by its SHA256 fingerprint
ALTER USER <username> WITH REMOVE PUBLIC_KEY = '<sha256_fingerprint>';
```

Using `IDENTIFIED WITH key_pair BY '<pem>'` in ALTER USER replaces all existing keys with the new one.

**DESCRIBE USER**: Shows SHA256 fingerprints of all stored public keys.

### Authentication Flow

When a Bearer JWT token arrives at the HTTP handler:

1. Check if the token is a Databend session token (`bend-v1-*`). If so, handle as before.
2. Decode the JWT **without verification** to extract the `sub` (subject) claim, which contains the username.
3. Look up the user in meta by username.
4. Check the user's `auth_info`:
   - If `AuthInfo::KeyPair`: iterate over stored public keys, attempt to verify the JWT signature with each. Accept on first match.
   - If `AuthInfo::JWT`: fall through to existing JWKS-based verification (unchanged).
   - Otherwise: reject with an authentication error.
5. Validate standard JWT claims: `exp` must not be in the past, `iat` must be present and not in the future.
6. Enforce network policy, set authenticated user in session.

This approach requires no changes to the HTTP middleware — routing between key-pair and JWKS verification is handled entirely in `AuthMgr::auth()` based on the user's stored auth type.

### Key Validation

When a public key is assigned to a user (via CREATE USER or ALTER USER), the server validates:

- The PEM is well-formed and contains a public key (not a private key or certificate).
- The key type is one of: RSA, ECDSA (P-256/P-384), or Ed25519.
- For RSA keys, the minimum key size is 2048 bits.

Invalid keys are rejected with a descriptive error message.

### Key Fingerprint

Key fingerprints are computed as `SHA256:<base64>` of the DER-encoded public key bytes (same convention as OpenSSH). This is used for:

- `DESC USER` output to identify keys without exposing the full PEM.
- `REMOVE PUBLIC_KEY` to specify which key to remove.

### Supported Algorithms

| Algorithm | Key Type | JWT `alg` Header |
|-----------|----------|-----------------|
| RSA       | RSA 2048+ bit | RS256 |
| ECDSA     | P-256    | ES256 |
| ECDSA     | P-384    | ES384 |
| Ed25519   | Ed25519  | EdDSA |

The server detects the algorithm from the PEM key type and the JWT `alg` header. A mismatch between the stored key type and the JWT algorithm results in a verification failure.

### Protocol Support

- **HTTP**: Fully supported via Bearer JWT tokens.
- **MySQL protocol**: Not supported. Key-pair users attempting to connect via MySQL protocol receive a clear error message. This is a fundamental limitation — the MySQL wire protocol does not support JWT-based authentication.
- **FlightSQL**: Supported via Bearer JWT tokens in the authorization header.

### JWT Token Format

The client-generated JWT must follow this structure:

**Header**:
```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": "service_account",
  "iat": 1714300000,
  "exp": 1714300060
}
```

- `sub` (required): The Databend username.
- `iat` (required): Issued-at timestamp.
- `exp` (required): Expiration timestamp. Recommended TTL is 60 seconds.

The token is signed with the user's private key using the algorithm that matches the key type.

### Backward Compatibility

The new `KeyPair` variant is added to the protobuf `AuthInfo.oneof info` as field number 4. Compatibility behavior:

- **Old query reading non-KeyPair users**: Completely unaffected. Protobuf silently ignores unknown fields that are not part of the deserialized message.
- **Old query reading a KeyPair user**: The `oneof info` field resolves to `None` (the unknown variant is skipped by protobuf). `AuthInfo::from_pb()` returns an `Incompatible` error. This only affects operations on that specific user (login, DESC USER, etc.) — all other users remain fully functional.
- **No global version bump required**: `MIN_READER_VER` does not need to increase, since old versions can still process all existing auth types.

This satisfies the requirement: if a KeyPair user exists, old versions only error for that user; if no KeyPair users exist, old versions are completely unaffected.

## Drawbacks

- Adds complexity to the authentication system with a new auth type and key management SQL.
- JWT-based auth over HTTP adds a decode + verify step per request (mitigated by short-lived tokens and efficient signature verification).
- MySQL protocol cannot support this auth method, which may confuse users who expect uniform behavior across protocols.

## Rationale and Alternatives

### Why a new `AuthInfo` variant instead of `UserOption` fields?

Authentication method is fundamentally about *how a user proves identity*. Storing it in `AuthInfo` keeps the auth model consistent — `AuthInfo` is the single source of truth. Splitting keys across `AuthInfo` and `UserOption` would create incoherent states (e.g., a password user with RSA keys in options).

### Why a list of keys instead of fixed key_1/key_2 slots?

A list is more flexible and doesn't artificially limit the number of active keys. This supports scenarios like gradual rollout across many clients, each with their own key. Key removal by fingerprint is straightforward regardless of list size.

### Why detect key type from PEM instead of storing it explicitly?

PEM format already encodes the key type in its header and ASN.1 structure. Storing a redundant key type field adds a consistency risk (stored type vs. actual key type mismatch). Detection at verification time is reliable and simple.

### Alternative: mTLS

Mutual TLS is another approach to certificate-based authentication. However, it requires TLS termination at the Databend server (not a load balancer), is harder to configure, and doesn't integrate with Databend's existing user management. Key-pair JWT auth is lighter-weight and works through any HTTP proxy.

## Unresolved Questions

- Should there be a maximum number of public keys per user? A reasonable default limit (e.g., 10) could prevent abuse without restricting legitimate use.
- Should the JWT `iss` (issuer) claim be validated? Snowflake uses `<account>.<user>.SHA256:<fingerprint>` as the issuer. We could adopt a similar convention or leave it optional initially.
- Should key-pair auth be supported for the `root` user, or restricted to non-built-in users only?

## Future Possibilities

- **Client SDK integration**: Provide helper libraries in Python, Go, Java, and Rust for generating and signing JWTs with key pairs.
- **Automatic key rotation**: Allow users to set key expiration dates, with warnings before expiry.
- **Certificate-based auth**: Extend to support X.509 certificates, where the server validates the certificate chain in addition to the signature.
- **`bendsql` integration**: Add `--private-key` and `--passphrase` flags to `bendsql` for native key-pair authentication.
