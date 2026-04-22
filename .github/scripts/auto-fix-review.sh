#!/usr/bin/env bash
set -euo pipefail

echo "=== PR #${PR_NUMBER}: Addressing review comments ==="

# Collect review comments with file context
COMMENTS=$(gh api "repos/${REPO}/pulls/${PR_NUMBER}/comments" \
  --jq '[.[] | select(.user.login != "github-actions[bot]") | {path, line, body}]' 2>/dev/null || echo '[]')

COMMENT_COUNT=$(echo "$COMMENTS" | jq 'length')
if [ "$COMMENT_COUNT" -eq 0 ]; then
  echo "No review comments to address"
  exit 0
fi

echo "Found ${COMMENT_COUNT} review comment(s)"

# Format comments for the prompt
FORMATTED=$(echo "$COMMENTS" | jq -r '.[] | "File: \(.path), Line: \(.line)\n\(.body)\n---"')

# Also get PR-level review comments (not inline)
PR_REVIEWS=$(gh api "repos/${REPO}/pulls/${PR_NUMBER}/reviews" \
  --jq '[.[] | select(.user.login != "github-actions[bot]" and .body != "") | {user: .user.login, state: .state, body}]' 2>/dev/null || echo '[]')
PR_REVIEW_TEXT=$(echo "$PR_REVIEWS" | jq -r '.[] | "\(.user) (\(.state)):\n\(.body)\n---"')

# Get PR info
PR_TITLE=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json title --jq '.title')
PR_BODY=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json body --jq '.body')

# Configure git
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

# Run evot to address feedback
PROMPT="You are improving a documentation PR based on review feedback.

PR #${PR_NUMBER}: ${PR_TITLE}

The Databend source code is available at _databend/src/ for reference.
Use it to verify implementation details when needed.

## Inline review comments:
${FORMATTED}

## PR-level reviews:
${PR_REVIEW_TEXT}

Task:
1. Read each review comment carefully.
2. Check the referenced files and lines.
3. Fix the issues raised by reviewers.
4. If you modify docs/en/, also update the corresponding docs/cn/ file.

Rules:
- Only modify files under docs/en/ and docs/cn/.
- Do NOT run git, gh, or any shell commands that modify the repository state.
- The CI script handles git commit and push."

OUTPUT=$(evot -p "$PROMPT" \
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
    --body "Reviewed the feedback but no changes were needed or possible." || true
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

# Comment on PR with what was done
COMMENT_BODY="### Addressed review feedback

Turns: ${TURNS} | Duration: ${DURATION}s | Tokens: ${INPUT_T} in / ${OUTPUT_T} out

<details><summary>Agent log</summary>

\`\`\`
${ASSISTANT_LOG}
\`\`\`

</details>"

gh pr comment "$PR_NUMBER" --repo "$REPO" --body "$COMMENT_BODY" || true
