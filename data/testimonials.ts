import type { Testimonial } from "@/lib/content/types";

/**
 * Customer testimonials.
 *
 * - Add only real reviews with written consent to publish (first name + initial).
 * - Do not copy individual App Store / Play Store reviews without permission.
 * - Never mark up testimonials as Review/AggregateRating schema unless the
 *   reviews are first-party, genuine and shown on the page.
 * - Entries with `isPlaceholder: true` are development placeholders. They are
 *   filtered out of production builds, and `npm run seo` fails if
 *   placeholder text appears in production HTML.
 */
export const testimonials: Testimonial[] = [
  {
    id: "placeholder-1",
    quote: "[DEV PLACEHOLDER] Replace with a real, consented customer quote.",
    displayName: "Placeholder A.",
    service: "maid",
    model: "marketplace",
    source: "direct",
    consentToPublish: false,
    date: "2026-10-17",
    isPlaceholder: true,
  },
  {
    id: "placeholder-2",
    quote: "[DEV PLACEHOLDER] Replace with a real, consented customer quote.",
    displayName: "Placeholder B.",
    service: "elder-care",
    model: "marketplace",
    source: "direct",
    consentToPublish: false,
    date: "2026-10-17",
    isPlaceholder: true,
  },
];
