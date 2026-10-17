/**
 * Anti-doorway similarity analysis for generated pages.
 *
 * Method (fixed BEFORE looking at results, documented in docs/seo/QUALITY-REPORT.md):
 * - Text: the page's <main> content (header, footer and app bar excluded).
 * - Normalisation: lower-case; every city name, display name, included area and
 *   area descriptor → "{city}"; every service / on-demand name, short name, role
 *   and booking noun → "{service}"; punctuation removed.
 * - Shingles: 5-word sequences. Similarity: Jaccard index of shingle sets.
 * - Unique share: fraction of a page's shingles that appear on NO other page in
 *   the comparison set.
 *
 * Risk thresholds:
 *   high   — max similarity ≥ 0.60, or unique share < 0.20
 *   medium — max similarity ≥ 0.40, or unique share < 0.35
 *   low    — otherwise
 *
 * The analysis REPORTS risk. It must never be "fixed" by inventing differences;
 * pages that are too similar stay in review.
 */
export const THRESHOLDS = { highSimilarity: 0.6, mediumSimilarity: 0.4, highUnique: 0.2, mediumUnique: 0.35 } as const;

export type Risk = "low" | "medium" | "high";

export interface SimilarityInput {
  path: string;
  text: string;
}

export interface SimilarityResult {
  path: string;
  shingles: number;
  maxSimilarity: number;
  mostSimilarTo: string | null;
  uniqueShare: number;
  risk: Risk;
}

export function makeNormaliser(cityTerms: string[], serviceTerms: string[]): (text: string) => string[] {
  // Longest first so "Navi Mumbai" is replaced before "Mumbai".
  const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = (terms: string[]) =>
    new RegExp(`\\b(?:${[...new Set(terms.map((t) => t.toLowerCase()))].sort((a, b) => b.length - a.length).map(escape).join("|")})\\b`, "g");
  const cityRe = pattern(cityTerms);
  const serviceRe = pattern(serviceTerms);
  return (text: string) =>
    text
      .toLowerCase()
      .replace(cityRe, " xcityx ")
      .replace(serviceRe, " xservicex ")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
}

export function shingles(tokens: string[], k = 5): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i + k <= tokens.length; i++) out.add(tokens.slice(i, i + k).join(" "));
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const s of small) if (large.has(s)) inter++;
  return inter / (a.size + b.size - inter);
}

export function riskOf(maxSimilarity: number, uniqueShare: number): Risk {
  if (maxSimilarity >= THRESHOLDS.highSimilarity || uniqueShare < THRESHOLDS.highUnique) return "high";
  if (maxSimilarity >= THRESHOLDS.mediumSimilarity || uniqueShare < THRESHOLDS.mediumUnique) return "medium";
  return "low";
}

export function analyseSimilarity(pages: SimilarityInput[], normalise: (t: string) => string[]): SimilarityResult[] {
  const sets = pages.map((p) => shingles(normalise(p.text)));
  const counts = new Map<string, number>();
  for (const set of sets) for (const s of set) counts.set(s, (counts.get(s) ?? 0) + 1);
  return pages.map((p, i) => {
    let max = 0;
    let peer: string | null = null;
    for (let j = 0; j < pages.length; j++) {
      if (i === j) continue;
      const sim = jaccard(sets[i]!, sets[j]!);
      if (sim > max) {
        max = sim;
        peer = pages[j]!.path;
      }
    }
    const set = sets[i]!;
    let unique = 0;
    for (const s of set) if (counts.get(s) === 1) unique++;
    const uniqueShare = set.size ? unique / set.size : 0;
    return {
      path: p.path,
      shingles: set.size,
      maxSimilarity: Math.round(max * 1000) / 1000,
      mostSimilarTo: peer,
      uniqueShare: Math.round(uniqueShare * 1000) / 1000,
      risk: riskOf(max, uniqueShare),
    };
  });
}
