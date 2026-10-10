export default function Hero() {
  return (
    <section className="bg-linear-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white py-14 px-6 md:px-10 rounded-3xl max-w-6xl mx-auto my-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="max-w-xl">
        <span className="bg-emerald-600/60 text-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-500/30">
          রিয়েল-টাইম প্রাইস ট্র্যাকিং
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold mt-5 mb-4 leading-tight tracking-tight">
          প্রয়োজনীয় পণ্যের দাম এখন হাতের মুঠোয়
        </h1>
        <p className="text-emerald-100/90 text-base md:text-lg mb-8 leading-relaxed">
          বাংলাদেশের পাইকারি ও খুচরা বাজারের নিত্যপ্রয়োজনীয় পণ্যের সঠিক দাম, দাম বাড়া-কমার রিয়েল-টাইম তথ্য এবং ক্যাটাগরি ভিত্তিক আপডেট জানুন।
        </p>
        <a
          href="#shob-ponno"
          className="btn bg-white text-emerald-900 hover:bg-emerald-50 border-none font-bold px-8 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
        >
          সব পণ্য দেখুন 👇
        </a>
      </div>
      <div className="text-8xl md:text-9xl bg-emerald-900/40 p-8 rounded-3xl border border-emerald-700/50 shadow-inner">
        📈🛒
      </div>
    </section>
  );
}