const SETUP_KEY_PREFIXES = [
  "talentSetup1",
  "talentSetup2",
  "talentSetup3",
  "companySetup1",
  "companySetup2",
  "companySetup3",
] as const;

export type SetupKeyPrefix = (typeof SETUP_KEY_PREFIXES)[number];

function buildScopedKey(prefix: SetupKeyPrefix, userId: string) {
  return `${prefix}:${userId}`;
}

export function getSetupDraft(prefix: SetupKeyPrefix, userId?: string) {
  if (!userId) return null;

  try {
    const raw = localStorage.getItem(buildScopedKey(prefix, userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSetupDraft(
  prefix: SetupKeyPrefix,
  userId: string | undefined,
  value: unknown,
) {
  if (!userId) return;
  localStorage.setItem(buildScopedKey(prefix, userId), JSON.stringify(value));
}

export function clearLegacySetupDrafts() {
  SETUP_KEY_PREFIXES.forEach((key) => localStorage.removeItem(key));
}

export function clearScopedSetupDraftsForUser(userId?: string) {
  if (!userId) return;
  SETUP_KEY_PREFIXES.forEach((prefix) => {
    localStorage.removeItem(buildScopedKey(prefix, userId));
  });
}

export function clearAllKnownSetupDraftsForUser(userId?: string) {
  clearScopedSetupDraftsForUser(userId);
  clearLegacySetupDrafts();
}
