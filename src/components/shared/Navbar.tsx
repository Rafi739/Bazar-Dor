import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/product';


const categories: Category[] = [
  { id: 'chal', nameBn: 'চাল', icon: '🍚' },
  { id: 'dal', nameBn: 'ডাল', icon: '🫘' },
  { id: 'tel', nameBn: 'তেল', icon: '🫙' },
  { id: 'sobji', nameBn: 'সবজি', icon: '🥬' },
  { id: 'mach', nameBn: 'মাছ', icon: '🐟' },
  { id: 'mansho', nameBn: 'মাংস', icon: '🍗' },
  { id: 'dim-dudh', nameBn: 'ডিম-দুধ', icon: '🥚' },
  { id: 'moshla', nameBn: 'মসলা', icon: '🌶️' },
];

export default function Navbar() {
  
  const banglaDate = "মঙ্গলবার, ৯ অক্টোবর, ২০২৪"; 

  return (
    <header className="bg-white border-b border-gray-100">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
       
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white text-2xl">
          
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">বাজার দর</h1>
            <p className="text-xs text-gray-500">{banglaDate}</p>
          </div>
        </div>

       
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-full border border-gray-100 cursor-pointer">
          <Image 
            src="/user-avatar.jpg" 
            alt="User" 
            width={40} 
            height={40} 
            className="rounded-full object-cover"
          />
          <span className="font-medium text-gray-800 text-sm">Rezwan</span>
          <span className="text-gray-400 mr-1">▼</span>
        </div>
      </div>

     
      <div className="bg-gray-50/50 border-t border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ul className="flex items-center justify-start gap-6 overflow-x-auto no-scrollbar text-sm">
            {categories.map((category) => (
              <li key={category.id} className="flex-shrink-0">
                <Link href={`/category/${category.id}`} className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors py-1">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.nameBn}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}