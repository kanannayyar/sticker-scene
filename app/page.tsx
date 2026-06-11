import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9dfc8] bg-[radial-gradient(circle_at_top_left,#fff7df_0,#f9dfc8_35%,#eec3ac_100%)] px-4 py-8 text-[#6b432e] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b86f58]">
              Sticker Scene
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-[#6b432e] sm:text-6xl">
              Build a cozy room one sticker at a time.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#8a6047]">
              Recreate a finished room by placing cute 2D stickers into a
              warm little 3D-looking scene.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/game/creative-studio"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#d98261] px-7 text-base font-black text-white shadow-lg shadow-[#d98261]/25 transition hover:-translate-y-0.5 hover:bg-[#c87355]"
              >
                Play Creative Studio
              </Link>
            </div>
          </div>

          <Link
            href="/game/creative-studio"
            className="group block rounded-[2rem] border border-[#edc6aa] bg-[#fff8ec] p-4 shadow-2xl shadow-[#8a6047]/15 transition hover:-translate-y-1"
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-[#f2d7bf] bg-white">
              <Image
                src="/assets/levels/creative-studio/rooms/empty.png"
                alt="Creative Studio completed scene"
                width={1254}
                height={1254}
                priority
                className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col gap-3 px-2 pb-2 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#6b432e]">
                  Creative Studio
                </h2>
                <p className="mt-1 text-sm font-semibold text-[#9a6a4e]">
                  5 stickers ready to place
                </p>
              </div>
              <span className="rounded-full bg-[#6f8f73] px-5 py-3 text-sm font-black text-white">
                Start Level
              </span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
