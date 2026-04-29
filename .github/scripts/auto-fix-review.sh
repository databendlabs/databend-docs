#!/usr/bin/env bash
set -euo pipefail

echo "=== PR #${PR_NUMBER}: Addressing review comments ==="

# Collect inline review comments (exclude our own bot replies)
COMMENTS=$(gh api "repos/${REPO}/pulls/${PR_NUMBER}/comments" \
  --jq '[.[] | select(.user.login != "github-actions[bot]" and (.in_reply_to_id == null)) | {id, path, line, body, user: .user.login}]' 2>/dev/null || echo '[]')

# Also get PR-level reviews
PR_REVIEWS=$(gh api "repos/${REPO}/pulls/${PR_NUMBER}/reviews" \
  --jq '[.[] | select(.user.login != "github-actions[bot]" and .body != "") | {id, user: .user.login, state: .state, body}]' 2>/dev/null || echo '[]')

INLINE_COUNT=$(echo "$COMMENTS" | jq 'length')
REVIEW_COUNT=$(echo "$PR_REVIEWS" | jq 'length')
TOTAL=$((INLINE_COUNT + REVIEW_COUNT))

if [ "$TOTAL" -eq 0 ]; then
  echo "No review comments to address"
  exit 0
fi

echo "Found ${INLINE_COUNT} inline comment(s), ${REVIEW_COUNT} review(s)"

# Format for prompt
FORMATTED=$(echo "$COMMENTS" | jq -r '.[] | "Comment #\(.id) by \(.user) on \(.path):\(.line):\n\(.body)\n---"')
PR_REVIEW_TEXT=$(echo "$PR_REVIEWS" | jq -r '.[] | "Review by \(.user) (\(.state)):\n\(.body)\n---"')

# Get PR info
PR_TITLE=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json title --jq '.title')

# Configure git
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

# Verify evot works
echo "--- Testing evot ---"
evot -p "say ok" --max-turns 1 --max-duration 10 2>&1 | tail -3 || echo "evot test failed"

# --- Run evot to triage + fix in one pass ---
echo "--- Processing review feedback ---"
OUTPUT=$(evot -p "You are addressing review feedback on a documentation PR.

PR #${PR_NUMBER}: ${PR_TITLE}

The Databend source code is available at _databend/src/ for reference. Check _databend/RELEASES.txt for recent release tags to determine version numbers.

## Inline review comments:
${FORMATTED}

## PR-level reviews:
${PR_REVIEW_TEXT}

Task:
1. For each comment, decide: accept (valid, actionable) or decline (incorrect, out of scope, already addressed).
2. Output your triage as a summary first.
3. Then make the accepted changes to the files.
4. If you modify docs/en/, also update the corresponding docs/cn/ file.

Rules:
- Only modify files under docs/en/ and docs/cn/.
- Do NOT run git, gh, or any shell commands that modify the repository state.
- The CI script handles git commit, push, and PR replies.
- Analyze the Databend source code in _databend/src/ and release tags to determine which version introduced or updated the feature being documented. Then add or update the FunctionDescription component at the top of the doc (after the frontmatter):
  For docs/en/: import FunctionDescription from '@site/src/components/FunctionDescription'; then <FunctionDescription description=\"Introduced or updated: vX.Y.Z\"/>
  For docs/cn/: import FunctionDescription from '@site/src/components/FunctionDescription'; then <FunctionDescription description=\"引入或更新于：vX.Y.Z\"/>
  If the doc already has a FunctionDescription, update the version if the change is newer.
- Keep documentation concise and clear. If a setting defaults to true (enabled), do not document it separately — only mention settings that users need to explicitly change." \
  --output-format stream-json \
  --max-turns 300 --max-duration 600 2>&1 || true)

# Extract stats
STATS=$(echo "$OUTPUT" | grep '"run_finished"' | tail -1 | jq -r '{
  turns: .payload.turn_count,
  duration_s: ((.payload.duration_ms // 0) / 1000 | floor),
  input: .payload.usage.input,
  output: .payload.usage.output
}' 2>/dev/null || echo '{"turns":"?","duration_s":0,"input":"?","output":"?"}')

TURNS=$(echo "$STATS" | jq -r '.turns // "?"')
DURATION=$(echo "$STATS" | jq -r '.duration_s // 0')
INPUT_T=$(echo "$STATS" | jq -r '.input // "?"')
OUTPUT_T=$(echo "$STATS" | jq -r '.output // "?"')
echo "Stats: turns=${TURNS} duration=${DURATION}s tokens=${INPUT_T}/${OUTPUT_T}"

# Extract assistant log
ASSISTANT_LOG=$(echo "$OUTPUT" | grep '"assistant_completed"' | jq -r '
  .payload.content[]? | select(.type=="text") | .text // empty
' 2>/dev/null | head -100)

# Check for changes
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard docs/)" ]; then
  echo "No file changes"
  gh pr comment "$PR_NUMBER" --repo "$REPO" \
    --body "### Review feedback processed

Reviewed ${TOTAL} comment(s) — no file changes needed.

Turns: ${TURNS} | Duration: ${DURATION}s | Tokens: ${INPUT_T} in / ${OUTPUT_T} out

<details><summary>Agent log</summary>

\`\`\`
${ASSISTANT_LOG}
\`\`\`

</details>" || true
  exit 0
fi

# Commit and push
git add docs/
git commit -m "docs: address review feedback on PR #${PR_NUMBER}" || exit 0
git push origin HEAD --force-with-lease

# Comment on PR
gh pr comment "$PR_NUMBER" --repo "$REPO" \
  --body "### Addressed review feedback

Reviewed ${TOTAL} comment(s) | Turns: ${TURNS} | Duration: ${DURATION}s | Tokens: ${INPUT_T} in / ${OUTPUT_T} out

<details><summary>Agent log</summary>

\`\`\`
${ASSISTANT_LOG}
\`\`\`

</details>" || true
