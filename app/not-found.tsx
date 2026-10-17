import type { Metadata } from "next";
import Link from "next/link";
import { AppDownloadSection } from "@/components/app/AppDownloadSection";
import { Section } from "@/components/content/Section";
import { ServiceCards } from "@/components/content/ServiceCards";
import { getServiceCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Page not found | MeeHelp" },
  description: "The page you were looking for doesn't exist. Find maids, cooks, nannies, elder care and patient care attendants with MeeHelp.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <section className="hero hero--compact">
        <div className="container">
          <h1>Sorry, we couldn't find that page</h1>
          <p className="lead">
            The link may be out of date. Try one of the options below, or go to the <Link href="/">home page</Link>.
          </p>
        </div>
      </section>
      <Section id="services" title="Our services">
        <ServiceCards items={getServiceCategories()} />
      </Section>
      <AppDownloadSection model="both" placement="not_found" />
    </>
  );
}
