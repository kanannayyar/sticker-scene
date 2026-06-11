"use client";

type CompletionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
};

export function CompletionModal({ isOpen, onClose, onReset }: CompletionModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5c3927]/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-[#f2c7a6] bg-[#fff8ec] p-8 text-center shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cf7f63]">
          Scene complete
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#6b432e]">
          Your studio is picture perfect.
        </h2>
        <p className="mt-4 text-base leading-7 text-[#8a6047]">
          Every sticker found its cozy little spot.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            className="h-12 flex-1 rounded-full bg-[#d98261] px-5 font-bold text-white shadow-md shadow-[#d98261]/25 transition hover:bg-[#c87355]"
            type="button"
            onClick={onClose}
          >
            Admire Scene
          </button>
          <button
            className="h-12 flex-1 rounded-full border border-[#ddb28f] bg-white px-5 font-bold text-[#6b432e] transition hover:bg-[#fff1df]"
            type="button"
            onClick={onReset}
          >
            Reset Level
          </button>
        </div>
      </div>
    </div>
  );
}
