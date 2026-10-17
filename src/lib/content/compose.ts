/**
 * Composes a service-city page from:
 *   1. the service's short city frame for the model (src/data/city-frames.ts)
 *   2. the city's facts and FAQs tagged for that service and model (src/data/cities.ts)
 *   3. hand-written overrides, where we have them (src/data/service-cities.ts)
 *
 * Composition never invents information: if a city has few relevant facts,
 * the page is shorter — and the content report flags it — rather than padded.
 */
import type { City, CityFact, CityFaq, CityTemplate, Faq, Service, ServiceCity, ServiceCityContent } from "./types";

export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function fillCity(template: CityTemplate, city: City): string {
  return template
    .replaceAll("{cityFull}", city.displayName)
    .replaceAll("{city}", city.name)
    .replaceAll("{areas}", city.descriptors.areas)
    .replaceAll("{cuisine}", city.descriptors.cuisine)
    .replaceAll("{festivals}", city.descriptors.festivals)
    .replaceAll("{festival}", city.descriptors.festival)
    .replaceAll("{languages}", city.descriptors.languages);
}

const applies = (item: CityFact | CityFaq, sc: Pick<ServiceCity, "service" | "model">) =>
  (!item.services || item.services.includes(sc.service)) && (!item.models || item.models.includes(sc.model));

export function relevantFacts(city: City, sc: Pick<ServiceCity, "service" | "model">): string[] {
  return city.facts.filter((f) => applies(f, sc)).map((f) => f.text);
}

function coverageFaq(service: Service, city: City, model: ServiceCity["model"]): Faq {
  const includes = listJoin(city.includes);
  if (model === "marketplace") {
    return city.includes.length > 0
      ? {
          question: `Can I find ${service.roleWithArticle} in ${includes}?`,
          answer: `Yes. MeeHelp operates across ${city.displayName}, including ${includes}. Search from your address in the app to see helpers near you.`,
        }
      : {
          question: `Which parts of ${city.name} does MeeHelp cover?`,
          answer: `MeeHelp operates across ${city.name}. Search from your address in the app to see helpers near you — we don't list individual neighbourhoods.`,
        };
  }
  const noun = service.onDemand.bookingNoun;
  return city.includes.length > 0
    ? {
        question: `Can I book ${noun} in ${includes}?`,
        answer: `Yes. On-demand bookings are available across ${city.displayName}, including ${includes}. Whether someone is free at a particular time depends on who is near you, so you can also schedule ahead.`,
      }
    : {
        question: `Can I book ${noun} anywhere in ${city.name}?`,
        answer: `On-demand bookings are available across ${city.name}. Whether someone is free at a particular time depends on who is near you, so schedule ahead when you can.`,
      };
}

export function composeServiceCity(sc: ServiceCity, service: Service, city: City): ServiceCityContent {
  const frame = service.cityPage[sc.model];
  const fill = (t: CityTemplate) => fillCity(t, city);
  const cityFaqs: Faq[] = city.faqs.filter((f) => applies(f, sc)).map(({ question, answer }) => ({ question, answer }));
  const composed: ServiceCityContent = {
    headline: fill(frame.headline),
    introduction: frame.intro.map(fill),
    points: frame.points,
    localNotes: relevantFacts(city, sc),
    areasServed: [],
    localFaqs: [coverageFaq(service, city, sc.model), ...cityFaqs],
    localCta:
      sc.model === "marketplace"
        ? {
            heading: `Find ${service.roleWithArticle} in ${city.name}`,
            body: `Download the MeeHelp app to search for helpers in ${city.descriptors.areas} and contact them directly.`,
          }
        : {
            heading: `Book ${service.onDemand.bookingNoun} in ${city.name}`,
            body: `Download the MeeHelp app to book instantly or schedule a visit in ${city.descriptors.areas}.`,
          },
    seo: { title: fill(frame.title), description: fill(frame.description) },
  };
  return { ...composed, ...sc.overrides };
}
