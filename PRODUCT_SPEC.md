# LaundryStrap — Product Spec (Single‑Tenant Laundry Management System)

**Goal:** Prevent item misplacement and delays in a laundry operation by enforcing *identity, chain-of-custody, and time visibility* from intake → cleaning → ready → pickup/delivery.

**Primary outcomes (success criteria):**
- Every physical bundle (bag) and every customer order has a scannable identity.
- Staff can always answer: *Where is it? What’s in it? What’s next? When is it due?*
- Exception handling is fast: missing item, wrong bag, overdue stage, customer no-show.
- Auditable timeline (who did what, when) to diagnose misplacements and delays.

**Non-goals (MVP):** accounting, payroll, vendor procurement, complex multi-store tenancy, consumer marketplace.

---

## 1) Operating Model Assumptions
- **Single-tenant**: one laundry business instance; multiple staff users.
- Orders may be: walk-in drop-off, scheduled pickup, or delivery drop-off.
- Items may be processed as bulk *bags*; item-level tracking is optional but supported for high-risk categories.
- One order may contain multiple bags; one bag belongs to exactly one order.
- Identification relies on **printed QR labels** (or durable tags) applied at intake.

---

## 2) Entities & Data Model (Conceptual)

### Core
- **Customer**
  - name, phone, email (optional), addresses (optional), notes, preferences
- **Order**
  - orderId (human-readable + internal UUID)
  - customerId
  - serviceType(s): wash-fold, dry clean, iron, stain treatment, etc. (MVP: free-text + optional preset)
  - promisedBy (timestamp) + SLA policy used
  - status (pipeline stage)
  - totals: bagsCount, piecesCount (optional), specialInstructions
  - timestamps: createdAt, updatedAt, closedAt
- **Bag (Bundle)**
  - bagId (QR)
  - orderId
  - bagType: standard / delicate / dry-clean / bedding (MVP: preset + free text)
  - contentsSummary (free text), piecesCount (optional)
  - weight (optional)
  - photos[]
  - bagStatus (inherits order stage but can have per-bag stage if needed later)
- **Item (Optional, for item-level tracking)**
  - itemId (QR)
  - orderId, bagId
  - category (shirt/pants/etc), color, brand, notes, photo
  - flags: fragile, stain, missing-button

### Supporting
- **StatusEvent (audit log)**
  - entityType (order/bag/item)
  - entityId
  - fromStatus → toStatus
  - actorUserId
  - timestamp
  - note (optional)
- **SLA Timer**
  - orderId
  - startedAt
  - dueAt
  - breachedAt (nullable)
  - stageDueAt[] (optional later)
- **Task/Exception**
  - orderId/bagId/itemId
  - type: missing-item, damage, customer-contact, overdue, rewash
  - severity, status (open/closed), assignee

---

## 3) Roles & Permissions

### Staff
- Create customer (minimal fields)
- Create order + bags
- Print QR labels
- Scan QR to find order/bag and update status
- Capture photos at intake (and optionally at packing)
- Mark stage transitions (wash started, drying, ready, etc.)
- Create exceptions/tasks
- View due times and overdue list

### Admin
- All staff permissions
- Configure pipeline stages + SLA policies
- Manage users/roles
- Manage label templates + printer settings
- View analytics (throughput, SLA compliance)
- Data export/backup settings

*(Optional later)* Driver role for pickup/delivery route operations.

---

## 4) Core Workflows

### 4.1 Intake (Drop-off / Pickup Receipt)
**Purpose:** Create a reliable identity + evidence snapshot.

1. Staff searches/creates customer.
2. Create order:
   - select service type(s)
   - set promisedBy automatically from SLA policy (override allowed with admin permission)
   - capture special instructions
3. Add bags (default 1):
   - bag type
   - contents summary / piece count
4. **Photo capture (MVP):** at least 1 photo per bag at intake.
5. **Tagging:** print and attach QR label to each bag (and optionally order summary label).
6. Confirm intake: order enters **"Received"** stage; SLA timer starts.

**Key guardrails:**
- Cannot move past intake without generating at least one bag QR.
- UI should support rapid repeat: "Add another bag".

---

### 4.2 Tagging / QR Scanning
**Purpose:** Make every handoff scan-verified.

- QR on bag resolves to bag detail:
  - customer, order, promisedBy, current stage, photos
  - actions: update stage, add note, add exception
- Scan flows:
  - *Single scan* updates: choose next stage (big buttons)
  - *Batch scan* (nice-to-have): scan multiple bags then apply same stage

**Misplacement prevention:**
- If staff tries to add a bag to an order but scans an existing bagId from another order → hard error + alert.

---

### 4.3 Bagging / Re-bagging
**Purpose:** Preserve chain-of-custody even when bags change.

- Support “Replace bag” action:
  - old bag marked retired (cannot be reused)
  - new bagId created and linked
  - audit event recorded

(MVP can defer this; require manual note if bags change.)

---

### 4.4 Photos (Evidence)
**Minimum:** intake photo per bag.

**Nice-to-have:**
- Optional packing photo at "Ready" stage
- Simple annotation (stain, tear) and damage exception capture

---

### 4.5 Status Pipeline (Order/Bags)
**Default pipeline (MVP):**
1. Received
2. Sorting
3. Washing/Cleaning
4. Drying
5. Folding/Packing
6. Ready for Pickup/Delivery
7. Completed (Picked up/Delivered)

**Rules:**
- Status transitions are discrete events (audit log).
- An order status is derived from its bags:
  - if any bag in earlier stage → order stage is min(stage)
  - completed only when all bags completed

**Exceptions:**
- On Hold (customer contact needed)
- Rewash

---

### 4.6 SLA Timers & Alerts
**MVP:** single dueAt per order.

- When order created: compute **dueAt** based on SLA policy (e.g., 24h/48h) and operating hours.
- Views:
  - “Due soon” (next 6/12/24 hours)
  - “Overdue” list with age and current stage
- Notifications (MVP: in-app badges; optional email/SMS later)

**Nice-to-have:** stage-level SLAs (e.g., sorting within 2h).

---

### 4.7 Pickup / Delivery

#### Pickup (customer comes to store)
1. Search by name/phone or scan order QR.
2. Confirm bags scanned out (optional but recommended).
3. Mark order Completed; record payment status (optional) and pickup timestamp.

#### Delivery (staff/driver)
1. Assign delivery address + window.
2. Mark “Out for Delivery” (optional stage).
3. Confirm delivered → Completed.

**MVP scope:** pickup at counter; delivery can be manual (address stored + status update).

---

## 5) MVP Scope (Minimum Viable Product)

### Must-have
- Users: staff/admin authentication
- Customer CRUD (minimal)
- Order create with promisedBy and service notes
- Bags: create multiple bags per order
- QR generation for order + each bag
- Label printing (PDF label export is acceptable MVP)
- Intake photo per bag (upload from mobile/web)
- Scan QR to open bag/order + update status
- Status pipeline + audit log
- DueAt SLA + overdue list
- Basic search (customer name/phone, orderId, bagId)

### Out of scope for MVP
- Payments, invoicing
- Route optimization
- Full inventory itemization by default
- Multi-tenant

---

## 6) Nice-to-Haves (Post-MVP)
- Item-level tagging for premium/dry-clean/high-risk items
- Batch scan and batch stage updates
- Stage-level SLAs + bottleneck analytics
- Automated SMS/WhatsApp updates to customers
- Driver mobile mode + proof-of-delivery photo/signature
- Barcode/QR printer direct integration (Zebra, Brother)
- Tablet-first intake mode with quick camera workflow
- Damage/missing-claim workflow with customer acknowledgement
- Customer portal (check status, schedule pickup)
- Integrations: POS, accounting

---

## 7) Key Screens (MVP)
- Login
- Dashboard: Due soon, Overdue, Recently updated
- Orders list + filters (status, dueAt)
- Create order (intake flow)
- Order detail (bags list, timeline, dueAt)
- Bag detail (QR view, photo, status update)
- Scan screen (camera-based)
- Customers list + detail
- Admin settings: statuses, SLA policies, users, label template

---

## 8) User Stories (MVP)

### Intake & Identity
1. **As staff, I can create a new customer with name + phone** so I can track their orders.
2. **As staff, I can create an order and add multiple bags** so multi-bag drop-offs are tracked.
3. **As staff, I can print a QR label for each bag** so physical bags match digital records.
4. **As staff, I must take at least one photo per bag at intake** so there’s evidence of contents/condition.

### Tracking & Status
5. **As staff, I can scan a bag QR to open its details instantly** so I can avoid searching manually.
6. **As staff, I can move a bag/order through defined statuses** so the team knows what’s next.
7. **As admin, I can configure the status pipeline** so it matches my operation.
8. **As staff, I can add notes/exceptions to an order** so issues are visible and tracked.

### SLA & Delay Prevention
9. **As staff, I can see a list of orders due soon** so I can prioritize work.
10. **As staff, I can see overdue orders with time overdue and current stage** so I can resolve delays.
11. **As admin, I can set an SLA policy that auto-calculates due dates** so promised times are consistent.

### Pickup/Delivery
12. **As staff, I can mark an order as picked up** so it leaves the active queue.
13. **As staff, I can search by customer phone at pickup** so retrieval is fast.

---

## 9) Acceptance Criteria (High-impact)
- Creating an order with 2 bags produces 2 unique QR labels.
- Scanning either bag QR opens the correct order and bag details.
- Status changes create immutable audit events with actor and timestamp.
- Overdue dashboard updates in real time and is filterable by status.
- System prevents the same bag QR from being attached to multiple orders.

---

## 10) Suggested Markdown File Structure (for repo/docs)
- `docs/PRODUCT_SPEC.md` (this file)
- `docs/WORKFLOWS.md` (step-by-step intake/scan/pickup scripts)
- `docs/STATUS_PIPELINE.md` (stage definitions + transition rules)
- `docs/SLA_RULES.md` (due date computation rules)
- `docs/LABELS.md` (label sizes, fields, printing)
- `docs/USER_STORIES.md` (expanded stories + acceptance tests)
- `docs/ROADMAP.md` (MVP → v1)
