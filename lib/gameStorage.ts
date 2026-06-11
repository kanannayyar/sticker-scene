export type SavedSticker = {
  id: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  zIndex?: number;
  isCorrect?: boolean;
};

export type PlacedSticker = SavedSticker & {
  isLocked: boolean;
};

export type LevelProgress = {
  levelId: string;
  stickers: SavedSticker[];
  updatedAt: string;
};

const STORAGE_PREFIX = "sticker-scene:level-progress";

function getStorageKey(levelId: string) {
  return `${STORAGE_PREFIX}:${levelId}`;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadLevelProgress(levelId: string): LevelProgress | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const savedValue = window.localStorage.getItem(getStorageKey(levelId));

    if (!savedValue) {
      return null;
    }

    const parsedValue = JSON.parse(savedValue) as LevelProgress;

    if (!Array.isArray(parsedValue.stickers)) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

export function saveLevelProgress(levelId: string, progress: LevelProgress) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(getStorageKey(levelId), JSON.stringify(progress));
}

export function clearLevelProgress(levelId: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(getStorageKey(levelId));
}
