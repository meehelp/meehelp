/**
 * Promotions are TEMPORARY and may change at any time. They are kept apart
 * from evergreen content so that SEO pages, titles and meta descriptions never
 * promise them. Nothing in this file is rendered today.
 *
 * `npm test` and `npm run seo` fail if free-profile-view wording appears in
 * built pages while `evergreenCopyAllowed` is false.
 */
export interface Promotion {
  /** e.g. 1 free helper profile view. */
  value: number;
  kind: "promotional";
  /** The app changes this from time to time. */
  dynamic: true;
  /** Never true for SEO pages; a future campaign page would opt in explicitly. */
  evergreenCopyAllowed: false;
  note: string;
}

export const promotions: { freeProfileViews: Promotion } = {
  freeProfileViews: {
    value: 1,
    kind: "promotional",
    dynamic: true,
    evergreenCopyAllowed: false,
    note: "The app sometimes gives 1 free helper profile view. Not a permanent benefit: do not use in evergreen copy, titles or meta descriptions.",
  },
};
