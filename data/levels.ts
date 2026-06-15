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
    rotation?: number;
    scale?: number;
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
          x: 589,
          y: 924,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 460, y: 520 },
        size: { width: 270, height: 233 },
      },
      {
        id: "cork-board",
        name: "Cork Board",
        imageSrc: "/assets/levels/creative-studio/play-stickers/cork-board.png",
        target: {
          x: 920,
          y: 244,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 90, y: 660 },
        size: { width: 230, height: 377 },
      },
      {
        id: "pottery-wheel",
        name: "Pottery Wheel",
        imageSrc: "/assets/levels/creative-studio/play-stickers/pottery-wheel.png",
        target: {
          x: 898,
          y: 648,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 765, y: 260 },
        size: { width: 275, height: 302 },
      },
      {
        id: "easel-landscape",
        name: "Landscape Easel",
        imageSrc: "/assets/levels/creative-studio/play-stickers/easel-landscape.png",
        target: {
          x: 643,
          y: 395,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 910, y: 250 },
        size: { width: 210, height: 353 },
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
        start: { x: 270, y: 820, rotation: -5 },
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
      {
        id: "plant-photo-frame",
        name: "Plant Frame",
        imageSrc: "/assets/levels/creative-studio/play-stickers/plant-photo-frame.png",
        target: {
          x: 844,
          y: 244,
          tolerance: 15,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 1030, y: 120 },
        size: { width: 130, height: 252 },
      },
      {
        id: "windowsill-photo-frame",
        name: "Windowsill Frame",
        imageSrc: "/assets/levels/creative-studio/play-stickers/windowsill-photo-frame.png",
        target: {
          x: 159,
          y: 527,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 1060, y: 390, rotation: -15 },
        size: { width: 150, height: 194 },
      },
      {
        id: "windowsill-plant",
        name: "Windowsill Plant",
        imageSrc: "/assets/levels/creative-studio/play-stickers/windowsill-plant.png",
        target: {
          x: 283,
          y: 445,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 1040, y: 610 },
        size: { width: 160, height: 214 },
      },
      {
        id: "cat-with-glasses",
        name: "Cat with Glasses",
        imageSrc: "/assets/levels/creative-studio/play-stickers/cat-with-glasses.png",
        target: {
          x: 510,
          y: 691,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 70, y: 420 },
        size: { width: 150, height: 190 },
      },
      {
        id: "sewing-machine-table",
        name: "Sewing Machine Table",
        imageSrc: "/assets/levels/creative-studio/play-stickers/sewing-machine-table.png",
        target: {
          x: 217,
          y: 566,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 260, y: 430 },
        size: { width: 325, height: 360 },
      },
      {
        id: "fabric-stack",
        name: "Fabric Stack",
        imageSrc: "/assets/levels/creative-studio/play-stickers/fabric-stack.png",
        target: {
          x: 351,
          y: 753,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 850, y: 700 },
        size: { width: 210, height: 231 },
      },
      {
        id: "yarn-basket",
        name: "Yarn Basket",
        imageSrc: "/assets/levels/creative-studio/play-stickers/yarn-basket.png",
        target: {
          x: 372,
          y: 907,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 610, y: 470 },
        size: { width: 210, height: 210 },
      },
      {
        id: "paper-stack",
        name: "Paper Stack",
        imageSrc: "/assets/levels/creative-studio/play-stickers/paper-stack.png",
        target: {
          x: 687,
          y: 765,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 790, y: 540 },
        size: { width: 223, height: 196 },
      },
      {
        id: "toolbox",
        name: "Toolbox",
        imageSrc: "/assets/levels/creative-studio/play-stickers/toolbox.png",
        target: {
          x: 105,
          y: 741,
          tolerance: 20,
          targetScale: 1,
          targetRotation: 0,
        },
        start: { x: 980, y: 570, rotation: 5 },
        size: { width: 225, height: 230 },
      },
    ],
  },
};
