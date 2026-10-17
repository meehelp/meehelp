import { sharedSafeguards } from "@/data/how-it-works";
import { BulletList } from "@/components/content/Lists";
import { Claims } from "./Claims";

/** Practical advice for hiring safely, plus any approved business claims. */
export function Safeguards({ extra = [] }: { extra?: string[] }) {
  return (
    <div className="safeguards">
      <Claims />
      <BulletList items={[...extra, ...sharedSafeguards]} />
    </div>
  );
}
