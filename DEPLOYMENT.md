# Deployment Checklist v1.0.0

This document guides deploying Creator OS v1.0.0 to production with safety guardrails, health checks, and rollback procedures.

---

## Pre-Deployment Validation

- [ ] All tests pass: `npm run typecheck && npm run build && npm run test`
- [ ] Smoke tests green: All 11 pages pass state contract validation
- [ ] Code review complete: All PRs merged to main
- [ ] Git tag v1.0.0 created and pushed
- [ ] CHANGELOG.md updated with v1.0.0 release notes
- [ ] No breaking changes to API contracts
- [ ] Database migrations (if any) tested on staging
- [ ] Environment variables documented in `.env.example`

---

## Environment Configuration

### Staging (staging.livestreamlab.com)

```bash
# .env.staging
NODE_ENV=production
API_URL=https://api-staging.livestreamlab.com
WS_URL=wss://ws-staging.livestreamlab.com
LOG_LEVEL=debug
FEATURE_FLAGS=LIVE_INDICATOR:true,KEYBOARD_SHORTCUTS:true
```

### Production (livestreamlab.com)

```bash
# .env.production
NODE_ENV=production
API_URL=https://api.livestreamlab.com
WS_URL=wss://ws.livestreamlab.com
LOG_LEVEL=warn
FEATURE_FLAGS=LIVE_INDICATOR:true,KEYBOARD_SHORTCUTS:true,OBSERVABILITY:true
```

---

## Staging Deployment (48-hour soak)

### Day 1: Deploy to Staging

- [ ] **Build** Frontend

  ```bash
  cd trident-frontend
  npm run build
  # Output: dist/
  ```

- [ ] **Build** Backend

  ```bash
  cd trident-backend-shell
  npm run build
  # Output: dist/
  ```

- [ ] **Deploy** Frontend to staging CDN

  ```bash
  # Upload dist/ to s3://livestreamlab-staging/frontend/v1.0.0/
  aws s3 sync dist/ s3://livestreamlab-staging/frontend/v1.0.0/ \
    --cache-control "public, max-age=31536000"
  ```

- [ ] **Deploy** Backend to staging ECS cluster

  ```bash
  # Deploy docker image to staging environment
  docker build -t livestreamlab-backend:v1.0.0 .
  aws ecr push livestreamlab-backend:v1.0.0
  aws ecs update-service --cluster staging-ecs --service backend \
    --force-new-deployment
  ```

- [ ] **Verify** Staging Deployment

  ```bash
  curl -s https://api-staging.livestreamlab.com/health
  # Expected: {"status": "ok", "timestamp": "..."}

  curl -s https://api-staging.livestreamlab.com/api/analytics/overview
  # Expected: {"overview": {...}}
  ```

### Day 1-2: Smoke Test on Staging

- [ ] **Frontend smoke tests** pass

  ```bash
  npm run test
  # Expected: 11/11 pages pass
  ```

- [ ] **Manual QA checklist**
  - [ ] Dashboard loads, shows KPIs
  - [ ] Keyboard shortcuts work (Cmd+S/U/E/R)
  - [ ] Support form submits, creates ticket
  - [ ] Live indicator connects to WebSocket
  - [ ] Error states appear (simulate network error)
  - [ ] Toast notifications auto-dismiss after 4s
  - [ ] Accessibility: Tab through all fields, screen reader works

- [ ] **API health checks** (automated)

  ```bash
  # Check every endpoint responds
  npm run test:api:staging
  # Expected: All 50+ endpoints respond with < 500ms latency
  ```

- [ ] **Performance tests**
  - [ ] Page load time < 2s (P95)
  - [ ] Form submission < 500ms
  - [ ] WebSocket connection < 100ms

- [ ] **Load test** (simulated traffic)
  ```bash
  # 100 concurrent creators, 5 minute duration
  artillery quick --count 100 --num 500 https://staging.livestreamlab.com
  # Expected: < 1% error rate
  ```

### Day 2: Go/No-Go Decision

- [ ] **Operations team sign-off**: "Production ready"
- [ ] **Product team sign-off**: "All features working as designed"
- [ ] **Ops team on-call**: Named operator for production rollout
- [ ] **Rollback plan communicated**: If issues, we revert to Phase 4 (commit 19239d8)

---

## Production Deployment (Phased Rollout)

### Phase 1: 10% of Creators (2 hours)

- [ ] **Update DNS** to route 10% of requests to v1.0.0

  ```bash
  # Using AWS Route53 weighted routing
  # 90% → Phase 4 (19239d8)
  # 10% → Phase 5 (v1.0.0)
  ```

- [ ] **Monitor metrics** every 5 minutes
  - Error rate (target: < 0.5%)
  - Live indicator uptime (target: > 99%)
  - Support ticket volume (baseline + 20% expected)
  - API response times (target: < 500ms P95)

- [ ] **Alerting active** in PagerDuty
  - Error rate spike → page on-call
  - WebSocket disconnect > 5 min → page on-call
  - Support tickets > 2x baseline → page support lead

### Phase 2: 50% of Creators (4 hours)

- [ ] **Verify Phase 1 metrics** are healthy
  - Error rate < 0.5%
  - Live indicator > 99% uptime
  - No unplanned support tickets

- [ ] **Increase routing** to 50%

  ```bash
  # 50% → Phase 4
  # 50% → Phase 5
  ```

- [ ] **Continue monitoring** same cadence
  - Watch for error rate spike
  - Watch for WebSocket issues
  - Watch for form submission failures

### Phase 3: 100% of Creators (Final)

- [ ] **Verify Phase 2 metrics** remained healthy for 4+ hours
- [ ] **Increase routing** to 100%
  ```bash
  # 100% → Phase 5 (v1.0.0)
  ```
- [ ] **Enable full observability**: All logging to production platform
- [ ] **Declare v1.0.0 production-ready**

---

## Rollback Procedure (If Issues Detected)

### Immediate Action (< 5 minutes)

If error rate spikes > 2% or WebSocket disconnects:

- [ ] **Revert DNS** to Phase 4 (commit 19239d8)

  ```bash
  # Route 100% traffic back to Phase 4
  aws route53 change-resource-record-sets \
    --hosted-zone-id <zone-id> \
    --change-batch file://rollback.json
  ```

- [ ] **Notify creators** via WebSocket

  ```
  "We're experiencing issues. We've rolled back to a stable version.
  Our team is investigating. Thank you for your patience."
  ```

- [ ] **Page on-call** to investigate root cause

  ```bash
  # Check error logs
  tail -f /var/log/livestreamlab/error.log | grep Phase5

  # Check recent changes
  git log --oneline -10 v1.0.0
  ```

### Post-Incident (1-2 hours)

- [ ] **Root cause identified**: Network issue? Code bug? Third-party API?
- [ ] **Fix committed** to git
- [ ] **New tag created**: v1.0.1
- [ ] **Staging deployment**: Verify fix on staging
- [ ] **Production redeployment**: Phased rollout again (10% → 50% → 100%)

---

## Feature Flags (Gradual Rollout)

Feature flags enable zero-downtime feature rollouts:

```typescript
// In dashboard.tsx
if (FEATURE_FLAGS.KEYBOARD_SHORTCUTS) {
  // Enable keyboard shortcuts (Cmd+S/U/E/R)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { /* ... */ };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

if (FEATURE_FLAGS.LIVE_INDICATOR) {
  // Show live connection status
  return <LiveIndicator url={WS_URL} />;
}
```

### Deployment Command

```bash
# Enable keyboard shortcuts for 50% of creators
curl -X POST https://api.livestreamlab.com/admin/feature-flags \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "flag": "KEYBOARD_SHORTCUTS",
    "enabled_percentage": 50
  }'
```

---

## Health Checks (Automated)

Run these checks every 5 minutes during rollout:

```bash
#!/bin/bash

# 1. API Health
api_health=$(curl -s https://api.livestreamlab.com/health | jq '.status')
if [ "$api_health" != '"ok"' ]; then
  alert "API_DOWN" "API health check failed"
fi

# 2. WebSocket Health
ws_health=$(curl -s https://ws.livestreamlab.com/health | jq '.status')
if [ "$ws_health" != '"ok"' ]; then
  alert "WS_DOWN" "WebSocket health check failed"
fi

# 3. Database Health
db_health=$(curl -s https://api.livestreamlab.com/admin/db-health | jq '.status')
if [ "$db_health" != '"connected"' ]; then
  alert "DB_DISCONNECT" "Database connection lost"
fi

# 4. Error Rate
error_rate=$(curl -s https://api.livestreamlab.com/admin/metrics | jq '.error_rate')
if (( $(echo "$error_rate > 0.005" | bc -l) )); then
  alert "ERROR_RATE_HIGH" "Error rate: $error_rate (target: < 0.5%)"
fi

# 5. Response Time (P95)
response_p95=$(curl -s https://api.livestreamlab.com/admin/metrics | jq '.response_time_p95')
if (( $(echo "$response_p95 > 500" | bc -l) )); then
  alert "LATENCY_HIGH" "Response time P95: ${response_p95}ms (target: < 500ms)"
fi
```

---

## Support Team Prep

Before production deployment:

- [ ] **Train support team** on new features
  - Keyboard shortcuts (Cmd+S/U/E/R)
  - Live indicator (WebSocket connection status)
  - Observability (error logs, ticket auto-creation)

- [ ] **FAQ updated** with common issues
  - "Keyboard shortcuts not working?" → Check your OS
  - "Live indicator red?" → Check WebSocket connection
  - "Ticket auto-created?" → Here's what it means

- [ ] **On-call rotation** established
  - Named operator during Phase 1/2/3 rollout
  - Escalation path: Support → Ops → Engineering
  - PagerDuty configured

- [ ] **Creator communication** drafted
  - In-app notification: "Exciting updates in v1.0.0"
  - Email: "What's new: keyboard shortcuts, live status"
  - Link to LAUNCH_NARRATIVE.md

---

## Metrics to Monitor

### Real-Time Dashboard (DataDog/Splunk)

```
[v1.0.0 Rollout Dashboard]
├─ Error Rate (target: < 0.5%)
├─ Response Time P95 (target: < 500ms)
├─ WebSocket Uptime (target: > 99%)
├─ Support Ticket Volume
├─ Live Indicator Pulse Rate
├─ Keyboard Shortcut Usage
└─ Creator Feedback Score

[Phase 3 Comparison (Fallback)]
├─ Error Rate: [Phase 4 value]
├─ Response Time: [Phase 4 value]
├─ Uptime: [Phase 4 value]
```

### Alert Thresholds

| Metric                | Yellow Alert | Red Alert   | Action               |
| --------------------- | ------------ | ----------- | -------------------- |
| **Error Rate**        | > 1%         | > 2%        | Rollback if > 2%     |
| **Response Time P95** | > 600ms      | > 1000ms    | Investigate latency  |
| **WebSocket Uptime**  | < 98%        | < 95%       | Rollback if < 95%    |
| **Support Tickets**   | 2x baseline  | 3x baseline | Page support lead    |
| **CPU Usage**         | > 70%        | > 90%       | Scale up or rollback |

---

## Rollback Checklist (If Needed)

- [ ] **Revert DNS routing** to Phase 4
- [ ] **Notify creators** via WebSocket + email
- [ ] **Page on-call** for incident investigation
- [ ] **Root cause identified** (network, code, third-party)
- [ ] **Fix tested** on staging
- [ ] **New tag created** (v1.0.1)
- [ ] **Postmortem scheduled** (24 hours post-incident)
- [ ] **Lessons captured** in incident log

---

## Success Criteria

✅ **v1.0.0 is production-ready when:**

- Error rate < 0.5% across all 3 rollout phases
- WebSocket uptime > 99.5%
- No unplanned support tickets
- All health checks passing
- Metrics match or exceed Phase 4 baseline
- No critical bugs found
- Team confidence: "We're ready to call this released"

---

## Post-Deployment (Week 1)

- [ ] **Monitor metrics** 24/7
- [ ] **Collect creator feedback** (in-app surveys, support tickets)
- [ ] **Weekly metrics review** (error rate, response time, support volume)
- [ ] **Creator announcement**: "v1.0.0 fully live"
- [ ] **Publish postmortem** (if any incidents)
- [ ] **Plan Phase 6**: Creator feedback loop

---

## Contacts & Escalation

| Role                    | Name   | Phone   | Slack         |
| ----------------------- | ------ | ------- | ------------- |
| **On-Call Ops**         | [Name] | [Phone] | @oncall-ops   |
| **On-Call Engineering** | [Name] | [Phone] | @oncall-eng   |
| **Support Lead**        | [Name] | [Phone] | @support-lead |
| **Product Manager**     | [Name] | [Phone] | @pm           |
| **VP Operations**       | [Name] | [Phone] | @vp-ops       |

---

**Deployment Date:** 2026-06-21  
**Prepared by:** Engineering  
**Approved by:** Operations, Product  
**Rollback Plan:** Tested & Ready
