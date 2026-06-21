# Support Integration Guide

This document outlines how Creator OS Support tickets are routed to incidents and error tracking.

## Support Ticket Categories → Error Types

| Category         | Error Type           | Priority     | Auto-Escalation                   |
| ---------------- | -------------------- | ------------ | --------------------------------- |
| **Billing**      | `ERR_PAYMENT_FAILED` | Low → Urgent | Yes, if retry fails 3x            |
| **Streaming**    | `ERR_STREAM_*`       | High         | Yes, if stream down > 5 min       |
| **Store**        | `ERR_STORE_*`        | Normal       | No, requires manual review        |
| **Integrations** | `ERR_INTEGRATION_*`  | Normal       | Yes, after 1 hour                 |
| **Technical**    | Any error            | Varies       | Yes, if affects multiple creators |

---

## Data Flow: Error → Ticket

```
Frontend Error (useApiData catch block)
    ↓
Logger.error() → Backend observability platform
    ↓
Error triggers alert in Support dashboard
    ↓
Auto-create ticket (if high-severity)
    ↓
Route to support queue based on category
    ↓
Creator receives notification + status updates
```

## Implementation

### 1. Wire Logger Errors to Support

In `trident-backend-shell/src/routes/support.routes.ts`:

```typescript
export async function createAutoTicket(errorLog: LogEntry) {
  const category = mapErrorToCategory(errorLog.error);
  const priority = mapErrorToPriority(errorLog.error);

  const ticket = await db.supportTickets.create({
    createdAt: new Date(),
    status: "open",
    creator_id: errorLog.context.userId,
    category,
    priority,
    subject: `Auto-generated: ${errorLog.message}`,
    message: `Error: ${errorLog.error}\nContext: ${JSON.stringify(errorLog.context)}`,
    auto_generated: true,
    linked_error_id: errorLog.id,
  });

  await notifyCreator(ticket);
  return ticket;
}

function mapErrorToCategory(error: string): TicketCategory {
  if (error.includes("payment")) return "billing";
  if (error.includes("stream")) return "streaming";
  if (error.includes("integration")) return "integrations";
  return "technical";
}

function mapErrorToPriority(error: string): TicketPriority {
  if (error.includes("down") || error.includes("critical")) return "high";
  if (error.includes("failed")) return "normal";
  return "low";
}
```

### 2. Notify Creators of Auto-Generated Tickets

In `trident-engines-internal/src/notifications/events.ts`:

```typescript
export async function onSupportTicketCreated(ticket: SupportTicket) {
  if (ticket.auto_generated) {
    await websocket.emit(`creator:${ticket.creator_id}`, {
      type: "SUPPORT_TICKET_AUTO_CREATED",
      ticket_id: ticket.id,
      severity: ticket.priority,
      message: `We detected an issue with your ${ticket.category}. A support ticket was created automatically.`,
      action_url: `/support?ticket_id=${ticket.id}`,
    });
  }
}
```

### 3. Track Ticket Resolution

In `trident-backend-shell/src/routes/support.routes.ts`:

```typescript
export async function resolveTicket(ticketId: string, resolutionNote: string) {
  const ticket = await db.supportTickets.findById(ticketId);

  await db.supportTickets.update(ticketId, {
    status: "resolved",
    resolved_at: new Date(),
    resolution_note: resolutionNote,
  });

  // Log resolution time
  const resolutionTime = Date.now() - ticket.created_at.getTime();
  logger.info("Support ticket resolved", {
    ticket_id: ticketId,
    creator_id: ticket.creator_id,
    category: ticket.category,
    resolution_time_ms: resolutionTime,
  });

  // Notify creator
  await websocket.emit(`creator:${ticket.creator_id}`, {
    type: "SUPPORT_TICKET_RESOLVED",
    ticket_id: ticketId,
    message: resolutionNote,
  });
}
```

---

## Support Dashboard Metrics

### Real-Time Monitoring

- **Ticket volume**: Count by category, priority, status
- **Resolution time**: P50, P95, P99 by category
- **Auto-escalations**: Count of tickets escalated from errors
- **Creator satisfaction**: Resolution rate, reopened tickets

### Dashboards (DataDog/Splunk)

```
[Support KPIs]
- Open tickets: {count by category}
- Avg resolution time: {minutes by priority}
- Auto-generated tickets: {% of total}
- Creator CSAT score: {avg rating}

[Error-to-Ticket Correlation]
- Top error types → ticket volume
- Error resolution time vs. ticket closure
- High-priority errors without tickets (gap analysis)

[Performance by Category]
- Billing: avg resolution time
- Streaming: avg resolution time
- Integrations: avg resolution time
- Technical: avg resolution time
```

---

## Suggested Resolution Workflows

### Billing Errors

1. Verify payment method is valid
2. Retry transaction
3. If fails, email creator with updated card form
4. Auto-escalate to Finance team if > $5K transaction

### Streaming Errors

1. Check stream ingest status
2. Verify broadcaster encoder settings
3. Check backend stream recorder
4. Auto-escalate to Streaming team if backend error

### Integration Errors

1. Verify API credentials are current
2. Check integration documentation
3. Test webhook delivery
4. Auto-escalate to Integrations team

### Technical Errors

1. Check error logs for stack trace
2. Reproduce issue in staging
3. Identify affected creators (scope)
4. Auto-escalate to Engineering team if > 10 creators

---

## Alert Thresholds

| Condition                          | Action              | Notification      |
| ---------------------------------- | ------------------- | ----------------- |
| **Error rate > 5%**                | Page support team   | PagerDuty         |
| **Payment errors > 10/hour**       | Alert Finance       | Email + Slack     |
| **Stream down > 10 min**           | Alert creator + ops | WebSocket + Email |
| **Integration failing for 1 hour** | Auto-escalate       | Ticket + Slack    |
| **Unresolved ticket > 24h**        | Escalate to manager | Email + Slack     |

---

## Testing

### Simulate Support Ticket Creation

```bash
curl -X POST http://localhost:3000/api/support \
  -H "Content-Type: application/json" \
  -d '{
    "creator_id": "test-creator-123",
    "name": "Test Creator",
    "email": "test@example.com",
    "category": "streaming",
    "priority": "high",
    "message": "Test ticket from simulation"
  }'
```

### Verify Notification Delivery

```bash
# Check WebSocket event logs
tail -f logs/websocket.log | grep "SUPPORT_TICKET"

# Check support ticket creation in DB
SELECT * FROM support_tickets WHERE auto_generated = true ORDER BY created_at DESC LIMIT 10;
```

---

## Rollout Plan

### Phase 1: Manual Ticket Creation Only

- Creators submit via `/support` form
- Support team triages manually
- Log all resolutions

### Phase 2: Auto-Escalate High-Severity Errors

- Billing errors → auto-create tickets
- Stream downtime > 5 min → auto-create tickets
- Notify creators immediately

### Phase 3: AI-Assisted Resolution

- Suggest docs + FAQ articles
- Auto-reply with troubleshooting steps
- Escalate to support team if unresolved

### Phase 4: Full Automation

- Self-healing for known error patterns
- Auto-notify when issue resolved
- Creator satisfaction feedback loop

---

## Monitoring Checklist

- [ ] Error logger wired to backend observability
- [ ] Support ticket auto-creation implemented for high-severity errors
- [ ] Creator notifications via WebSocket working
- [ ] Resolution tracking and metrics capturing
- [ ] Support dashboard displaying ticket KPIs
- [ ] Escalation alerts configured in PagerDuty
- [ ] Team trained on new support workflow
- [ ] Rollback procedure documented

---

Generated: 2026-06-21
