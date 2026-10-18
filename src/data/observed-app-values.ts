/**
 * DYNAMIC values observed in the current app (business-supplied screenshots,
 * 2026-10-18). Structurally separate from evergreen SEO content:
 *
 *   - nothing in this file is rendered by any page, title or meta description;
 *   - tests fail if any of these amounts appears in page copy or built HTML;
 *   - they describe ONE flow, address and date — not universal prices for every
 *     city, category, date or promotion (evidence shot.otg-prices,
 *     shot.hourly-options, shot.otg-fee-gst; open questions Q-PRICE, Q-FEE).
 *
 * Use them for internal reference and business conversations only.
 */
export interface ObservedValue {
  observedOn: string;
  evidence: string;
  scope: string;
  evergreenCopyAllowed: false;
}

export const observedOneTimeCleaning = {
  observedOn: "2026-10-18",
  evidence: "shot.otg-prices",
  scope: "One-time cleaning ('On the go'), one Mumbai address",
  evergreenCopyAllowed: false,
  visits: [
    { minutes: 120, serviceValue: 598, previous: 650, discountPercent: 8, onlineAmount: 125.58, platformFee: 120, gstOnFee: 5.98, cashToHelper: 472 },
    { minutes: 150, serviceValue: 665, previous: 700, discountPercent: 5, onlineAmount: 139.65, platformFee: 133, gstOnFee: 6.65, cashToHelper: 525 },
    { minutes: 180, serviceValue: 720, previous: 800, discountPercent: 10, onlineAmount: 151.2, platformFee: 144, gstOnFee: 7.2, cashToHelper: 569 },
  ],
  /** Observation only (shot.otg-fee-gst) — NOT a universal commercial rule. */
  pattern: { platformFeeShareOfServiceValue: 0.2, gstRateOnPlatformFee: 0.05, kind: "observedCurrentAppFlow" },
} as const satisfies ObservedValue & Record<string, unknown>;

export const observedHourlySchedule = {
  observedOn: "2026-10-18",
  evidence: "shot.hourly-options",
  scope: "'Select Schedule' screen, one Mumbai address, 1 BHK",
  evergreenCopyAllowed: false,
  options: [
    { hours: 2, price: 598, previous: 650 },
    { hours: 4, price: 755, previous: 850 },
    { hours: 6, price: 936, previous: 1300 },
    { hours: 8, price: 1360, previous: 1600 },
    { hours: 10, price: 1480, previous: 1850 },
    { hours: 12, price: 1890, previous: 2100 },
  ],
  genderPreferenceCharge: 100,
} as const satisfies ObservedValue & Record<string, unknown>;

/** Every rupee amount above, for leak tests. */
export function observedAmounts(): number[] {
  const v = observedOneTimeCleaning.visits.flatMap((x) => [x.serviceValue, x.previous, x.onlineAmount, x.platformFee, x.gstOnFee, x.cashToHelper]);
  const h = observedHourlySchedule.options.flatMap((x) => [x.price, x.previous]);
  return [...new Set([...v, ...h, observedHourlySchedule.genderPreferenceCharge])];
}
