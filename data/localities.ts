import type { Locality } from "@/lib/content/types";

/**
 * Locality content model — NOT PUBLISHED.
 *
 * A locality page such as /maid/mumbai/andheri-west/ is generated only when
 * ALL of these are "published":
 *   1. the locality itself
 *   2. its content for that service
 *   3. the parent service-city page (/maid/mumbai/)
 *   4. the parent service and city
 * Locality pages are never generated from combinations automatically, and
 * should only be added where supply is confirmed and there is unique local
 * content to say (to avoid doorway pages).
 *
 * The entries below are structural examples only.
 */
export const localities: Locality[] = [
  {
    slug: "andheri-west",
    name: "Andheri West",
    city: "mumbai",
    publishStatus: "draft",
    services: {
      maid: {
        model: "marketplace",
        headline: "[DRAFT] House help in Andheri West",
        introduction: ["[DRAFT] Example locality copy. Replace with confirmed, genuinely local content before publishing."],
        localFaqs: [],
        seo: {
          title: "[DRAFT] Maid in Andheri West, Mumbai | MeeHelp",
          description: "[DRAFT] Locality page model example. Not published.",
        },
        publishStatus: "draft",
        updatedAt: "2026-10-17",
      },
    },
  },
  {
    slug: "powai",
    name: "Powai",
    city: "mumbai",
    publishStatus: "draft",
    services: {
      cook: {
        model: "marketplace",
        headline: "[DRAFT] Home cooks in Powai",
        introduction: ["[DRAFT] Example locality copy. Replace with confirmed, genuinely local content before publishing."],
        localFaqs: [],
        seo: {
          title: "[DRAFT] Cook in Powai, Mumbai | MeeHelp",
          description: "[DRAFT] Locality page model example. Not published.",
        },
        publishStatus: "draft",
        updatedAt: "2026-10-17",
      },
    },
  },
];
