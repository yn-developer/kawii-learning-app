const STORAGE_KEY = "progress:v1";

export type StoredProgress = {
  completedBySlug: Record<string, boolean>;
  checkpointsBySlug: Record<string, Record<string, boolean>>;
};

const emptyProgress = (): StoredProgress => ({
  completedBySlug: {},
  checkpointsBySlug: {},
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isBrowser = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

export function loadProgress(): StoredProgress | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;

    const completed = isRecord(parsed) && isRecord(parsed.completedBySlug)
      ? Object.entries(parsed.completedBySlug).reduce<Record<string, boolean>>(
          (acc, [slug, value]) => {
            if (typeof value === "boolean") acc[slug] = value;
            return acc;
          },
          {},
        )
      : {};

    const checkpoints =
      isRecord(parsed) && isRecord(parsed.checkpointsBySlug)
        ? Object.entries(parsed.checkpointsBySlug).reduce<Record<string, Record<string, boolean>>>(
            (acc, [slug, checkpointMap]) => {
              if (!isRecord(checkpointMap)) return acc;
              acc[slug] = Object.entries(checkpointMap).reduce<Record<string, boolean>>(
                (inner, [id, value]) => {
                  if (typeof value === "boolean") inner[id] = value;
                  return inner;
                },
                {},
              );
              return acc;
            },
            {},
          )
        : {};

    return {
      completedBySlug: completed,
      checkpointsBySlug: checkpoints,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: StoredProgress) {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore write errors (quota, privacy, etc.)
  }
}
