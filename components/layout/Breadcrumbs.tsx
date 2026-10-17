import Link from "next/link";
import { schemaSettings } from "@/data/business";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/schema";

/** Visible breadcrumb trail + matching BreadcrumbList JSON-LD. The last item is the current page. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <div className="container">
          <ol>
            {items.map((item, i) => {
              const last = i === items.length - 1;
              return (
                <li key={item.path}>
                  {last ? (
                    <span aria-current="page">{item.name}</span>
                  ) : (
                    <Link href={item.path}>{item.name}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
      {schemaSettings.breadcrumbs ? <JsonLd data={breadcrumbSchema(items)} /> : null}
    </>
  );
}
