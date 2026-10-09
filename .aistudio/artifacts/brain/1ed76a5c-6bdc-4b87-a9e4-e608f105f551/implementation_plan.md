# Commercial Quote Management System, Monthly Records Analytics & Archival Workflow

Deliver a comprehensive commercial quote management and records analytics system within the Crystal Ice Operations Control dashboard. This update restores broken status updating endpoints, introduces date-based sorting with a bidirectional toggle, implements soft-delete archival preserving historical records, and adds a dedicated monthly records tracking feature that aggregates quote volumes and trends by month using request dates.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user requirements and confirmed choices are incorporated:

- **Confirmed Status Workflow**: Commercial quotes support 5 active operational statuses plus an archive state:
  1. `Pending Review`
  2. `In Review`
  3. `Quoted`
  4. `Accepted`
  5. `Rejected`
  6. `Archived` (triggered via the Delete/Archive action)
- **Confirmed Date Sorting**: Defaulting to **Newest First**, with a one-click sort toggle button allowing the business operator to switch between Newest First and Oldest First.
- **Confirmed Deletion Behavior**: Clicking "Delete" acts as an **Archive** action. Quotes marked as Archived are removed from the active queue while remaining preserved in historical business records.
- **Monthly Records & Volume Feature**:
  - Automatically aggregates quote inquiries by request date (`created_at` timestamp).
  - Dynamically calculates the volume (amounts) of quotes per month (e.g. Total Inquiries, Active vs. Archived, Acceptance Rate).
  - Provides a dedicated "Monthly Records Breakdown" interactive panel showing historical monthly cohorts (e.g. October 2026, September 2026) with volume metrics, date spans, and status distributions.
  - Includes a monthly filter selector allowing operators to inspect quotes requested in any specific month or view all-time records.
  - Automatically recalculates monthly totals whenever quotes are submitted, updated in status, or archived.

---

## 1. Overview & Core Concept

### What It Does
Empowers Crystal Ice sales and dispatch managers to:
1. Process incoming bulk ice and commercial blast freezing inquiries through their complete operational lifecycle with active statuses (`Pending Review`, `In Review`, `Quoted`, `Accepted`, `Rejected`).
2. Track monthly commercial demand trends with real-time monthly quote counts and request date records.
3. Filter and sort quote records chronologically (newest/oldest) or by specific month.
4. Safely archive completed or discarded quotes with zero data loss, keeping them accessible in the records repository with full audit details and one-click restoration.

### Target Audience & Persona
- **Sales & Logistics Managers**: Reviewing monthly inbound inquiry trends, tracking seasonal demand surges, and managing quote proposals.
- **Dispatch Supervisors**: Coordinating fulfillment schedules and accessing customer coordinates.

### Key Value Delivered
- **Monthly Business Intelligence**: Immediate visibility into monthly quote volumes without external spreadsheets.
- **Zero Data Loss**: Inquiries are never permanently destroyed; archival preserves audit trails, client contacts, and volume demand history in business records.
- **Unbroken Operations**: Direct fix for endpoint route mismatch (`/api/admin/quotes/:id/status` vs `/api/admin/quotes/:id`), ensuring status changes sync across memory, disk, and edge storage.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Admin Operations Control                        │
│                         Quotes Navigation Tab                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Monthly Quote Records & Volume Overview              │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │ This Month (Oct '26) │  │ Last Month (Sep '26) │  │ 2026 Total   │  │
│  │      14 Quotes       │  │      11 Quotes       │  │  85 Quotes   │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘  │
│  [ Monthly Filter: All Months ▼ ]  [ Sort Date: Newest First ⇅ ]      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│     Active Quotes (Default)  │          │      Archived Records        │
│  - Filter by Status / Month  │          │  - Monthly Historical Archive│
│  - Live Status Dropdown      │          │  - Restore / Unarchive       │
│  - Date Requested (Tabular)  │          │  - Read-only Audit View      │
│  - "Delete / Archive" Button │          │  - Request Date & Notes      │
└──────────────────────────────┘          └──────────────────────────────┘
```

### Visual Identity & Theme
- **Color Palette & Status Indicators**:
  - `Pending Review`: Warm Amber accent (`bg-amber-50 text-amber-800 border-amber-200`)
  - `In Review`: Sky Blue accent (`bg-sky-50 text-sky-800 border-sky-200`)
  - `Quoted`: Indigo accent (`bg-indigo-50 text-indigo-800 border-indigo-200`)
  - `Accepted`: Emerald Green accent (`bg-emerald-50 text-emerald-800 border-emerald-200`)
  - `Rejected`: Rose Red accent (`bg-rose-50 text-rose-800 border-rose-200`)
  - `Archived`: Slate Gray accent (`bg-slate-100 text-slate-600 border-slate-200`)
- **Monthly Summary Cards & Records Table**:
  - Clean border cards (`border border-slate-200 bg-white rounded-2xl p-4`) using tabular monospace numerals (`font-mono font-bold text-lg text-slate-900 tabular-nums`).
  - No decorative AI pill bloat; clean typography with subtle date separators.
  - Dedicated expandable "Monthly Records Table" summarizing quotes requested per month, accepted volumes, and archival rate.
- **Controls & Affordances**:
  - Segmented control for **Active Quotes** vs. **Archived Records**.
  - **Month Filter Dropdown**: Quickly isolate quotes requested in a specific month or view all records.
  - **Date Sort Toggle Button**: Clean icon button (`ArrowUpDown`) switching between "Newest First" and "Oldest First".
  - **Delete / Archive Button**: Trash icon button with quick confirmation to prevent accidental archival.
  - **Restore Button**: One-tap restore icon (`RotateCcw`) for archived records.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Monthly Aggregation Strategy
- **Approach**: Dynamically aggregate all quote requests by month and year (`YYYY-MM`) based on their `created_at` timestamp.
- **Why**: Keeps calculations always reactive to newly submitted or edited quotes without requiring an inflexible static database table.
- **Metrics Computed**:
  - Total quote requests per month.
  - Status breakdown for that month (Pending Review, In Review, Quoted, Accepted, Rejected, Archived).
  - Monthly growth / volume variance.

### Decision 2: Endpoint Path & Parameter Normalization
- **Issue Diagnosed**: Client calls `PATCH /api/admin/quotes/${id}/status`. In `cf-worker.ts`, the route stripped `/api/admin/quotes/` leaving `${id}/status` as the ID lookup string, resulting in 404 errors.
- **Resolution**:
  1. Standardize route parsing to strip both `/status` and trailing segments cleanly in Express and Cloudflare Worker.
  2. Implement `DELETE /api/admin/quotes/:id` (which transitions the quote to `Archived` status) and `POST /api/admin/quotes/:id/restore`.
  3. Normalize legacy lowercase status values (`pending`, `reviewed`, etc.) to the new unified enum.

### Decision 3: Soft Archival vs. Hard Deletion
- **Approach**: Deletion transitions the quote to `Archived` status and excludes it from active totals, but keeps it viewable under the "Archived Records" view.
- **Why**: Protects customer phone/email records, provides historical pricing auditability, and avoids accidental data loss.

---

## 4. Technical Architecture & Data Strategy

### System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React Admin Dashboard                           │
│                      (AdminDashboard.tsx Quotes)                       │
├────────────────────────────────────────────────────────────────────────┤
│ - activeView: 'active' | 'archived'                                    │
│ - selectedMonth: 'all' | 'YYYY-MM'                                     │
│ - statusFilter: 'all' | QuoteStatus                                    │
│ - sortDirection: 'desc' (Newest) | 'asc' (Oldest)                      │
│                                                                        │
│ Computed Monthly Records:                                              │
│   Record = { monthKey: string, monthName: string, count: number, ... } │
│                                                                        │
│ Handlers:                                                              │
│ - handleUpdateQuoteStatus(id, newStatus)                               │
│ - handleArchiveQuote(id)                                               │
│ - handleRestoreQuote(id)                                               │
│ - handleToggleDateSort()                                               │
│ - handleFilterMonth(monthKey)                                          │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
       Local Dev / Node Server            Cloudflare Worker Runtime
       (server.ts & store.ts)                (server/cf-worker.ts)
  ┌───────────────────────────────┐    ┌────────────────────────────────┐
  │ PATCH /api/admin/quotes/:id   │    │ PATCH /api/admin/quotes/:id    │
  │ DELETE /api/admin/quotes/:id  │    │ DELETE /api/admin/quotes/:id   │
  │ POST /api/admin/quotes/:id/.. │    │ POST /api/admin/quotes/:id/..  │
  │ GET /api/admin/quotes         │    │ GET /api/admin/quotes          │
  └───────────────────────────────┘    └────────────────────────────────┘
```

### Data Schema Extensions
In `src/types/index.ts`:
```typescript
export type QuoteStatus =
  | 'Pending Review'
  | 'In Review'
  | 'Quoted'
  | 'Accepted'
  | 'Rejected'
  | 'Archived';

export interface MonthlyQuoteRecord {
  monthKey: string;      // e.g. "2026-10"
  monthName: string;     // e.g. "October 2026"
  totalQuotes: number;
  activeCount: number;
  archivedCount: number;
  pendingCount: number;
  quotedCount: number;
  acceptedCount: number;
  rejectedCount: number;
}
```

### API Endpoints
1. `GET /api/admin/quotes`: Returns all quote requests with support for date sorting.
2. `PATCH /api/admin/quotes/:id/status` & `PATCH /api/admin/quotes/:id`: Updates status and internal notes.
3. `DELETE /api/admin/quotes/:id`: Sets status to `'Archived'`.
4. `POST /api/admin/quotes/:id/restore`: Restores an archived quote back to `'Pending Review'`.

---

## 5. Verification & Deployment Plan

1. **Local TypeScript Verification**: Run `lint_applet` and `compile_applet` to verify types across client, services, and server files.
2. **Endpoint Validation**: Test live PATCH, DELETE/Archive, RESTORE, and GET endpoints in the development environment.
3. **Monthly Analytics Validation**: Verify that quote request dates accurately update monthly volume totals, status counts, and month filters.
4. **Build & Edge Deployment**: Execute `npm run build` and deploy updated worker code to Cloudflare via `wrangler deploy`.
5. **Verification on Cloudflare**: Verify live response from `https://crystalice1.alexsibanda1379.workers.dev` confirming working status transitions, date sorting, monthly breakdown, and archival behavior.
