# Where Did My Money Go? — Project Status V5

*Status against `where_did_my_money_go_feature_expansion.md`, checked directly against the current code on 2026-10-15. Supersedes the previous status doc — this turn added Investment Options and Monthly Income/Expense Planning, both live-tested in a browser, not just read from source.*

## 1. Overview

The original 23-screen app is complete, backed by a working Node/Express API. Of the six Feature Expansion sections, **four are now implemented**: Digital Pockets, Savings Recommendations, the Savings balance overview, Investment Options, and Monthly Income/Expense Planning (that's five — see below, the sixth being auth/subscriptions). Only **Login/Accounts/Subscription Tiers** remains fully unstarted.

## 2. What changed since V4

- **Investment Options screen** (`investments.js`) — educational content for four investment categories (bank deposits, money-market funds, bond/fixed-income funds, equity funds), each with risk level, plain-language risk note, time horizon, liquidity, minimum, and fees, all explicitly labeled as general ranges rather than verified live figures. Reachable from Profile → "Investment options" and from the Savings screen. Returns-not-guaranteed language is present on the screen itself.
- **Monthly Income and Expense Planning screen** (`planning.js`) — new, localStorage-backed, same architectural pattern as Pockets:
  - Editable monthly income, per-category planned amounts (all 7 expense categories), each tagged Essential or Flexible with one tap
  - Monthly savings target and optional investment contribution target
  - A live allocation breakdown (essential / flexible / savings / investment / buffer) recomputed from those four inputs — no redundant stored totals
  - Buffer goes negative and a plain-language over-budget warning appears when planned expenses + savings + investment exceed income (covers the spec's "planned expenses exceed available balance" UI state)
  - Each category row shows actual spending so far next to the plan, pulled from the same `categoryTotals()` the Analytics screen already uses — planned and actual are visibly separate numbers, never merged
  - Reachable from Profile → Money Settings → "Monthly income & expense plan"
- Both were live-tested in a headless browser this turn: screen renders, inputs save and recompute the breakdown correctly, the over-budget warning fires correctly, essential/flexible toggling works, and state survives a page reload.

## 3. Status by spec section

### 3.1 Digital Pockets — **Done, with gaps** *(unchanged from V4)*
Default + custom pockets, transfers as paired ledger entries, balance/target progress, transaction history, archive. Still missing: rename/edit an existing pocket, outright delete, custom image upload (category emoji only).

### 3.2 Balance overview / Savings screen — **Done** *(unchanged)*

### 3.3 Savings Recommendations — **Done** *(unchanged)*
21 unit tests passing in `recommend.js`.

### 3.4 Monthly Income and Expense Planning — **Done** ✅ *(new this turn)*
All spec bullets covered: income, planned expenses by category, savings target, optional investment target, an allocation plan (essential/flexible/savings/investment/buffer), editable anytime, and a clear planned-vs-actual distinction. Not covered: multiple expected income dates in one month (spec allows a single "expected income dates" field — kept to the one already in Money Settings, not duplicated here).

### 3.5 Investment Options and Recommendations — **Done** ✅ *(new this turn)*
Four investment categories with risk/horizon/liquidity/minimum/fees, each caveated as a general range rather than verified data, no specific products or providers named, "returns are not guaranteed" stated on-screen. The recommendation engine's investment suggestion (§3.3) and this educational screen are two separate, intentionally non-overlapping pieces — the spec treats them as two: a suggested *amount*, and separate education about *where* it could go.

### 3.6 Login, Accounts, and Subscription Tiers — **Not started** *(unchanged)*
No login or registration screens. `premiumActive` flag exists and gates the 2-custom-pocket free limit, but there's no comparison screen, no pricing/benefit detail beyond one button, no cancellation or expired-subscription states, and no auth to secure.

### 3.7 Navigation — **Partially done** *(unchanged)*
Bottom nav: Home / Pockets / Savings / More. Analytics, Split & Debts, Investment Options, and Monthly Plan are all reachable, just nested under More → Profile → Money Settings rather than top-level, consistent with the spec's own "use a More menu" fallback for limited nav space.

### 3.8 Important UI states — **Partial, improved**
New this turn: the over-budget planned-expenses state (§3.4) is now implemented. Still missing: first-time-no-transactions state, incomplete-expense-history state, no-income-entered state (Monthly Plan assumes a value is always set), expired-subscription state, generic loading/error states for backend calls.

### 3.9 Suggested user flow — **Partial** *(unchanged)*
Steps 4–9 work. Steps 1–3 (login, account creation, income/planned-expenses as part of onboarding) don't exist yet — Monthly Plan is accessible after the fact, not folded into onboarding.

### 3.10 Implementation notes — **Followed for the new features**
- `planning.js` has zero coupling to `pockets.js`'s ledger or the backend — planned budget and actual spending are computed from entirely separate sources, matching the spec's "clearly distinguish planned vs actual" requirement directly, not just in wording.
- Allocation numbers are always derived (`planAllocation()`), never stored as separate mutable totals — same discipline as Pockets' ledger-derived balances.
- `investments.js` makes no network calls and claims no verified rates — every number is explicitly labeled as a general range.

### 3.11 Acceptance checklist — **7 of 15 checked** *(up from 3)*
- [ ] Login and registration screens
- [ ] Login animation
- [x] Free and Premium access levels represented *(minimal — pockets only)*
- [x] View total savings and individual pocket balances
- [x] Default pockets available
- [ ] Create custom pockets with image/icon *(category emoji only, no upload)*
- [~] Pocket goals + transfers *(transfers done; no edit after creation)*
- [x] New income triggers optional recommendation
- [x] Recommendation considers recent expenses, bills, next income date
- [x] Edit/accept/decline before confirming
- [x] Monthly income and planned expenses can be entered and edited ✅ *(new)*
- [x] Investment options include understandable risks and no guaranteed-return claims ✅ *(new)*
- [ ] Premium-only feature upgrade prompt *(only for pockets)*
- [x] Records stay accessible if Premium expires *(trivially true — nothing is locked yet)*
- [ ] Demo functionality visibly distinguished from real auth/payments/investing

## 4. What's still lacking

1. **No authentication layer** — the one remaining large gap. Blocks real subscription enforcement and the login animation the spec asks for.
2. **Premium gating is inconsistent** — only pocket creation checks `premiumActive`; nothing gates Analytics history length, PDF export, or advanced planning/investment tools as the spec's Premium list implies it should.
3. **Pockets/Savings/Plan all live in `localStorage`**, independent of both the Node backend and Home's `availableBalance`/Safe-to-Spend. Three separate state systems now exist in the app (backend expenses, localStorage pockets, localStorage plan) that don't reconcile with each other. Still a deliberate scoping choice, but the surface area for this has grown and is worth resolving before adding more.
4. **UI states remain thin** outside what Monthly Plan now covers — no loading indicators, no backend-error state, no onboarding nudge toward setting up a plan.

## 5. What can be improved

- **Pocket editing**: still create-only; add rename/edit-description/change-target.
- **Fold planning into onboarding**: the spec's suggested flow asks for income + planned expenses at step 3, before the dashboard appears. Today it's a Money Settings sub-screen, discoverable but not surfaced early.
- **Link Monthly Plan's income to Money Settings' allowance**: right now they're two separate numbers that happen to start in sync (Plan reads the allowance value once, on first load, then diverges). Worth deciding whether they should stay linked or be explicitly separate concepts.
- **Consistent Premium gating**: decide the actual feature list (the spec gives one) and gate it the same way pockets already are, rather than leaving it pocket-only.
- **Loading/error states**: still the most visible missing polish item for a reviewer going through the acceptance checklist screen by screen.

## 6. Suggested next steps, in priority order

1. **Consistent Premium gating + a real Free vs Premium comparison screen** — smaller than full auth, makes the existing `premiumActive` flag actually mean something across the app, and directly closes two more acceptance-checklist items.
2. **Login/Accounts/Subscription Tiers** — the remaining large effort. Needs an explicit decision first: real backend auth, or a clearly-labeled demo-auth prototype (the spec allows either, but the security requirements differ sharply).
3. **Reconcile the three state systems** (backend expenses, localStorage pockets, localStorage plan) — a cross-cutting pass once the above are stable, since it touches logic that's already been carefully tested.
4. **UI states pass**: first-time-user, no-income-set, loading/error — lower effort, high value for the acceptance checklist's "Important UI States" section.
