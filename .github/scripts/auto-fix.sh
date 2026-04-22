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

# PR body log
PR_LOG=""
log() { PR_LOG="${PR_LOG}${1}\n"; echo "$1"; }

git checkout -b "$BRANCH"

# Step 1: Generate fix
log "### Step 1: Generate fix (\`${GEN_LABEL}\`)"
GEN_OUTPUT=$(evot -p "Fix this issue in databend-docs by modifying files under docs/en/.
Follow existing doc style. Read related files first.

The Databend source code is available at _databend/src/ for reference.
Use it to check actual implementation details (settings, functions, SQL syntax, etc.)
when writing documentation.

IMPORTANT: Only modify files. Do NOT run git commit, git push, gh pr create, or any git/gh commands.
The CI script handles all git operations.

Issue #${NUM}: ${TITLE}
${BODY}" \
  $GEN_MODEL_ARG \
  --output-format stream-json \
  --max-turns 30 --max-duration 600 2>&1 || true)

# Extract stats from run_finished event
GEN_STATS=$(echo "$GEN_OUTPUT" | grep '"run_finished"' | tail -1 | jq -r '{turns: .payload.turn_count, duration_ms: .payload.duration_ms, input_tokens: .payload.usage.input, output_tokens: .payload.usage.output}' 2>/dev/null || echo '{}')
GEN_TURNS=$(echo "$GEN_STATS" | jq -r '.turns // "?"')
GEN_DURATION=$(echo "$GEN_STATS" | jq -r '.duration_ms // 0')
GEN_INPUT=$(echo "$GEN_STATS" | jq -r '.input_tokens // "?"')
GEN_OUTPUT_T=$(echo "$GEN_STATS" | jq -r '.output_tokens // "?"')
GEN_DURATION_S=$((GEN_DURATION / 1000))
log "- Turns: ${GEN_TURNS}, Duration: ${GEN_DURATION_S}s, Tokens: ${GEN_INPUT} in / ${GEN_OUTPUT_T} out"

if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard docs/)" ]; then
  echo "No changes"
  cleanup_on_failure
  exit 0
fi

# Step 2: Review loop (max 2 rounds)
APPROVED=false
REVIEW_ROUND=0
for round in 1 2; do
  REVIEW_ROUND=$round
  git add docs/
  DIFF=$(git diff --cached)
  [ -z "$DIFF" ] && { APPROVED=true; break; }

  log ""
  log "### Step 2: Review round ${round} (\`${REV_LABEL}\`)"

  REV_OUTPUT=$(evot -p "Review this diff for issue #${NUM}: ${TITLE}
${BODY}

Respond ONLY with JSON: {\"approved\": bool, \"comments\": \"...\"}

${DIFF}" \
    $REV_MODEL_ARG \
    --output-format stream-json \
    --max-turns 1 --max-duration 60 2>&1 || true)

  # Extract review text
  REVIEW=$(echo "$REV_OUTPUT" | grep '"run_finished"' | tail -1 | jq -r '.payload.text // ""' 2>/dev/null || true)

  # Extract stats
  REV_STATS=$(echo "$REV_OUTPUT" | grep '"run_finished"' | tail -1 | jq -r '{duration_ms: .payload.duration_ms, input_tokens: .payload.usage.input, output_tokens: .payload.usage.output}' 2>/dev/null || echo '{}')
  REV_DURATION=$(echo "$REV_STATS" | jq -r '.duration_ms // 0')
  REV_INPUT=$(echo "$REV_STATS" | jq -r '.input_tokens // "?"')
  REV_OUTPUT_T=$(echo "$REV_STATS" | jq -r '.output_tokens // "?"')
  REV_DURATION_S=$((REV_DURATION / 1000))
  log "- Duration: ${REV_DURATION_S}s, Tokens: ${REV_INPUT} in / ${REV_OUTPUT_T} out"

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
  log "### Step 3: Address review round ${round} (\`${GEN_LABEL}\`)"

  FIX_OUTPUT=$(evot -p "Address this review for issue #${NUM}:
${COMMENTS}

IMPORTANT: Only modify files. Do NOT run git commit, git push, gh pr create, or any git/gh commands." \
    $GEN_MODEL_ARG \
    --output-format stream-json \
    --max-turns 20 --max-duration 300 2>&1 || true)

  FIX_STATS=$(echo "$FIX_OUTPUT" | grep '"run_finished"' | tail -1 | jq -r '{turns: .payload.turn_count, duration_ms: .payload.duration_ms, input_tokens: .payload.usage.input, output_tokens: .payload.usage.output}' 2>/dev/null || echo '{}')
  FIX_TURNS=$(echo "$FIX_STATS" | jq -r '.turns // "?"')
  FIX_DURATION=$(echo "$FIX_STATS" | jq -r '.duration_ms // 0')
  FIX_INPUT=$(echo "$FIX_STATS" | jq -r '.input_tokens // "?"')
  FIX_OUTPUT_T=$(echo "$FIX_STATS" | jq -r '.output_tokens // "?"')
  FIX_DURATION_S=$((FIX_DURATION / 1000))
  log "- Turns: ${FIX_TURNS}, Duration: ${FIX_DURATION_S}s, Tokens: ${FIX_INPUT} in / ${FIX_OUTPUT_T} out"
done

# Step 4: PR
git add docs/
git commit -m "docs: auto-fix #${NUM}" || { cleanup_on_failure; exit 0; }
git push origin "$BRANCH" --force

STATUS=$( [ "$APPROVED" = true ] && echo "✅ Approved" || echo "⚠️ Needs human review (not approved after ${REVIEW_ROUND} rounds)" )

PR_BODY="Fixes #${NUM}.

**Status:** ${STATUS}
**Generator:** \`${GEN_LABEL}\` | **Reviewer:** \`${REV_LABEL}\` | **Review rounds:** ${REVIEW_ROUND}

---

## Process Log

$(echo -e "$PR_LOG")"

gh pr create --repo "$REPO" --base "$MAIN" --head "$BRANCH" \
  --title "docs: auto-fix #${NUM}" \
  --body "$PR_BODY" \
  --label auto-fix || true

# Mark done
gh issue edit "$NUM" --repo "$REPO" --add-label auto-fix-done --remove-label auto-fix-in-progress
