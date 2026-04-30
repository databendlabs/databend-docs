---
title: Key-Pair Authentication
description: RFC for per-user key-pair authentication using public key cryptography.
---

- Tracking Issue: https://github.com/databendlabs/databend/pull/19786

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
-- Create a new user with key-pair authentication (full PEM or bare base64 both accepted)
CREATE USER service_account IDENTIFIED WITH key_pair BY 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...';

-- Add an additional public key with a label for identification
ALTER USER service_account WITH ADD PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...' LABEL = 'ci-pipeline';

-- Remove a key by its label or fingerprint
ALTER USER service_account WITH REMOVE PUBLIC_KEY LABEL = 'ci-pipeline';
ALTER USER service_account WITH REMOVE PUBLIC_KEY FINGERPRINT = 'SHA256:abc123...';

-- View key count
DESC USER service_account;

-- View key fingerprints, labels, and creation times
SHOW PUBLIC KEYS FOR USER service_account;
```

Both full PEM format (with `-----BEGIN PUBLIC KEY-----` headers) and bare base64-encoded key body are accepted as input. Internally, only the base64 body is stored. For convenience in SQL strings, the one-line base64 body is recommended — it avoids newline/escaping issues in SQL literals.

### Authenticating with a Key Pair

The client generates a short-lived JWT signed with the private key and sends it as a Bearer token with a custom header to distinguish from JWKS-based JWT auth:

```
Authorization: Bearer <jwt_token>
X-DATABEND-AUTH-METHOD: keypair
```

The `X-DATABEND-AUTH-METHOD: keypair` header is required. Without it, the server routes the Bearer token to the existing JWKS-based JWT verification flow.

The JWT must contain:
- `sub` (subject): the username
- `iss` (issuer): `<tenant>.<username>` — binds the token to a specific tenant and user, preventing cross-tenant replay
- `iat` (issued at): current timestamp
- `exp` (expiration): a short TTL (e.g., 60 seconds)

The server validates the `iss` claim against the current tenant and `sub` claim before verifying the signature. If any stored key validates the signature, authentication succeeds.

### Passphrase Support

If the private key is encrypted with a passphrase, the client is responsible for decrypting it before signing the JWT. The server never sees or stores the passphrase — it only stores and verifies against the public key.

## Reference-level Explanation

### Storage

A new `AuthInfo` variant is added:

```rust
pub struct PublicKeyEntry {
    pub key: String,        // base64-encoded public key body (no PEM headers)
    pub label: String,      // user-provided label for identification
    pub created_at: String, // ISO 8601 timestamp when the key was added
}

pub enum AuthInfo {
    None,
    Password { hash_value: Vec<u8>, hash_method: PasswordHashMethod, need_change: bool },
    JWT,
    KeyPair { public_keys: Vec<PublicKeyEntry> },
}
```

The DER-encoded key body self-describes the key type (RSA, EC, Ed25519) via its ASN.1 AlgorithmIdentifier OID, so no separate key type field is needed. The key type is detected at verification time by reconstructing the PEM and attempting to parse.

### Protobuf Schema

```protobuf
message AuthInfo {
  // ... existing fields ...
  message PublicKeyEntry {
    string key = 1;
    string label = 2;
    string created_at = 3;
  }
  message KeyPair {
    repeated PublicKeyEntry public_keys = 1;
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
CREATE USER <username> IDENTIFIED WITH key_pair BY '<public_key>';
```

This creates the user with a single public key. The `BY` clause accepts either full PEM or bare base64 body.

**ALTER USER** (key management via user options):

```sql
-- Add a public key with an optional label (only for key-pair users)
ALTER USER <username> WITH ADD PUBLIC_KEY = '<public_key>' LABEL = '<label>';

-- Remove a public key by its label
ALTER USER <username> WITH REMOVE PUBLIC_KEY LABEL = '<label>';

-- Remove a public key by its SHA256 fingerprint
ALTER USER <username> WITH REMOVE PUBLIC_KEY FINGERPRINT = '<sha256_fingerprint>';

```

`ADD PUBLIC_KEY` and `REMOVE PUBLIC_KEY` are only allowed for users already configured with key-pair authentication. To switch a password/JWT user to key-pair auth, use `ALTER USER <username> IDENTIFIED WITH key_pair BY '<key>'`.

Using `IDENTIFIED WITH key_pair BY '<key>'` in ALTER USER is rejected if the user already uses key-pair authentication — use `ADD PUBLIC_KEY` / `REMOVE PUBLIC_KEY` to manage keys instead. This prevents accidental replacement of all existing keys.

**DESCRIBE USER**: Shows the number of stored public keys as an integer in the `public_keys` column.

**SHOW PUBLIC KEYS FOR USER**:

```sql
SHOW PUBLIC KEYS FOR USER <username>;
```

Returns one row per key with columns: `fingerprint`, `label`, `created_at`. This is the primary way to inspect key details.

### Constraints

- **Root user restriction**: Key-pair authentication is not supported for the `root` user. Only non-built-in users can use key-pair auth.
- **Maximum keys per user**: A global setting `max_public_keys_per_user` (default: 10, range: 1–100) limits the number of public keys per user. Attempting to add a key beyond this limit is rejected.
- **Last key protection**: Removing the last public key from a key-pair user is rejected. The user must always have at least one key.
- **Label constraints**: Labels are trimmed on input, must be 128 characters or fewer, and must be unique per user. Duplicate labels are rejected.
- **Duplicate key protection**: Adding a public key with the same fingerprint as an existing key is rejected.

### Authentication Flow

When a Bearer JWT token arrives at the HTTP handler:

1. Check if the token is a Databend session token (`bend-v1-*`). If so, handle as before.
2. Check the `X-DATABEND-AUTH-METHOD` header:
   - If `keypair`: route to key-pair authentication flow.
   - Otherwise: route to existing JWKS-based JWT verification (unchanged).
3. Key-pair flow:
   a. Decode the JWT payload without verification to extract the `sub` (username) and `iss` (issuer) claims.
   b. Validate `iss` matches `<tenant>.<username>`. Reject if missing or mismatched.
   c. Look up the user in meta by username.
   d. Verify the user's `auth_info` is `AuthInfo::KeyPair`.
   d. Iterate over stored public keys, attempt to verify the JWT signature with each. Accept on first match.
   e. Validate standard JWT claims: `exp` must not be in the past, `iat` must be present and not in the future.
   f. Enforce network policy, set authenticated user in session.

### Key Validation

When a public key is assigned to a user (via CREATE USER or ALTER USER), the server validates:

- The PEM is well-formed and contains a public key (not a private key or certificate).
- The key type is one of: RSA, ECDSA (P-256/P-384), or Ed25519.
- For RSA keys, the minimum key size is 2048 bits.

Invalid keys are rejected with a descriptive error message.

### Key Fingerprint

Key fingerprints are computed as `SHA256:<base64>` where the input is the SHA-256 digest of the DER-encoded public key bytes (decoded from the stored base64 body). The output is base64-encoded without padding. This matches the OpenSSH fingerprint convention, so users can verify with standard tools:

```bash
openssl pkey -pubin -in key.pem -outform DER | openssl dgst -sha256 -binary | base64
```

This is used for:

- `SHOW PUBLIC KEYS FOR USER` output to identify keys without exposing the full key.
- `REMOVE PUBLIC_KEY FINGERPRINT` to specify which key to remove.

### Supported Algorithms

| Algorithm | Key Type | JWT `alg` Header |
|-----------|----------|-----------------|
| RSA       | RSA 2048+ bit | RS256 |
| ECDSA     | P-256    | ES256 |
| ECDSA     | P-384    | ES384 |
| Ed25519   | Ed25519  | EdDSA |

The server detects the algorithm from the PEM key type and the JWT `alg` header. A mismatch between the stored key type and the JWT algorithm results in a verification failure.

### Protocol Support

- **HTTP**: Fully supported via Bearer JWT tokens with `X-DATABEND-AUTH-METHOD: keypair` header.
- **MySQL protocol**: Not supported. Key-pair users attempting to connect via MySQL protocol receive a clear error message. The MySQL wire protocol does not support JWT-based authentication.
- **FlightSQL**: Not supported in the initial implementation. The current FlightSQL handshake only accepts Basic auth, and subsequent Bearer tokens are server-generated session IDs, not user-signed JWTs. Supporting key-pair auth over FlightSQL would require changes to the handshake and metadata flow, which is deferred to a future iteration.

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
  "iss": "my_tenant.service_account",
  "iat": 1714300000,
  "exp": 1714300060
}
```

- `sub` (required): The Databend username.
- `iss` (required): Issuer in `<tenant>.<username>` format. Validated by the server to prevent cross-tenant replay.
- `iat` (required): Issued-at timestamp.
- `exp` (required): Expiration timestamp. Recommended TTL is 60 seconds.

The token is signed with the user's private key using the algorithm that matches the key type.

### Backward Compatibility

The new `KeyPair` variant is added to the protobuf `AuthInfo.oneof info` as field number 4. Compatibility behavior:

- **Old query reading non-KeyPair users**: Completely unaffected. Protobuf silently ignores unknown fields that are not part of the deserialized message.
- **Old query reading a KeyPair user**: The `oneof info` field resolves to `None` (the unknown variant is skipped by protobuf). `AuthInfo::from_pb()` returns an `Incompatible` error.
- **Impact scope**: This error affects not only login and DESC USER for that specific user, but also any operation that scans the full user set — including `SHOW USERS` and system table reads (`system.users`). If any KeyPair user exists, old query nodes will fail on these bulk operations.
- **Upgrade ordering**: All query nodes must be upgraded before creating any KeyPair user. Once a KeyPair user exists, rolling back to an old version will break user-listing operations. It is recommended to upgrade all nodes first, then enable key-pair auth.
- **No global version bump required**: `MIN_READER_VER` does not need to increase, since old versions can still process all existing auth types. The incompatibility is limited to the new `KeyPair` variant.

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

### Why store base64 body instead of full PEM?

Following Snowflake's approach, we strip PEM headers/footers and store only the base64-encoded key body. This keeps storage compact and uniform. Both full PEM and bare base64 are accepted as input — the server normalizes to base64 body on write. At verification time, the PEM is reconstructed by wrapping the stored body with standard headers. The DER-encoded key body still self-describes the algorithm via its ASN.1 OID, so key type detection is unaffected.

### Does sequential key type detection have a performance cost?

Negligible. `from_pem()` internally parses the DER AlgorithmIdentifier OID (a few-byte comparison) and returns immediately on mismatch — microsecond-level. The actual JWT signature verification (RSA/ECDSA) is millisecond-level, three orders of magnitude more expensive. If optimization is ever needed, we could parse the DER OID once to determine the type upfront, but this is unnecessary for now.

### Alternative: mTLS

Mutual TLS is another approach to certificate-based authentication. However, it requires TLS termination at the Databend server (not a load balancer), is harder to configure, and doesn't integrate with Databend's existing user management. Key-pair JWT auth is lighter-weight and works through any HTTP proxy.

## Unresolved Questions

(None at this time.)

## Future Possibilities

- **Client SDK integration**: Provide helper libraries in Python, Go, Java, and Rust for generating and signing JWTs with key pairs.
- **Automatic key rotation**: Allow users to set key expiration dates, with warnings before expiry.
- **Certificate-based auth**: Extend to support X.509 certificates, where the server validates the certificate chain in addition to the signature.
- **`bendsql` integration**: Add `--private-key` and `--passphrase` flags to `bendsql` for native key-pair authentication.
- **FlightSQL support**: Extend the FlightSQL handshake to accept key-pair JWT tokens, including `X-DATABEND-AUTH-METHOD` metadata propagation.
