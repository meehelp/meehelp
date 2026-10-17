import { sharedSafeguards } from "@/data/how-it-works";
import { BulletList } from "@/components/content/Lists";

/** Practical advice for hiring safely. Makes no claims about MeeHelp checks. */
export function Safeguards({ extra = [] }: { extra?: string[] }) {
  return <BulletList items={[...extra, ...sharedSafeguards]} />;
}
