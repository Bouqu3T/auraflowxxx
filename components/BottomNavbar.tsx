'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/profile', label: '档案', icon: '👤' },
    { path: '/order/list', label: '订单', icon: '📦' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-sm border-t border-gray-100 py-2 px-4 flex justify-around z-10">
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <div className={`flex flex-col items-center cursor-pointer ${pathname === item.path ? 'text-primary' : 'text-gray-400'}`}>
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}