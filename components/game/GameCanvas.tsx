"use client";

import { useEffect, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Level, LevelSticker } from "@/data/levels";
import type { PlacedSticker } from "@/lib/gameStorage";

type CanvasSticker = PlacedSticker & LevelSticker & {
  rotation: number;
  scale: number;
};

type GameCanvasProps = {
  level: Level;
  placedStickers: PlacedSticker[];
  selectedStickerId: string | null;
  onStickerDrop: (id: string, x: number, y: number) => void;
  onSelectSticker: (id: string) => void;
  onDeselectSticker: () => void;
  onToggleStickerLock: (id: string) => void;
};

function useCanvasImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const nextImage = new window.Image();
    nextImage.src = src;
    nextImage.onload = () => setImage(nextImage);

    return () => {
      nextImage.onload = null;
    };
  }, [src]);

  return image;
}

function useStageSize() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState(680);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateStageSize = () => {
      setStageSize(Math.min(container.clientWidth, 720));
    };

    updateStageSize();

    const observer = new ResizeObserver(updateStageSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return { containerRef, stageSize };
}

function StickerNode({
  sticker,
  isSelected,
  onStickerDrop,
  onSelectSticker,
  onToggleStickerLock,
}: {
  sticker: CanvasSticker;
  isSelected: boolean;
  onStickerDrop: (id: string, x: number, y: number) => void;
  onSelectSticker: (id: string) => void;
  onToggleStickerLock: (id: string) => void;
}) {
  const image = useCanvasImage(sticker.imageSrc);
  const width = sticker.size.width * sticker.scale;
  const height = sticker.size.height * sticker.scale;
  const centerX = sticker.x + width / 2;
  const centerY = sticker.y + height / 2;

  function handleDragEnd(event: KonvaEventObject<DragEvent>) {
    onStickerDrop(
      sticker.id,
      event.target.x() - width / 2,
      event.target.y() - height / 2,
    );
  }

  function handleToggleLock(event: KonvaEventObject<MouseEvent | TouchEvent>) {
    event.cancelBubble = true;
    onSelectSticker(sticker.id);
    onToggleStickerLock(sticker.id);
  }

  if (!image) {
    return null;
  }

  return (
    <Group
      x={centerX}
      y={centerY}
      rotation={sticker.rotation}
      draggable={!sticker.isLocked}
      onClick={() => onSelectSticker(sticker.id)}
      onTap={() => onSelectSticker(sticker.id)}
      onDragStart={() => onSelectSticker(sticker.id)}
      onDragEnd={handleDragEnd}
    >
      {isSelected && !sticker.isLocked && (
        <Rect
          x={-width / 2 - 10}
          y={-height / 2 - 10}
          width={width + 20}
          height={height + 20}
          cornerRadius={24}
          stroke="#8a6047"
          strokeWidth={3}
          dash={[12, 8]}
          opacity={0.9}
        />
      )}
      <KonvaImage
        image={image}
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        opacity={sticker.isLocked ? 1 : 0.96}
      />
      {isSelected && (
        <Group
          x={Math.max(-width / 2, width / 2 - 110)}
          y={-height / 2 - 50}
          onClick={handleToggleLock}
          onTap={handleToggleLock}
        >
          <Rect
            width={104}
            height={38}
            cornerRadius={19}
            fill={sticker.isLocked ? "#6f8f73" : "#fff8ec"}
            stroke={sticker.isLocked ? "#5f7d63" : "#d98261"}
            strokeWidth={3}
          />
          <Text
            width={104}
            height={38}
            align="center"
            verticalAlign="middle"
            text={sticker.isLocked ? "Unlock" : "Lock"}
            fill={sticker.isLocked ? "#ffffff" : "#6b432e"}
            fontSize={15}
            fontStyle="bold"
            listening={false}
          />
        </Group>
      )}
    </Group>
  );
}

export default function GameCanvas({
  level,
  placedStickers,
  selectedStickerId,
  onStickerDrop,
  onSelectSticker,
  onDeselectSticker,
  onToggleStickerLock,
}: GameCanvasProps) {
  const backgroundImage = useCanvasImage(level.rooms.emptyImage);
  const { containerRef, stageSize } = useStageSize();
  const scale = stageSize / level.roomSize.width;
  const placedStickerIds = new Set(placedStickers.map((sticker) => sticker.id));
  const canvasStickers = level.stickers
    .filter((sticker) => placedStickerIds.has(sticker.id))
    .map((sticker) => {
      const savedSticker = placedStickers.find((item) => item.id === sticker.id);

      return {
        ...sticker,
        ...savedSticker,
        rotation: savedSticker?.rotation ?? 0,
        scale: savedSticker?.scale ?? 1,
      } as CanvasSticker;
    })
    .sort((firstSticker, secondSticker) => {
      return (firstSticker.zIndex ?? 0) - (secondSticker.zIndex ?? 0);
    });

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[720px] overflow-hidden rounded-[1.25rem] border border-[#e7b992] bg-[#fff6e8] p-2 shadow-lg shadow-[#8a6047]/15"
    >
      <Stage
        width={stageSize}
        height={stageSize}
        scaleX={scale}
        scaleY={scale}
        className="overflow-hidden rounded-[1rem] bg-white"
        onMouseDown={(event) => {
          const clickedStage = event.target === event.target.getStage();
          const clickedRoom = event.target.name() === "room-background";

          if (clickedStage || clickedRoom) {
            onDeselectSticker();
          }
        }}
        onTouchStart={(event) => {
          const clickedStage = event.target === event.target.getStage();
          const clickedRoom = event.target.name() === "room-background";

          if (clickedStage || clickedRoom) {
            onDeselectSticker();
          }
        }}
      >
        <Layer>
          {backgroundImage && (
            <KonvaImage
              name="room-background"
              image={backgroundImage}
              x={0}
              y={0}
              width={level.roomSize.width}
              height={level.roomSize.height}
            />
          )}
          {canvasStickers.map((sticker) => (
            <StickerNode
              key={sticker.id}
              sticker={sticker}
              isSelected={sticker.id === selectedStickerId}
              onStickerDrop={onStickerDrop}
              onSelectSticker={onSelectSticker}
              onToggleStickerLock={onToggleStickerLock}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
