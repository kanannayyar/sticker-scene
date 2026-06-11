"use client";

import Image from "next/image";
import type { LevelSticker } from "@/data/levels";
import type { PlacedSticker } from "@/lib/gameStorage";

type StickerTrayProps = {
  stickers: LevelSticker[];
  placedStickers: PlacedSticker[];
  onAddSticker: (sticker: LevelSticker) => void;
};

export function StickerTray({
  stickers,
  placedStickers,
  onAddSticker,
}: StickerTrayProps) {
  return (
    <section className="rounded-[1.25rem] border border-[#efcfb6] bg-[#fffaf1]/95 p-3 shadow-lg shadow-[#8a6047]/10 xl:max-h-[720px] xl:overflow-y-auto">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-base font-black text-[#6b432e]">Stickers</h2>
        <p className="text-sm font-bold text-[#9a6a4e]">
          Click a sticker to add it to the room.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stickers.map((sticker) => {
          const placedSticker = placedStickers.find((item) => item.id === sticker.id);
          const isLocked = placedSticker?.isLocked ?? false;

          return (
            <button
              key={sticker.id}
              className="group flex min-h-28 flex-col items-center justify-between rounded-[1rem] border border-[#f0d4bb] bg-white p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#e9a98b] hover:shadow-md disabled:translate-y-0 disabled:cursor-default disabled:bg-[#f7ecd9] disabled:opacity-75"
              type="button"
              disabled={isLocked}
              onClick={() => onAddSticker(sticker)}
              title={isLocked ? `${sticker.name} placed` : `Add ${sticker.name}`}
            >
              <span className="flex h-16 w-full items-center justify-center">
                <Image
                  src={sticker.imageSrc}
                  alt={sticker.name}
                  width={sticker.size.width}
                  height={sticker.size.height}
                  className="max-h-16 w-auto object-contain drop-shadow-sm"
                />
              </span>
              <span className="mt-2 max-w-24 text-xs font-bold leading-tight text-[#744932]">
                {isLocked ? "Placed" : sticker.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
