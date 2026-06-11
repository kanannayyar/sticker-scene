import Image from "next/image";
import type { Level } from "@/data/levels";

type ReferenceCardProps = {
  level: Level;
};

export function ReferenceCard({ level }: ReferenceCardProps) {
  return (
    <aside className="rounded-[1.25rem] border border-[#efcfb6] bg-[#fffaf1] p-3 shadow-lg shadow-[#8a6047]/10">
      <div className="flex items-center justify-between gap-3 px-1 pb-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c77c62]">
            Reference
          </p>
          <h2 className="text-base font-black text-[#6b432e]">{level.title}</h2>
        </div>
      </div>
      <div className="overflow-hidden rounded-[1rem] border border-[#f2d7bf] bg-white">
        <Image
          src={level.rooms.referenceImage}
          alt={`${level.title} completed reference`}
          width={level.roomSize.width}
          height={level.roomSize.height}
          priority
          className="mx-auto h-auto max-h-56 w-full object-contain"
        />
      </div>
    </aside>
  );
}
