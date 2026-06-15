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
  onStickerDrop,
  onSelectSticker,
  onStickerDragMove,
}: {
  sticker: CanvasSticker;
  onStickerDrop: (id: string, x: number, y: number) => void;
  onSelectSticker: (id: string) => void;
  onStickerDragMove: (id: string, x: number, y: number) => void;
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

  function handleDragMove(event: KonvaEventObject<DragEvent>) {
    onStickerDragMove(
      sticker.id,
      event.target.x() - width / 2,
      event.target.y() - height / 2,
    );
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
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <KonvaImage
        image={image}
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        opacity={sticker.isLocked ? 1 : 0.96}
      />
    </Group>
  );
}

function SelectedStickerControls({
  sticker,
  onSelectSticker,
  onToggleStickerLock,
}: {
  sticker: CanvasSticker;
  onSelectSticker: (id: string) => void;
  onToggleStickerLock: (id: string) => void;
}) {
  const width = sticker.size.width * sticker.scale;
  const height = sticker.size.height * sticker.scale;
  const centerX = sticker.x + width / 2;
  const centerY = sticker.y + height / 2;

  function handleToggleLock(event: KonvaEventObject<MouseEvent | TouchEvent>) {
    event.cancelBubble = true;
    onSelectSticker(sticker.id);
    onToggleStickerLock(sticker.id);
  }

  return (
    <Group
      x={centerX}
      y={centerY}
      rotation={sticker.rotation}
      listening
    >
      {!sticker.isLocked && (
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
          listening={false}
        />
      )}
      <Group
        x={Math.max(-width / 2, width / 2 - 110)}
        y={-height / 2 - 50}
        onClick={handleToggleLock}
        onTap={handleToggleLock}
        listening
      >
        <Rect
          width={104}
          height={38}
          cornerRadius={19}
          fill={sticker.isLocked ? "#6f8f73" : "#fff8ec"}
          stroke={sticker.isLocked ? "#5f7d63" : "#d98261"}
          strokeWidth={3}
          listening
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
  const [dragPreview, setDragPreview] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
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
  const selectedSticker = canvasStickers.find((sticker) => sticker.id === selectedStickerId);
  const selectedStickerWithPreview =
    selectedSticker && dragPreview?.id === selectedSticker.id
      ? { ...selectedSticker, x: dragPreview.x, y: dragPreview.y }
      : selectedSticker;

  function handleStickerDrop(id: string, x: number, y: number) {
    setDragPreview(null);
    onStickerDrop(id, x, y);
  }

  function handleStickerDragMove(id: string, x: number, y: number) {
    setDragPreview({ id, x, y });
  }

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
        </Layer>
        <Layer>
          {canvasStickers.map((sticker) => (
            <StickerNode
              key={sticker.id}
              sticker={sticker}
              onStickerDrop={handleStickerDrop}
              onSelectSticker={onSelectSticker}
              onStickerDragMove={handleStickerDragMove}
            />
          ))}
        </Layer>
        <Layer listening>
          {selectedStickerWithPreview && (
            <SelectedStickerControls
              sticker={selectedStickerWithPreview}
              onSelectSticker={onSelectSticker}
              onToggleStickerLock={onToggleStickerLock}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
