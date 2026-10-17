import Link from "next/link";
import { pricingSettings } from "@/data/plans";
import { pricingPageStatus } from "@/lib/content";
import { pricingPath } from "@/lib/content/paths";
import { isBuilt } from "@/lib/content/publishing";
import { PlanCards } from "./PlanCards";

/**
 * Consumer plan summary for marketplace pages: HOME plans only.
 * Office and Business plans appear only on the pricing page.
 * The free-profile-view count is rendered here and nowhere else.
 */
export function PlansSummary({ placement, linkToAllPlans = true }: { placement: string; linkToAllPlans?: boolean }) {
  const { freeProfileViews } = pricingSettings;
  const pricingBuilt = isBuilt(pricingPageStatus());
  return (
    <div className="plans-summary">
      <p>
        {freeProfileViews.showOnWebsite && freeProfileViews.value > 0
          ? `You can view ${freeProfileViews.value === 1 ? "your first helper profile" : `your first ${freeProfileViews.value} helper profiles`} free. After that, choose a plan for the number of helpers you want to contact. `
          : "Choose a plan for the number of helpers you want to contact. "}
        You agree the salary directly with the helper you hire.
      </p>
      <PlanCards segment="home" placement={placement} />
      {pricingBuilt && linkToAllPlans ? (
        <p className="note">
          Hiring for an office or business? <Link href={pricingPath}>See all MeeHelp plans</Link>.
        </p>
      ) : null}
    </div>
  );
}
