export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 py-8 px-4 mt-12 border-t border-emerald-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">🛒 বাজার দর</h2>
          <p className="text-sm text-emerald-300">বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        </div>
        <div className="text-xs text-emerald-400 bg-emerald-900/60 px-4 py-2.5 rounded-xl border border-emerald-800">
          “সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।”
        </div>
      </div>
    </footer>
  );
}