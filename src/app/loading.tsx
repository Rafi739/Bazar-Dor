export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh]">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-emerald-600"></div>
      <p className="text-gray-500 mt-4 font-semibold text-sm animate-pulse">ডেটা লোড হচ্ছে...</p>
    </div>
  );
}