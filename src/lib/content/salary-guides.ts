/**
 * Salary guide helpers: path, rupee formatting and token filling, so the
 * year, review date and ranges in src/data/salary-guides.ts are written once.
 */
import type { SalaryGuide, SalaryRange } from "./types";

export const salaryGuidePath = (g: Pick<SalaryGuide, "slug" | "city">) => `/${g.slug}/${g.city}/`;

/** ₹4,500 (Indian digit grouping). */
export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** "₹4,500–₹9,000" or "₹18,000–₹28,000+". */
export const formatRange = (r: SalaryRange) => `${rupees(r.min)}–${rupees(r.max)}${r.openEnded ? "+" : ""}`;

/** "October 2026" from "2026-10-22". */
export const reviewedLabel = (g: SalaryGuide) =>
  new Date(`${g.evidenceReviewedOn}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/** Fills {year}, {reviewed} and {range:<key>}; an unknown range key fails the build. */
export function fillGuideText(g: SalaryGuide, text: string): string {
  return text
    .replaceAll("{year}", String(g.year))
    .replaceAll("{reviewed}", reviewedLabel(g))
    .replace(/\{range:([a-z-]+)\}/g, (_, key: string) => {
      const r = g.ranges.find((x) => x.key === key);
      if (!r) throw new Error(`Unknown salary range "${key}" in ${salaryGuidePath(g)}`);
      return formatRange(r);
    });
}

/** The guide's SEO fields with tokens filled. */
export const guideSeo = (g: SalaryGuide) => ({ title: fillGuideText(g, g.seo.title), description: fillGuideText(g, g.seo.description) });

/** Days after which a guide's evidence is stale and the page may not stay in production. */
export const SALARY_EVIDENCE_MAX_AGE_DAYS = 365;

/** Problems that block publishing a guide: missing/invalid review date, wrong year, stale evidence. */
export function salaryGuideProblems(g: SalaryGuide, now: Date = new Date()): string[] {
  const problems: string[] = [];
  const reviewed = new Date(`${g.evidenceReviewedOn}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.evidenceReviewedOn) || Number.isNaN(reviewed.getTime())) return [`evidenceReviewedOn "${g.evidenceReviewedOn}" is not a date`];
  if (reviewed.getUTCFullYear() !== g.year) problems.push(`year ${g.year} does not match the evidence review year ${reviewed.getUTCFullYear()}`);
  if (g.evidenceReviewedOn > g.updatedAt) problems.push("evidenceReviewedOn is after updatedAt");
  const ageDays = (now.getTime() - reviewed.getTime()) / 86_400_000;
  if (ageDays > SALARY_EVIDENCE_MAX_AGE_DAYS) problems.push(`salary evidence is ${Math.floor(ageDays)} days old (max ${SALARY_EVIDENCE_MAX_AGE_DAYS}) — review the ranges and update evidenceReviewedOn`);
  if (ageDays < -1) problems.push("evidenceReviewedOn is in the future");
  return problems;
}
