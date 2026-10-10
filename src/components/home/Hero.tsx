import Image from 'next/image';

export default function Hero() {
  return (
    <section className="mx-auto my-4 max-w-6xl rounded-2xl bg-[#f0f5f1] p-3 sm:p-4">
      <div className="flex min-h-36 items-center justify-between gap-4 rounded-xl border border-[#e0e8e1] bg-[#f9fbf9] px-4 py-5 sm:px-7 md:px-8">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full bg-[#e4f3e9] px-3 py-1 text-[10px] font-semibold text-emerald-800">
            প্রতিদিন, সব বাজারের, সঠিক দর
          </span>
          <h1 className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-[#26332c] sm:text-2xl md:text-3xl">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="mt-2 max-w-lg text-xs leading-relaxed text-gray-500 sm:text-sm">
            চাল, ডাল, তেল, মাছ, মাংস, সবজি ও ফলের দাম — বাজারদর দেখুন, দাম বাড়া-কমার আপডেট জানুন।
          </p>
          <a
            href="#shob-ponno"
            className="mt-4 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            সব দাম দেখুন
          </a>
        </div>
        <Image
          src="/assets/bazar-hero.png"
          alt="বাজারের ঝুড়িতে তাজা সবজি"
          width={300}
          height={200}
          priority
          className="h-auto w-24 shrink-0 sm:w-32 md:w-40"
        />
      </div>
    </section>
  );
}
