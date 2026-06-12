"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { levels, type LevelId, type LevelSticker } from "@/data/levels";
import {
  clearLevelProgress,
  loadLevelProgress,
  saveLevelProgress,
  type PlacedSticker,
  type SavedSticker,
} from "@/lib/gameStorage";
import GameCanvas from "./GameCanvas";
import { CompletionModal } from "./CompletionModal";
import { ReferenceCard } from "./ReferenceCard";
import { StickerTray } from "./StickerTray";

type CreativeStudioGameProps = {
  levelId: LevelId;
};

function getDistance(x1: number, y1: number, x2: number, y2: number) {
  const xDistance = x1 - x2;
  const yDistance = y1 - y2;

  return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}

function clampScale(scale: number) {
  return Math.min(Math.max(scale, 0.6), 1.4);
}

function clampRotation(rotation: number) {
  return Math.min(Math.max(rotation, -45), 45);
}

function getSavedStickers(levelId: string, levelStickers: LevelSticker[]) {
  const validStickerIds = new Set(levelStickers.map((sticker) => sticker.id));

  return (
    loadLevelProgress(levelId)?.stickers.flatMap((sticker, index) => {
      if (!validStickerIds.has(sticker.id)) {
        return [];
      }

      const legacySticker = sticker as SavedSticker & { isLocked?: boolean };
      const isCorrect = sticker.isCorrect ?? legacySticker.isLocked ?? false;

      return [
        {
          id: sticker.id,
          x: Number.isFinite(sticker.x) ? sticker.x : 0,
          y: Number.isFinite(sticker.y) ? sticker.y : 0,
          scale: Number.isFinite(sticker.scale) ? sticker.scale : 1,
          rotation: Number.isFinite(sticker.rotation) ? sticker.rotation : 0,
          isCorrect,
          zIndex: Number.isFinite(sticker.zIndex) ? sticker.zIndex : index + 1,
          isLocked: legacySticker.isLocked ?? isCorrect,
        },
      ];
    }) ?? []
  );
}

export default function CreativeStudioGame({ levelId }: CreativeStudioGameProps) {
  const level = levels[levelId];
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(
    () => getSavedStickers(level.id, level.stickers),
  );
  const [hasDismissedCompletion, setHasDismissedCompletion] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const completedCount = useMemo(
    () => placedStickers.filter((sticker) => sticker.isCorrect).length,
    [placedStickers],
  );

  const isLevelComplete = completedCount === level.stickers.length;
  const selectedSticker = placedStickers.find(
    (sticker) => sticker.id === selectedStickerId,
  );
  const selectedLevelSticker = level.stickers.find(
    (sticker) => sticker.id === selectedStickerId,
  );
  const selectedScale = Math.round((selectedSticker?.scale ?? 1) * 100);
  const selectedRotation = Math.round(selectedSticker?.rotation ?? 0);
  const selectedX = Math.round(selectedSticker?.x ?? 0);
  const selectedY = Math.round(selectedSticker?.y ?? 0);
  const selectedStickerIsProtected =
    selectedSticker?.isLocked || selectedSticker?.isCorrect || false;

  useEffect(() => {
    const savedStickers: SavedSticker[] = placedStickers.map((sticker) => ({
      id: sticker.id,
      x: sticker.x,
      y: sticker.y,
      scale: sticker.scale,
      rotation: sticker.rotation,
      zIndex: sticker.zIndex,
      isCorrect: sticker.isCorrect,
    }));

    saveLevelProgress(level.id, {
      levelId: level.id,
      stickers: savedStickers,
      updatedAt: new Date().toISOString(),
    });
  }, [level.id, placedStickers]);

  function handleAddSticker(sticker: LevelSticker) {
    setPlacedStickers((currentStickers) => {
      if (currentStickers.some((item) => item.id === sticker.id)) {
        return currentStickers;
      }

      const nextZIndex =
        Math.max(0, ...currentStickers.map((item) => item.zIndex ?? 0)) + 1;

      return [
        ...currentStickers,
        {
          id: sticker.id,
          x: sticker.start.x,
          y: sticker.start.y,
          scale: 1,
          rotation: 0,
          zIndex: nextZIndex,
          isCorrect: false,
          isLocked: false,
        },
      ];
    });
    setSelectedStickerId(sticker.id);
    setHasDismissedCompletion(false);
  }

  function handleStickerDrop(id: string, x: number, y: number) {
    const sticker = level.stickers.find((item) => item.id === id);

    if (!sticker) {
      return;
    }

    const isCloseEnough =
      getDistance(x, y, sticker.target.x, sticker.target.y) <=
      sticker.target.tolerance;

    if (isCloseEnough) {
      setHasDismissedCompletion(false);
    }

    setPlacedStickers((currentStickers) =>
      currentStickers.map((item) => {
        if (item.id !== id || item.isLocked) {
          return item;
        }

        return {
          ...item,
          x: isCloseEnough ? sticker.target.x : x,
          y: isCloseEnough ? sticker.target.y : y,
          isCorrect: isCloseEnough,
          isLocked: isCloseEnough,
        };
      }),
    );
  }

  function handleToggleStickerLock(id: string) {
    setPlacedStickers((currentStickers) =>
      currentStickers.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const willUnlock = item.isLocked;

        return {
          ...item,
          isCorrect: willUnlock ? false : item.isCorrect ?? false,
          isLocked: !item.isLocked,
        };
      }),
    );
  }

  function handleResizeSticker(scale: number) {
    if (!selectedStickerId) {
      return;
    }

    const levelSticker = level.stickers.find((sticker) => sticker.id === selectedStickerId);

    if (!levelSticker) {
      return;
    }

    setPlacedStickers((currentStickers) =>
      currentStickers.map((item) => {
        if (item.id !== selectedStickerId || item.isLocked || item.isCorrect) {
          return item;
        }

        const currentScale = item.scale ?? 1;
        const nextScale = clampScale(scale);
        const currentWidth = levelSticker.size.width * currentScale;
        const currentHeight = levelSticker.size.height * currentScale;
        const nextWidth = levelSticker.size.width * nextScale;
        const nextHeight = levelSticker.size.height * nextScale;

        return {
          ...item,
          x: item.isLocked ? item.x : item.x + (currentWidth - nextWidth) / 2,
          y: item.isLocked ? item.y : item.y + (currentHeight - nextHeight) / 2,
          scale: nextScale,
        };
      }),
    );
  }

  function handleRotateSticker(rotation: number) {
    if (!selectedStickerId) {
      return;
    }

    setPlacedStickers((currentStickers) =>
      currentStickers.map((item) => {
        if (item.id !== selectedStickerId || item.isLocked || item.isCorrect) {
          return item;
        }

        return {
          ...item,
          rotation: clampRotation(rotation),
        };
      }),
    );
  }

  function handleDeleteSelectedSticker() {
    if (!selectedStickerId || selectedStickerIsProtected) {
      return;
    }

    setPlacedStickers((currentStickers) =>
      currentStickers.filter((sticker) => sticker.id !== selectedStickerId),
    );
    setSelectedStickerId(null);
  }

  function handleResetLevel() {
    clearLevelProgress(level.id);
    setPlacedStickers([]);
    setSelectedStickerId(null);
    setHasDismissedCompletion(false);
  }

  function handlePagePointerDown(event: React.PointerEvent<HTMLElement>) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest("[data-keep-sticker-selection]")) {
      return;
    }

    setSelectedStickerId(null);
  }

  return (
    <main
      className="min-h-screen bg-[#f9dfc8] bg-[radial-gradient(circle_at_top_left,#fff7df_0,#f9dfc8_34%,#eec3ac_100%)] px-3 py-3 text-[#6b432e] sm:px-4 lg:px-5"
      onPointerDown={handlePagePointerDown}
    >
      <div className="mx-auto flex max-w-[1324px] flex-col gap-3">
        <header className="flex flex-col gap-3 rounded-[1.25rem] border border-[#edc6aa] bg-[#fff8ec]/90 p-3 shadow-lg shadow-[#8a6047]/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-bold text-[#b56e58] transition hover:text-[#8f513e]"
            >
              Back Home
            </Link>
            <h1 className="mt-1 text-2xl font-black text-[#6b432e] sm:text-3xl">
              {level.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#8a6047]">
              {level.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-[#e8b99a] bg-white px-4 py-2 text-sm font-black shadow-sm">
              {completedCount}/{level.stickers.length} complete
            </div>
            <button
              className="h-10 rounded-full bg-[#6f8f73] px-4 text-sm font-bold text-white shadow-md shadow-[#6f8f73]/20 transition hover:bg-[#5f7d63]"
              type="button"
              onClick={handleResetLevel}
            >
              Reset Level
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[240px_minmax(620px,1fr)_340px] xl:justify-center">
          <div data-keep-sticker-selection>
            <StickerTray
              stickers={level.stickers}
              placedStickers={placedStickers}
              onAddSticker={handleAddSticker}
            />
          </div>
          <div className="min-w-0">
            <div data-keep-sticker-selection>
              <GameCanvas
                level={level}
                placedStickers={placedStickers}
                selectedStickerId={selectedStickerId}
                onStickerDrop={handleStickerDrop}
                onSelectSticker={setSelectedStickerId}
                onDeselectSticker={() => setSelectedStickerId(null)}
                onToggleStickerLock={handleToggleStickerLock}
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <ReferenceCard level={level} />
            <section
              className="rounded-[1.25rem] border border-[#efcfb6] bg-[#fffaf1]/95 p-3 shadow-lg shadow-[#8a6047]/10"
              data-keep-sticker-selection
            >
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-base font-black text-[#6b432e]">
                    Selected Sticker
                  </h2>
                  <p className="mt-1 text-sm font-bold text-[#9a6a4e]">
                    {selectedSticker && selectedLevelSticker
                      ? `${selectedLevelSticker.name} (${selectedSticker.id})${
                          selectedSticker.isLocked ? " - unlock to edit" : ""
                        }`
                      : "Select a placed sticker to adjust it."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl border border-[#efd2b9] bg-white px-3 py-2">
                    <span className="block text-xs font-bold uppercase text-[#b56e58]">
                      X
                    </span>
                    <span className="font-black text-[#6b432e]">{selectedX}</span>
                  </div>
                  <div className="rounded-xl border border-[#efd2b9] bg-white px-3 py-2">
                    <span className="block text-xs font-bold uppercase text-[#b56e58]">
                      Y
                    </span>
                    <span className="font-black text-[#6b432e]">{selectedY}</span>
                  </div>
                  <div className="rounded-xl border border-[#efd2b9] bg-white px-3 py-2">
                    <span className="block text-xs font-bold uppercase text-[#b56e58]">
                      Scale
                    </span>
                    <span className="font-black text-[#6b432e]">{selectedScale}%</span>
                  </div>
                  <div className="rounded-xl border border-[#efd2b9] bg-white px-3 py-2">
                    <span className="block text-xs font-bold uppercase text-[#b56e58]">
                      Rotation
                    </span>
                    <span className="font-black text-[#6b432e]">
                      {selectedRotation} deg
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="h-10 flex-1 rounded-full border border-[#ddb28f] bg-white px-3 text-xs font-black text-[#6b432e] shadow-sm transition hover:bg-[#fff1df] disabled:cursor-not-allowed disabled:opacity-45"
                      type="button"
                      disabled={!selectedSticker || selectedStickerIsProtected}
                      onClick={() =>
                        handleResizeSticker((selectedSticker?.scale ?? 1) - 0.1)
                      }
                      aria-label="Make selected sticker smaller"
                    >
                      Size -
                    </button>
                    <button
                      className="h-10 flex-1 rounded-full border border-[#ddb28f] bg-white px-3 text-xs font-black text-[#6b432e] shadow-sm transition hover:bg-[#fff1df] disabled:cursor-not-allowed disabled:opacity-45"
                      type="button"
                      disabled={!selectedSticker || selectedStickerIsProtected}
                      onClick={() =>
                        handleResizeSticker((selectedSticker?.scale ?? 1) + 0.1)
                      }
                      aria-label="Make selected sticker larger"
                    >
                      Size +
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-10 flex-1 rounded-full border border-[#ddb28f] bg-white px-3 text-xs font-black text-[#6b432e] shadow-sm transition hover:bg-[#fff1df] disabled:cursor-not-allowed disabled:opacity-45"
                      type="button"
                      disabled={!selectedSticker || selectedStickerIsProtected}
                      onClick={() =>
                        handleRotateSticker((selectedSticker?.rotation ?? 0) - 5)
                      }
                      aria-label="Rotate selected sticker left"
                    >
                      Rotate Left
                    </button>
                    <button
                      className="h-10 flex-1 rounded-full border border-[#ddb28f] bg-white px-3 text-xs font-black text-[#6b432e] shadow-sm transition hover:bg-[#fff1df] disabled:cursor-not-allowed disabled:opacity-45"
                      type="button"
                      disabled={!selectedSticker || selectedStickerIsProtected}
                      onClick={() =>
                        handleRotateSticker((selectedSticker?.rotation ?? 0) + 5)
                      }
                      aria-label="Rotate selected sticker right"
                    >
                      Rotate Right
                    </button>
                  </div>
                  <button
                    className="col-span-2 h-10 rounded-full border border-[#e1a18b] bg-[#fff1e8] px-4 text-sm font-black text-[#9f4f3f] shadow-sm transition hover:bg-[#ffe5d6] disabled:cursor-not-allowed disabled:opacity-45"
                    type="button"
                    disabled={!selectedSticker || selectedStickerIsProtected}
                    onClick={handleDeleteSelectedSticker}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <CompletionModal
        isOpen={isLevelComplete && !hasDismissedCompletion}
        onClose={() => setHasDismissedCompletion(true)}
        onReset={handleResetLevel}
      />
    </main>
  );
}
