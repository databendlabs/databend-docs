#!/usr/bin/env bash
set -euo pipefail

MAIN="main"
NUM=$(echo "$ISSUE_JSON" | jq -r '.number')
TITLE=$(echo "$ISSUE_JSON" | jq -r '.title')
BODY=$(echo "$ISSUE_JSON" | jq -r '.body')

# Reuse existing PR branch if provided, otherwise create new
if [ -n "${EXISTING_BRANCH:-}" ]; then
  BRANCH="$EXISTING_BRANCH"
  echo "=== #${NUM}: ${TITLE} (appending to ${BRANCH}) ==="
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
else
  BRANCH="auto-fix/issue-${NUM}"
  echo "=== #${NUM}: ${TITLE} ==="
fi

# Rollback label on failure
cleanup_on_failure() {
  gh issue edit "$NUM" --repo "$REPO" --add-label auto-fix --remove-label auto-fix-in-progress 2>/dev/null || true
}
trap cleanup_on_failure ERR

# Skip if PR exists (only for new branches, not when appending)
if [ -z "${EXISTING_BRANCH:-}" ]; then
  if [ "$(gh pr list --repo "$REPO" --head "$BRANCH" --json number --jq 'length')" -gt 0 ]; then
    echo "PR exists, skip"
    gh issue edit "$NUM" --repo "$REPO" --add-label auto-fix-done --remove-label auto-fix-in-progress
    exit 0
  fi
fi

# Build model args
GEN_MODEL_ARG=""
[ -n "${GENERATOR_MODEL:-}" ] && GEN_MODEL_ARG="--model $GENERATOR_MODEL"
REV_MODEL_ARG=""
[ -n "${REVIEWER_MODEL:-}" ] && REV_MODEL_ARG="--model $REVIEWER_MODEL"
GEN_LABEL="${GENERATOR_MODEL:-default}"
REV_LABEL="${REVIEWER_MODEL:-default}"

# Extract assistant log from stream-json output
# Collects all assistant_completed text entries, truncated to keep PR body readable
extract_assistant_log() {
  local output="$1"
  echo "$output" | grep '"assistant_completed"' | jq -r '
    .payload.content[]? | select(.type=="text") | .text // empty
  ' 2>/dev/null | head -100
}

# Extract stats from run_finished event
extract_stats() {
  local output="$1"
  echo "$output" | grep '"run_finished"' | tail -1 | jq -r '{
    turns: .payload.turn_count,
    duration_s: ((.payload.duration_ms // 0) / 1000 | floor),
    input: .payload.usage.input,
    output: .payload.usage.output
  }' 2>/dev/null || echo '{"turns":"?","duration_s":0,"input":"?","output":"?"}'
}

format_stats() {
  local stats="$1"
  local turns=$(echo "$stats" | jq -r '.turns // "?"')
  local dur=$(echo "$stats" | jq -r '.duration_s // 0')
  local inp=$(echo "$stats" | jq -r '.input // "?"')
  local out=$(echo "$stats" | jq -r '.output // "?"')
  echo "Turns: ${turns} | Duration: ${dur}s | Tokens: ${inp} in / ${out} out"
}

# PR body log
PR_LOG=""
log() { PR_LOG="${PR_LOG}${1}\n"; echo "$1"; }

# Create branch only if not appending to existing
if [ -z "${EXISTING_BRANCH:-}" ]; then
  git checkout -b "$BRANCH"
fi

# --- Step 1: Generate fix ---
log "### Step 1: Generate (\`${GEN_LABEL}\`)"
GEN_RAW=$(evot -p "You are fixing a documentation issue in the databend-docs repository.

Task:
1. Read the issue carefully and understand what documentation is missing or wrong.
2. Look at _databend/src/ for the actual Databend source code to verify implementation details. Check _databend/RELEASES.txt for recent release tags to determine version numbers.
3. Read existing docs under docs/en/ to match the style and find the right location.
4. Make the fix in docs/en/.
5. If you modified any file under docs/en/, also update the corresponding file under docs/cn/ (Chinese translation). Keep technical terms in English, translate descriptions to Chinese.

Rules:
- Only modify files under docs/en/ and docs/cn/.
- Do NOT run git, gh, or any shell commands that modify the repository state.
- The CI script handles git commit, push, and PR creation.
- Analyze the Databend source code in _databend/src/ and release tags to determine which version introduced or updated the feature being documented. Then add or update the FunctionDescription component at the top of the doc (after the frontmatter):
  For docs/en/: import FunctionDescription from '@site/src/components/FunctionDescription'; then <FunctionDescription description=\"Introduced or updated: vX.Y.Z\"/>
  For docs/cn/: import FunctionDescription from '@site/src/components/FunctionDescription'; then <FunctionDescription description=\"引入或更新于：vX.Y.Z\"/>
  If the doc already has a FunctionDescription, update the version if the change is newer.
- Keep documentation concise and clear. If a setting defaults to true (enabled), do not document it separately — only mention settings that users need to explicitly change.

Issue #${NUM}: ${TITLE}
${BODY}" \
  $GEN_MODEL_ARG \
  --output-format stream-json \
  --max-turns 300 --max-duration 600 2>&1 || true)

GEN_STATS=$(extract_stats "$GEN_RAW")
log "$(format_stats "$GEN_STATS")"
log ""
log "<details><summary>Generator log</summary>"
log ""
log '```'
log "$(extract_assistant_log "$GEN_RAW")"
log '```'
log "</details>"

if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard docs/)" ]; then
  echo "No changes"
  cleanup_on_failure
  exit 0
fi

# --- Step 2: Review loop (max 2 rounds) ---
APPROVED=false
REVIEW_ROUND=0
for round in 1 2; do
  REVIEW_ROUND=$round
  git add docs/
  DIFF=$(git diff --cached)
  [ -z "$DIFF" ] && { APPROVED=true; break; }

  log ""
  log "### Review round ${round} (\`${REV_LABEL}\`)"

  REV_RAW=$(evot -p "Review this diff for issue #${NUM}: ${TITLE}
${BODY}

Respond ONLY with JSON: {\"approved\": bool, \"comments\": \"...\"}

${DIFF}" \
    $REV_MODEL_ARG \
    --output-format stream-json \
    --max-turns 1 --max-duration 120 2>&1 || true)

  REVIEW=$(echo "$REV_RAW" | grep '"run_finished"' | tail -1 | jq -r '.payload.text // ""' 2>/dev/null || true)
  REV_STATS=$(extract_stats "$REV_RAW")
  log "$(format_stats "$REV_STATS")"

  if echo "$REVIEW" | grep -q '"approved"[[:space:]]*:[[:space:]]*true'; then
    COMMENTS=$(echo "$REVIEW" | python3 -c "
import sys,json,re
t=sys.stdin.read(); m=re.search(r'\{[^}]*\}',t,re.DOTALL)
try: print(json.loads(m.group()).get('comments','LGTM'))
except: print('LGTM')" 2>/dev/null || echo "LGTM")
    log "- ✅ **Approved**: ${COMMENTS}"
    APPROVED=true
    break
  fi

  COMMENTS=$(echo "$REVIEW" | python3 -c "
import sys,json,re
t=sys.stdin.read(); m=re.search(r'\{[^}]*\}',t,re.DOTALL)
try: print(json.loads(m.group())['comments']) if m else print(t[:500])
except: print(t[:500])" 2>/dev/null || echo "$REVIEW" | head -10)

  log "- ❌ **Rejected**: ${COMMENTS}"

  log ""
  log "### Address review ${round} (\`${GEN_LABEL}\`)"

  FIX_RAW=$(evot -p "A reviewer found issues with your documentation fix for issue #${NUM}.

Feedback:
${COMMENTS}

Address the feedback. Only modify files under docs/en/ and docs/cn/.
Do NOT run git, gh, or any shell commands that modify the repository state." \
    $GEN_MODEL_ARG \
    --output-format stream-json \
    --max-turns 300 --max-duration 600 2>&1 || true)

  FIX_STATS=$(extract_stats "$FIX_RAW")
  log "$(format_stats "$FIX_STATS")"
  log ""
  log "<details><summary>Fix log</summary>"
  log ""
  log '```'
  log "$(extract_assistant_log "$FIX_RAW")"
  log '```'
  log "</details>"
done

# --- Step 3: Create or update PR ---
git add docs/
git commit -m "docs: ${TITLE} (#${NUM})" || { cleanup_on_failure; exit 0; }
git push origin "$BRANCH" --force

STATUS=$( [ "$APPROVED" = true ] && echo "✅ Approved" || echo "⚠️ Needs human review (not approved after ${REVIEW_ROUND} rounds)" )

if [ -n "${EXISTING_PR:-}" ] && [ "$EXISTING_PR" != "" ]; then
  # Append to existing PR — add comment and update body to reference new issue
  gh pr comment "$EXISTING_PR" --repo "$REPO" \
    --body "### Also fixes #${NUM}: ${TITLE}

**Status:** ${STATUS}
**Generator:** \`${GEN_LABEL}\` | **Reviewer:** \`${REV_LABEL}\` | **Review rounds:** ${REVIEW_ROUND}

<details><summary>Process log</summary>

$(echo -e "$PR_LOG")

</details>" || true

  # Append issue reference to PR body
  OLD_BODY=$(gh pr view "$EXISTING_PR" --repo "$REPO" --json body --jq '.body')
  gh pr edit "$EXISTING_PR" --repo "$REPO" \
    --body "${OLD_BODY}
Also fixes #${NUM}." || true
else
  PR_BODY="Fixes #${NUM}.

**Status:** ${STATUS}
**Generator:** \`${GEN_LABEL}\` | **Reviewer:** \`${REV_LABEL}\` | **Review rounds:** ${REVIEW_ROUND}

---

## Process Log

$(echo -e "$PR_LOG")"

  gh pr create --repo "$REPO" --base "$MAIN" --head "$BRANCH" \
    --title "${TITLE}" \
    --body "$PR_BODY" \
    --label auto-fix || true
fi

# Mark done
gh issue edit "$NUM" --repo "$REPO" --add-label auto-fix-done --remove-label auto-fix-in-progress
