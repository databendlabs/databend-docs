#!/usr/bin/env bash
set -euo pipefail

MAIN=$(git rev-parse --abbrev-ref HEAD)
NUM=$(echo "$ISSUE_JSON" | jq -r '.number')
TITLE=$(echo "$ISSUE_JSON" | jq -r '.title')
BODY=$(echo "$ISSUE_JSON" | jq -r '.body')
BRANCH="auto-fix/issue-${NUM}"

echo "=== #${NUM}: ${TITLE} ==="

# Rollback label on failure
cleanup_on_failure() {
  gh issue edit "$NUM" --repo "$REPO" --add-label auto-fix --remove-label auto-fix-in-progress 2>/dev/null || true
}
trap cleanup_on_failure ERR

# Skip if PR exists
if [ "$(gh pr list --repo "$REPO" --head "$BRANCH" --json number --jq 'length')" -gt 0 ]; then
  echo "PR exists, skip"
  gh issue edit "$NUM" --repo "$REPO" --add-label auto-fix-done --remove-label auto-fix-in-progress
  exit 0
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

git checkout -b "$BRANCH"

# --- Step 1: Generate fix ---
log "### Step 1: Generate (\`${GEN_LABEL}\`)"
GEN_RAW=$(evot -p "You are fixing a documentation issue in the databend-docs repository.

Task:
1. Read the issue carefully and understand what documentation is missing or wrong.
2. Look at _databend/src/ for the actual Databend source code to verify implementation details.
3. Read existing docs under docs/en/ to match the style and find the right location.
4. Make the fix in docs/en/.
5. If you modified any file under docs/en/, also update the corresponding file under docs/cn/ (Chinese translation). Keep technical terms in English, translate descriptions to Chinese.

Rules:
- Only modify files under docs/en/ and docs/cn/.
- Do NOT run git, gh, or any shell commands that modify the repository state.
- The CI script handles git commit, push, and PR creation.

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

# --- Step 3: Create PR ---
git add docs/
git commit -m "docs: ${TITLE}" || { cleanup_on_failure; exit 0; }
git push origin "$BRANCH" --force

STATUS=$( [ "$APPROVED" = true ] && echo "✅ Approved" || echo "⚠️ Needs human review (not approved after ${REVIEW_ROUND} rounds)" )

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

# Mark done
gh issue edit "$NUM" --repo "$REPO" --add-label auto-fix-done --remove-label auto-fix-in-progress
