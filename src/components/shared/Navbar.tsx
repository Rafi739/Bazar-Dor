"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar({ categories }: { categories: { slug: string; name: string }[] }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const currentDate = new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-black text-emerald-800 tracking-wide">🛒 বাজার দর</span>
          <span className="text-xs text-gray-500 font-medium capitalize mt-0.5">{currentDate}</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 transition">
                প্রোফাইল ({session.user.name})
              </Link>
              <button
                onClick={() => authClient.signOut()}
                className="btn btn-sm bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
              >
                সাইন আউট
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/signin" className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none px-4">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-sm btn-outline border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Links Row */}
      <nav className="bg-emerald-50/80 backdrop-blur border-t border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto space-x-3 py-2.5 scrollbar-none">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              pathname === "/" ? "bg-emerald-700 text-white shadow-sm" : "text-gray-700 hover:bg-emerald-200/60"
            }`}
          >
            সব ক্যাটাগরি
          </Link>
          {categories?.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                  isActive ? "bg-emerald-700 text-white shadow-sm" : "text-gray-700 hover:bg-emerald-200/60"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}