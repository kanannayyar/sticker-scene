export type LevelId = "creative-studio";

export type LevelSticker = {
  id: string;
  name: string;
  imageSrc: string;
  target: {
    x: number;
    y: number;
    tolerance: number;
    targetScale: number;
    targetRotation: number;
  };
  start: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};

export type Level = {
  id: LevelId;
  title: string;
  description: string;
  roomSize: {
    width: number;
    height: number;
  };
  rooms: {
    referenceImage: string;
    emptyImage: string;
  };
  stickers: LevelSticker[];
};

export const levels: Record<LevelId, Level> = {
  "creative-studio": {
    id: "creative-studio",
    title: "Creative Studio",
    description: "A sunny little room waiting for art supplies and cozy details.",
    roomSize: {
      width: 1254,
      height: 1254,
    },
    rooms: {
      referenceImage: "/assets/levels/creative-studio/rooms/reference.png",
      emptyImage: "/assets/levels/creative-studio/rooms/empty.png",
    },
    // Edit each target x/y/tolerance here to manually calibrate snap positions.
    stickers: [
      {
        id: "bookshelf",
        name: "Bookshelf",
        imageSrc: "/assets/levels/creative-studio/stickers/bookshelf.png",
        target: {
          x: 397,
          y: 150,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 70, y: 190 },
        size: { width: 351, height: 683 },
      },
      {
        id: "paint-palette",
        name: "Paint Palette",
        imageSrc: "/assets/levels/creative-studio/play-stickers/paint-palette.png",
        target: {
          x: 537,
          y: 903,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 460, y: 520 },
        size: { width: 270, height: 233 },
      },
      {
        id: "pottery-wheel",
        name: "Pottery Wheel",
        imageSrc: "/assets/levels/creative-studio/play-stickers/pottery-wheel.png",
        target: {
          x: 917,
          y: 667,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 765, y: 260 },
        size: { width: 275, height: 302 },
      },
      {
        id: "rolled-rug",
        name: "Rolled Rug",
        imageSrc: "/assets/levels/creative-studio/play-stickers/rolled-rug.png",
        target: {
          x: 773,
          y: 900,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 270, y: 820 },
        size: { width: 330, height: 256 },
      },
      {
        id: "flower-photo-frame",
        name: "Flower Frame",
        imageSrc: "/assets/levels/creative-studio/play-stickers/flower-photo-frame.png",
        target: {
          x: 724,
          y: 166,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 970, y: 300 },
        size: { width: 135, height: 242 },
      },
    ],
  },
};
