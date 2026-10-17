import type { BusinessModel, CityPageFrame, ServiceSlug } from "@/lib/content/types";

/**
 * How each service's city pages are framed, per model. Placeholders are
 * filled from src/data/cities.ts: {city} (name), {cityFull} (display name), {areas}.
 * (Phase 4.5: cuisine, festival and language placeholders were removed.)
 *
 * Frames are deliberately SHORT. A city page's substance comes from the
 * city's tagged facts and FAQs, not from repeating the same paragraphs
 * with a different city name. Shared explanations (how hiring or booking
 * works) stay brief on city pages and link to the service hub.
 */
export const cityFrames: Record<ServiceSlug, Record<BusinessModel, CityPageFrame>> = {
  maid: {
    marketplace: {
      headline: "Find a maid in {cityFull}",
      intro: [
        "Search MeeHelp for house help who work in {areas}. Contact the helpers you like directly, and agree the tasks, timings and salary with them yourself.",
      ],
      points: [
        "Daily sweeping, mopping and dishes in a fixed time slot",
        "Laundry and folding a few times a week",
        "Bathroom and kitchen cleaning on set days",
      ],
      title: "Maid in {city} – Find & Hire House Help Directly | MeeHelp",
      description:
        "Find a maid in {areas}. Contact house help directly, agree the work and salary yourself and arrange a trial on MeeHelp.",
    },
    onDemand: {
      headline: "Book an hourly maid in {cityFull}",
      intro: [
        "Book a maid by the hour through the MeeHelp app in {areas} — right away, or for a time you choose. You pick the hours and the tasks for each visit.",
      ],
      points: [
        "A thorough clean before guests arrive",
        "Cover while your regular maid is on leave",
        "A deep clean of the kitchen or bathrooms",
      ],
      title: "Hourly Maid in {city} – Book a One-Time Clean | MeeHelp",
      description: "Book an hourly maid in {areas} with MeeHelp — book now or schedule — for dishes, bathrooms, floors or laundry. Keep your supplies ready.",
    },
  },
  cook: {
    marketplace: {
      headline: "Find a home cook in {cityFull}",
      intro: [
        "Search MeeHelp for cooks in {areas}, part-time for one or two meals or live-in. Contact cooks directly, agree a trial meal and settle the salary with them yourself.",
      ],
      points: [
        "Breakfast and tiffins before office and school",
        "Dinner ready by the time you get home",
        "Cooking for a family member with dietary needs",
      ],
      title: "Cook in {city} – Hire a Home Cook Directly | MeeHelp",
      description: "Hire a home cook in {areas} for daily meals and tiffins. Contact cooks directly, agree a trial meal and the salary yourself on MeeHelp.",
    },
    onDemand: {
      headline: "Book a cook by the hour in {cityFull}",
      intro: [
        "Book a cook through the MeeHelp app in {areas} for the hours you need — for guests, a family meal or a few days of meal prep. Schedule it up to 5 days ahead.",
      ],
      points: [
        "Cooking for guests or a small family gathering",
        "Your regular cook is away for a few days",
        "A few days of meals prepared in one visit",
      ],
      title: "Hourly Cook in {city} – Book a Cook for Guests | MeeHelp",
      description: "Book a cook by the hour in {areas} through MeeHelp for guests, a family meal or meal prep. Schedule up to 5 days ahead.",
    },
  },
  "babysitter-nanny": {
    marketplace: {
      headline: "Find a babysitter or nanny in {cityFull}",
      intro: [
        "Search MeeHelp for babysitters and nannies in {areas}. Contact the ones you like, meet them, and agree hours, responsibilities and salary directly before you decide.",
      ],
      points: [
        "Full-day care while parents work",
        "After-school care until a parent gets home",
        "An extra pair of hands with a newborn or toddler",
      ],
      title: "Nanny & Babysitter in {city} – Find and Hire | MeeHelp",
      description: "Find a babysitter or nanny in {areas}. Speak to nannies directly, meet them and agree hours and salary on MeeHelp.",
    },
    onDemand: {
      headline: "Book an hourly babysitter in {cityFull}",
      intro: [
        "Book a babysitter by the hour through the MeeHelp app in {areas} — for an evening out, a work call or a busy afternoon. Schedule it at least 2 hours ahead.",
      ],
      points: [
        "An evening out or a family function",
        "A few hours of meetings at home",
        "Cover when your regular nanny is away",
      ],
      title: "Hourly Babysitter in {city} – Book Childcare | MeeHelp",
      description: "Book a babysitter by the hour in {areas} on MeeHelp for an evening out, a work call or nanny cover. Schedule 2 hours to 5 days ahead.",
    },
  },
  "elder-care": {
    marketplace: {
      headline: "Elder care attendants in {cityFull}",
      intro: [
        "Search MeeHelp for elder care attendants in {areas}. Contact attendants directly, discuss your parent's routine and needs, and agree hours and salary before you hire.",
      ],
      points: [
        "Daytime company and supervision while family members are at work",
        "Help with walking, bathing and dressing",
        "Going along to doctor's appointments",
      ],
      title: "Elder Care in {city} – Find an Attendant at Home | MeeHelp",
      description: "Find an elder care attendant in {areas} for company, mobility help and daily routines at home. Contact attendants directly on MeeHelp.",
    },
    onDemand: {
      headline: "Hourly elder care in {cityFull}",
      intro: [
        "Book an elder care attendant by the hour in {areas} — for a few hours of company and help while you're out, or to go along to a doctor's appointment.",
      ],
      points: [
        "Company and help while family members are out",
        "Going along to a doctor's appointment",
        "Cover when a regular carer is away",
      ],
      title: "Hourly Elder Care in {city} – Book an Attendant | MeeHelp",
      description: "Book hourly elder care in {areas} on MeeHelp: company and help with the daily routine for an older parent while you're out.",
    },
  },
  "patient-care": {
    marketplace: {
      headline: "Patient care attendants in {cityFull}",
      intro: [
        "Search MeeHelp for patient care attendants in {areas} for non-medical care at home. Contact attendants directly, explain the patient's needs, and agree shifts and salary yourself.",
      ],
      points: [
        "Care at home after a hospital discharge",
        "Help for a bedridden or limited-mobility patient",
        "Day shifts while family members are at work",
      ],
      title: "Patient Attendant in {city} – Care at Home | MeeHelp",
      description: "Find a patient care attendant in {areas} for recovery at home. Contact attendants directly and agree shifts and salary on MeeHelp.",
    },
    onDemand: {
      headline: "Hourly patient care in {cityFull}",
      intro: [
        "Book a patient care attendant by the hour in {areas} — after a hospital discharge, for help with personal care at set times, or to give a family carer a break.",
      ],
      points: [
        "The first days at home after a hospital discharge",
        "Help with bathing and moving at set times",
        "A break for a family member who is caring full-time",
      ],
      title: "Hourly Patient Care in {city} – Book an Attendant | MeeHelp",
      description: "Book hourly patient care in {areas} on MeeHelp: personal care for a family member who is unwell or recovering at home.",
    },
  },
};
