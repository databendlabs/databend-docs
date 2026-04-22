#!/usr/bin/env bash
set -euo pipefail

echo "=== PR #${PR_NUMBER}: Addressing review comments ==="

# Collect inline review comments with file context and comment id
COMMENTS=$(gh api "repos/${REPO}/pulls/${PR_NUMBER}/comments" \
  --jq '[.[] | select(.user.login != "github-actions[bot]") | {id, path, line, body, user: .user.login}]' 2>/dev/null || echo '[]')

COMMENT_COUNT=$(echo "$COMMENTS" | jq 'length')
if [ "$COMMENT_COUNT" -eq 0 ]; then
  echo "No review comments to address"
  exit 0
fi

echo "Found ${COMMENT_COUNT} review comment(s)"

# Also get PR-level review comments
PR_REVIEWS=$(gh api "repos/${REPO}/pulls/${PR_NUMBER}/reviews" \
  --jq '[.[] | select(.user.login != "github-actions[bot]" and .body != "") | {id, user: .user.login, state: .state, body}]' 2>/dev/null || echo '[]')

# Get PR info
PR_TITLE=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json title --jq '.title')

# Configure git
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

# --- Step 1: Triage each comment (accept/reject + plan) ---
echo "--- Triaging comments ---"
FORMATTED=$(echo "$COMMENTS" | jq -r '.[] | "Comment #\(.id) by \(.user) on \(.path):\(.line)\n\(.body)\n---"')
PR_REVIEW_TEXT=$(echo "$PR_REVIEWS" | jq -r '.[] | "Review by \(.user) (\(.state)):\n\(.body)\n---"')

TRIAGE_OUTPUT=$(evot -p "You are triaging review comments on a documentation PR.

PR #${PR_NUMBER}: ${PR_TITLE}

The Databend source code is available at _databend/src/ for reference.

## Inline comments:
${FORMATTED}

## PR-level reviews:
${PR_REVIEW_TEXT}

For each comment, decide whether to accept or reject it.
Output a JSON array:
[
  {\"id\": <comment_id>, \"accepted\": true/false, \"reason\": \"brief explanation\"},
  ...
]

Accept if the feedback is valid and actionable. Reject if it's incorrect, out of scope, or already addressed." \
  --output-format stream-json \
  --max-turns 1 --max-duration 120 2>&1 || true)

TRIAGE_TEXT=$(echo "$TRIAGE_OUTPUT" | grep '"run_finished"' | tail -1 | jq -r '.payload.text // ""' 2>/dev/null || true)

# Reply to each inline comment with triage result
TRIAGE_JSON=$(echo "$TRIAGE_TEXT" | python3 -c "
import sys, json, re
t = sys.stdin.read()
m = re.search(r'\[.*\]', t, re.DOTALL)
if m:
    try:
        arr = json.loads(m.group())
        print(json.dumps(arr))
    except: print('[]')
else: print('[]')
" 2>/dev/null || echo '[]')

TRIAGE_COUNT=$(echo "$TRIAGE_JSON" | jq 'length')
for i in $(seq 0 $((TRIAGE_COUNT - 1))); do
  CID=$(echo "$TRIAGE_JSON" | jq -r ".[$i].id")
  ACCEPTED=$(echo "$TRIAGE_JSON" | jq -r ".[$i].accepted")
  REASON=$(echo "$TRIAGE_JSON" | jq -r ".[$i].reason")

  if [ "$ACCEPTED" = "true" ]; then
    REPLY="✅ **Accepted** — ${REASON}"
  else
    REPLY="❌ **Declined** — ${REASON}"
  fi

  gh api "repos/${REPO}/pulls/${PR_NUMBER}/comments/${CID}/replies" \
    -f body="$REPLY" 2>/dev/null || true
done

# Check if any comments were accepted
ACCEPTED_COUNT=$(echo "$TRIAGE_JSON" | jq '[.[] | select(.accepted == true)] | length')
if [ "$ACCEPTED_COUNT" -eq 0 ]; then
  echo "No comments accepted, nothing to fix"
  exit 0
fi

# --- Step 2: Apply accepted fixes ---
echo "--- Applying ${ACCEPTED_COUNT} accepted fix(es) ---"
ACCEPTED_COMMENTS=$(echo "$TRIAGE_JSON" | jq -r '[.[] | select(.accepted == true)] | .[] | "Comment #\(.id): \(.reason)"')

# Get the full comment bodies for accepted ones
ACCEPTED_IDS=$(echo "$TRIAGE_JSON" | jq -r '[.[] | select(.accepted == true) | .id] | @csv')
ACCEPTED_DETAILS=$(echo "$COMMENTS" | jq -r --argjson triage "$TRIAGE_JSON" '
  [.[] | . as $c | if ($triage | map(select(.id == $c.id and .accepted == true)) | length > 0) then . else empty end]
  | .[] | "File: \(.path), Line: \(.line)\n\(.body)\n---"
')

OUTPUT=$(evot -p "You are fixing a documentation PR based on accepted review feedback.

PR #${PR_NUMBER}: ${PR_TITLE}

The Databend source code is available at _databend/src/ for reference.

## Accepted feedback to address:
${ACCEPTED_DETAILS}

Task:
1. Read each accepted comment and the referenced file.
2. Make the requested changes.
3. If you modify docs/en/, also update the corresponding docs/cn/ file.

Rules:
- Only modify files under docs/en/ and docs/cn/.
- Do NOT run git, gh, or any shell commands that modify the repository state." \
  --output-format stream-json \
  --max-turns 300 --max-duration 600 2>&1 || true)

# Extract stats
STATS=$(echo "$OUTPUT" | grep '"run_finished"' | tail -1 | jq -r '{
  turns: .payload.turn_count,
  duration_s: ((.payload.duration_ms // 0) / 1000 | floor),
  input: .payload.usage.input,
  output: .payload.usage.output
}' 2>/dev/null || echo '{}')
echo "Stats: $(echo "$STATS" | jq -c .)"

# Check for changes
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard docs/)" ]; then
  echo "No changes made"
  gh pr comment "$PR_NUMBER" --repo "$REPO" \
    --body "Reviewed the feedback — accepted ${ACCEPTED_COUNT} comment(s) but no file changes were needed." || true
  exit 0
fi

# Commit and push
git add docs/
git commit -m "docs: address review feedback on PR #${PR_NUMBER}" || exit 0
git push origin HEAD --force-with-lease

# Extract assistant log
ASSISTANT_LOG=$(echo "$OUTPUT" | grep '"assistant_completed"' | jq -r '
  .payload.content[]? | select(.type=="text") | .text // empty
' 2>/dev/null | head -80)

TURNS=$(echo "$STATS" | jq -r '.turns // "?"')
DURATION=$(echo "$STATS" | jq -r '.duration_s // 0')
INPUT_T=$(echo "$STATS" | jq -r '.input // "?"')
OUTPUT_T=$(echo "$STATS" | jq -r '.output // "?"')

# Summary comment on PR
COMMENT_BODY="### Addressed review feedback

**Accepted:** ${ACCEPTED_COUNT}/${COMMENT_COUNT} comments | Turns: ${TURNS} | Duration: ${DURATION}s | Tokens: ${INPUT_T} in / ${OUTPUT_T} out

<details><summary>Agent log</summary>

\`\`\`
${ASSISTANT_LOG}
\`\`\`

</details>"

gh pr comment "$PR_NUMBER" --repo "$REPO" --body "$COMMENT_BODY" || true
