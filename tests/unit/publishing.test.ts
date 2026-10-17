import assert from "node:assert/strict";
import { test } from "node:test";
import { combineStatus, isBuilt, isIndexable } from "@/lib/content/publishing";

test("production builds only published content", () => {
  assert.equal(isBuilt("published", "production"), true);
  assert.equal(isBuilt("review", "production"), false);
  assert.equal(isBuilt("draft", "production"), false);
});

test("preview builds published + review, never draft", () => {
  assert.equal(isBuilt("published", "preview"), true);
  assert.equal(isBuilt("review", "preview"), true);
  assert.equal(isBuilt("draft", "preview"), false);
});

test("only published content on a production build is indexable", () => {
  assert.equal(isIndexable("published", "production"), true);
  assert.equal(isIndexable("review", "production"), false);
  assert.equal(isIndexable("published", "preview"), false);
  assert.equal(isIndexable("published", "development"), false);
});

test("a page is only as published as its least-published parent", () => {
  assert.equal(combineStatus("published", "published"), "published");
  assert.equal(combineStatus("published", "review"), "review");
  assert.equal(combineStatus("review", "draft", "published"), "draft");
});
