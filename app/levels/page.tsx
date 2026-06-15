import Image from "next/image";
import Link from "next/link";
import { levels } from "@/data/levels";

const creativeStudio = levels["creative-studio"];

export default function LevelsPage() {
  return (
    <main className="min-h-screen bg-[#f9dfc8] bg-[radial-gradient(circle_at_top_left,#fff7df_0,#f9dfc8_35%,#eec3ac_100%)] px-4 py-8 text-[#6b432e] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[1.5rem] border border-[#edc6aa] bg-[#fff8ec]/90 p-5 shadow-lg shadow-[#8a6047]/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-bold text-[#b56e58] transition hover:text-[#8f513e]"
            >
              Back Home
            </Link>
            <p className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-[#b86f58]">
              Choose a Room
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-[#6b432e] sm:text-5xl">
              Pick your next sticker scene.
            </h1>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-[#8a6047]">
            Cozy rooms, soft colors, and tiny details waiting to be placed.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <Link
            href="/game/creative-studio"
            className="group rounded-[1.5rem] border border-[#edc6aa] bg-[#fff8ec] p-4 shadow-xl shadow-[#8a6047]/15 transition hover:-translate-y-1"
          >
            <div className="overflow-hidden rounded-[1.1rem] border border-[#f2d7bf] bg-white">
              <Image
                src={creativeStudio.rooms.referenceImage}
                alt="Creative Studio completed reference"
                width={creativeStudio.roomSize.width}
                height={creativeStudio.roomSize.height}
                priority
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col gap-3 px-2 pb-2 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#6b432e]">
                  Creative Studio
                </h2>
                <p className="mt-1 text-sm font-semibold text-[#9a6a4e]">
                  {creativeStudio.stickers.length} stickers ready to place
                </p>
              </div>
              <span className="inline-flex h-11 items-center justify-center rounded-full bg-[#d98261] px-5 text-sm font-black text-white shadow-md shadow-[#d98261]/20">
                Start Level
              </span>
            </div>
          </Link>

          <article className="relative rounded-[1.5rem] border border-[#edc6aa] bg-[#fff8ec] p-4 opacity-85 shadow-xl shadow-[#8a6047]/10">
            <div className="overflow-hidden rounded-[1.1rem] border border-[#f2d7bf] bg-white">
              <Image
                src="/assets/levels/cozy-cafe/rooms/reference.png"
                alt="Cozy Cafe completed reference"
                width={1254}
                height={1254}
                className="aspect-square w-full object-cover saturate-[0.85]"
              />
            </div>
            <div className="flex flex-col gap-3 px-2 pb-2 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#6b432e]">
                  Cozy Cafe
                </h2>
                <p className="mt-1 text-sm font-semibold text-[#9a6a4e]">
                  A warm little table is brewing soon
                </p>
              </div>
              <span className="inline-flex h-11 items-center justify-center rounded-full border border-[#ddb28f] bg-white px-5 text-sm font-black text-[#9a6a4e]">
                Coming Soon
              </span>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
