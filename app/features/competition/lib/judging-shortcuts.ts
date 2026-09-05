import type { GroupRegistration, Result, Shot } from "../types/competition";

export function nextPendingCompetitor(
  registrations: GroupRegistration[],
  results: Result[],
  confirmed: ReadonlySet<string>,
) {
  for (const registration of [...registrations].sort(
    (a, b) => a.number - b.number || a.id.localeCompare(b.id),
  )) {
    for (const competitor of registration.competitors) {
      const key = JSON.stringify([registration.id, competitor.id]);
      if (
        !confirmed.has(key) &&
        !results.some(
          (result) =>
            result.registrationId === registration.id &&
            result.competitorId === competitor.id,
        )
      ) {
        return { registration, competitor };
      }
    }
  }
}

export function judgingActionFromKey(
  event: Pick<
    KeyboardEvent,
    | "key"
    | "repeat"
    | "isComposing"
    | "ctrlKey"
    | "altKey"
    | "metaKey"
    | "shiftKey"
    | "defaultPrevented"
  >,
): Shot | "advance" | null {
  if (
    event.repeat ||
    event.isComposing ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.shiftKey ||
    event.defaultPrevented
  )
    return null;
  const key = event.key.toLowerCase();
  return key === "z"
    ? "positive"
    : key === "x"
      ? "negative"
      : key === "c"
        ? "advance"
        : null;
}

export function shotFromKey(
  event: Parameters<typeof judgingActionFromKey>[0],
): Shot | null {
  const action = judgingActionFromKey(event);
  return action === "advance" ? null : action;
}

export function isJudgingShortcutBlocked(event: KeyboardEvent) {
  if (
    event.target instanceof Element &&
    event.target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="listbox"], [role="menu"], [role="slider"], [role="spinbutton"]',
    )
  )
    return true;
  return [
    ...document.querySelectorAll(
      '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]',
    ),
  ].some((element) => element.getClientRects().length > 0);
}
