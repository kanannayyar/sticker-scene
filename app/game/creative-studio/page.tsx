"use client";

import dynamic from "next/dynamic";

const CreativeStudioGame = dynamic(
  () => import("@/components/game/CreativeStudioGame"),
  {
    ssr: false,
    loading: () => (
      <main className="flex min-h-screen items-center justify-center bg-[#f9dfc8] px-4 text-[#6b432e]">
        <div className="rounded-[1.75rem] border border-[#edc6aa] bg-[#fff8ec] px-8 py-6 text-center font-black shadow-lg">
          Loading studio...
        </div>
      </main>
    ),
  },
);

export default function CreativeStudioPage() {
  return <CreativeStudioGame levelId="creative-studio" />;
}
