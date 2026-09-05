import assert from "node:assert/strict";
import test from "node:test";
import {
  judgingActionFromKey,
  nextPendingCompetitor,
  shotFromKey,
} from "./judging-shortcuts.ts";

const registrations = [
  {
    id: "ten",
    number: 10,
    name: null,
    positiveShots: 0,
    totalShots: 0,
    competitors: [
      {
        id: "a",
        name: "Ana",
        positiveShots: 0,
        totalShots: 0,
        recentResults: [],
      },
    ],
  },
  {
    id: "two",
    number: 2,
    name: null,
    positiveShots: 0,
    totalShots: 0,
    competitors: [
      {
        id: "a",
        name: "Ana",
        positiveShots: 0,
        totalShots: 0,
        recentResults: [],
      },
      {
        id: "b",
        name: "Bruno",
        positiveShots: 0,
        totalShots: 0,
        recentResults: [],
      },
    ],
  },
];
const result = (registrationId, competitorId) => ({
  id: `${registrationId}-${competitorId}`,
  registrationId,
  competitorId,
  competitorName: "",
  shot: "positive",
});

test("judges each competitor within numeric registration order, skipping saved results", () => {
  assert.equal(
    nextPendingCompetitor(registrations, [], new Set())?.registration.id,
    "two",
  );
  assert.equal(
    nextPendingCompetitor(registrations, [result("two", "a")], new Set())
      ?.competitor.id,
    "b",
  );
  assert.equal(
    nextPendingCompetitor(
      registrations,
      [result("two", "a"), result("two", "b")],
      new Set(),
    )?.registration.id,
    "ten",
  );
  assert.equal(
    nextPendingCompetitor(
      registrations,
      [result("two", "a"), result("two", "b"), result("ten", "a")],
      new Set(),
    ),
    undefined,
  );
});
test("successful submissions are skipped even before the refreshed response arrives", () => {
  const confirmed = new Set([JSON.stringify(["two", "a"])]);
  assert.equal(
    nextPendingCompetitor(registrations, [], confirmed)?.competitor.id,
    "b",
  );
  confirmed.add(JSON.stringify(["two", "b"]));
  assert.equal(
    nextPendingCompetitor(registrations, [], confirmed)?.registration.id,
    "ten",
  );
  // A new round starts with no confirmations, even for the same competitor.
  assert.equal(
    nextPendingCompetitor(registrations, [], new Set())?.registration.id,
    "two",
  );
});
const event = {
  key: "z",
  repeat: false,
  isComposing: false,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  shiftKey: false,
  defaultPrevented: false,
};
test("Z is positive, X is negative, other keys are ignored", () => {
  assert.equal(shotFromKey(event), "positive");
  assert.equal(shotFromKey({ ...event, key: "x" }), "negative");
  assert.equal(shotFromKey({ ...event, key: "Z" }), "positive");
  assert.equal(shotFromKey({ ...event, key: "Enter" }), null);
});
test("held keys, composition, modifiers and handled events cannot submit shots", () => {
  for (const key of [
    "repeat",
    "isComposing",
    "ctrlKey",
    "altKey",
    "metaKey",
    "shiftKey",
    "defaultPrevented",
  ]) {
    assert.equal(shotFromKey({ ...event, [key]: true }), null, key);
  }
});

test("C advances a round without registering a shot", () => {
  assert.equal(judgingActionFromKey({ ...event, key: "c" }), "advance");
  assert.equal(judgingActionFromKey({ ...event, key: "C" }), "advance");
  assert.equal(shotFromKey({ ...event, key: "c" }), null);
  for (const flag of [
    "repeat",
    "isComposing",
    "ctrlKey",
    "altKey",
    "metaKey",
    "shiftKey",
    "defaultPrevented",
  ]) {
    assert.equal(
      judgingActionFromKey({ ...event, key: "c", [flag]: true }),
      null,
      flag,
    );
  }
});
