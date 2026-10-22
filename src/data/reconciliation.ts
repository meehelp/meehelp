/**
 * PRODUCT-TRUTH RECONCILIATION (Phase 4.6). For each topic: what the code
 * shows, what the current-app screenshots show, what the business confirmed,
 * and the position Website V2 takes. Conflicts are flagged, never resolved
 * silently. Exported by `npm run evidence` to docs/seo/PRODUCT-TRUTH-RECONCILIATION.*.
 */
export interface ReconciliationTopic {
  topic: string;
  codeEvidence: string;
  currentAppScreenshot: string;
  businessConfirmation: string;
  websitePosition: string;
  /** Anything that still disagrees and needs a decision or an app/backend fix. */
  conflict: string | null;
  evidence: string[];
}

export const reconciliation: ReconciliationTopic[] = [
  {
    topic: "Elder care on the marketplace",
    codeEvidence: "Helper app registers 'Maid/Cook/Patient Care/Baby Care' — no elder-care helper category. Elder care exists as a separate hourly task (icon 38).",
    currentAppScreenshot: "—",
    businessConfirmation: "Elder care and patient care use the same care-helper pool; elder care is a customer need mapped to that pool.",
    websitePosition: "/elder-care/ explains elder care as a customer need and says elder and patient care attendants come from the same pool. It never claims a separate elder-care category.",
    conflict: "Which option a customer selects in the app to find an elder care attendant is not known (Q-ELDER-LABEL).",
    evidence: ["cat.helper-categories", "od.hourly-tasks", "biz.elder-pool"],
  },
  {
    topic: "Instant vs scheduled booking",
    codeEvidence: "'Book Now' exists in the one-time cleaning flow; hourly bookings are scheduled ≥ 2 hours ahead, up to 5 days.",
    currentAppScreenshot: "One-time cleaning screens show both 'Book Now' and 'Schedule'.",
    businessConfirmation: "Instant only for one-time cleaning; hourly, care and other hourly services are scheduled.",
    websitePosition: "Instant wording and the 'Book a clean now' CTA appear only on /hourly-maid/ pages. Cook, babysitter, elder and patient care pages say 'schedule'. Validator enforces it.",
    conflict: null,
    evidence: ["impl.instant-scope", "shot.otg-durations-booking", "biz.instant-scope"],
  },
  {
    topic: "Aadhaar",
    codeEvidence: "Helper uploads Aadhaar front/back (read on device); 'verification will be completed within 24 hours'; Aadhaar-OTP screen is commented out; an upload endpoint sets the verified flag on upload; admins can verify manually.",
    currentAppScreenshot: "—",
    businessConfirmation: "Aadhaar document collected and manually reviewed; electronic/OTP verification must not be claimed.",
    websitePosition: "'Aadhaar document collected and manually reviewed' — submitted when the helper registers and reviewed manually by MeeHelp. Guards block 'Aadhaar verified', OTP/e-KYC/UIDAI/government-database and 'fully verified' wording.",
    conflict: "Backend: uploading the document sets aadhar_verify = 1 without a review step (provider.php ~768-812). Engineering should confirm the manual review gate exists.",
    evidence: ["trust.aadhaar", "biz.aadhaar-manual"],
  },
  {
    topic: "Helper address",
    codeEvidence: "Helper app collects one address with a map location; backend also has staying_currently / current_city fields.",
    currentAppScreenshot: "—",
    businessConfirmation: "The address is the one on the Aadhaar document; no independent current/permanent address verification.",
    websitePosition: "Only: 'the address on that document is available to MeeHelp'. Current/permanent-address checks are disabled; guards block address-verification wording.",
    conflict: null,
    evidence: ["trust.address", "biz.address-in-aadhaar"],
  },
  {
    topic: "Lowest plan price",
    codeEvidence: "App onboarding copy: 'Plans start at Rs 299'. Plans are served from the DB with an even/odd user split.",
    currentAppScreenshot: "—",
    businessConfirmation: "₹299 is stale; the lowest Home plan is ₹499 (10 contacts, 1 month).",
    websitePosition: "Plans come only from src/data/plans.ts. ₹299 is blocked by tests and the validator.",
    conflict: "The app still shows the stale ₹299 copy, and the backend splits plan sets by user id — worth fixing in the app.",
    evidence: ["biz.plans", "biz.299-stale"],
  },
  {
    topic: "One-time cleaning: tasks and durations",
    codeEvidence: "At least 2 tasks; 120/150/180 min (60/90 commented out in the app but still priced in the backend).",
    currentAppScreenshot: "Kitchen Prep/Cleaning, Laundry (machine wash), Dishes, Bathroom (count), Sweeping/Mopping and Dusting (BHK); 120, 150 and 180 min.",
    businessConfirmation: "Confirmed via the supplied screenshots.",
    websitePosition: "Published on /hourly-maid/ pages only.",
    conflict: null,
    evidence: ["od.otg-tasks", "od.otg-durations", "shot.otg-tasks", "shot.otg-durations-booking"],
  },
  {
    topic: "Hourly durations",
    codeEvidence: "2–12 hours in 2-hour steps; start 7 AM–8 PM; later starts allow shorter bookings; book 2 hours to 5 days ahead.",
    currentAppScreenshot: "'Select Schedule' shows 2, 4, 6, 8, 10 and 12 hours.",
    businessConfirmation: "Hourly services are scheduled.",
    websitePosition: "Published as booking rules (no prices).",
    conflict: null,
    evidence: ["od.hourly-durations", "od.hourly-schedule", "shot.hourly-options"],
  },
  {
    topic: "On-demand prices",
    codeEvidence: "One-time cleaning prices hardcoded in the backend (120→₹650, 150→₹700, 180→₹800; discounts 8/5/10); hourly rates from the DB.",
    currentAppScreenshot: "₹598 / ₹665 / ₹720 for 120/150/180 min; hourly ₹598–₹1,890 for 2–12 h; gender preference +₹100.",
    businessConfirmation: "Treat as current observed values — not universal across cities, categories or promotions.",
    websitePosition: "Not published. Kept in src/data/observed-app-values.ts; tests fail if any amount leaks into pages, titles or metas.",
    conflict: "Whether the values are stable and identical in every city is unknown (Q-PRICE).",
    evidence: ["od.pricing-unknown", "shot.otg-prices", "shot.hourly-options"],
  },
  {
    topic: "Platform fee and GST",
    codeEvidence: "OTG commission 20 and gst 5 in the backend; hourly commission 15 and a 70/25 payout split for scheduled bookings; a city-level commission-free mode; app GST fallbacks differ (5% vs 18%).",
    currentAppScreenshot: "Online amount = ~20% platform fee + 5% GST on the fee (₹120 + ₹5.98 on ₹598; ₹133 + ₹6.65 on ₹665; ₹144 + ₹7.20 on ₹720).",
    businessConfirmation: "Record as an observed current-app flow, not a universal rule.",
    websitePosition: "Not published — no percentages and no tax wording (no tax statement is approved). Copy says only that part is paid online to confirm.",
    conflict: "Code uses different commission values for hourly bookings, and the app's GST fallbacks disagree (Q-FEE).",
    evidence: ["shot.otg-fee-gst", "od.payment-split"],
  },
  {
    topic: "Payment",
    codeEvidence: "Platform fee paid online (Razorpay / wallet); the rest in cash to the helper.",
    currentAppScreenshot: "'Pay Now (Online)' — required to confirm the order; 'Pay After Service (Cash)' — directly to the helper after completion.",
    businessConfirmation: "Use only for the matching one-time cleaning flow.",
    websitePosition: "Published on /hourly-maid/ pages only; never on marketplace plans or hourly care.",
    conflict: null,
    evidence: ["od.payment-split", "shot.otg-payment"],
  },
  {
    topic: "Cancellation",
    codeEvidence: "'No Refund' after acceptance is hardcoded; the pre-acceptance text comes from the server; backend copy also describes a 2-minute wallet-refund window and other rules.",
    currentAppScreenshot: "Auto-cancel because no helper was assigned → 100% to the original payment source in 2–7 working days; after a helper accepted → No Refund.",
    businessConfirmation: "Use the screenshot wording narrowly.",
    websitePosition: "Published for one-time cleaning only, exactly as narrow as the screenshot. Validator blocks broader refund wording. Rescheduling stays unknown.",
    conflict: "Backend copy describes extra windows (e.g. within 2 minutes of acceptance) not shown in the current screen; customer-initiated pre-acceptance cancellation is unspecified (Q-CANCEL).",
    evidence: ["od.cancellation", "shot.cancellation"],
  },
  {
    topic: "Care scopes",
    codeEvidence: "Task names and included/excluded text live on the server; not visible in code.",
    currentAppScreenshot: "—",
    businessConfirmation: "Baby care, elder care (daily-living + special care) and patient care scopes supplied; injections, insulin and IV need clinical approval.",
    websitePosition: "Published items only (src/data/care-scope.ts). Wound/bed-sore/catheter items are review-only; injections/insulin/IV are clinical-approval and never rendered. Vitals only 'where the assigned caregiver is trained'.",
    conflict: "Training/credential pathway for special care is not yet confirmed (Q-CLINICAL).",
    evidence: ["cat.task-names-server", "biz.scope-baby", "biz.scope-elder-daily", "biz.scope-elder-special", "biz.scope-elder-clinical", "biz.scope-patient", "biz.patient-no-invasive"],
  },
];
