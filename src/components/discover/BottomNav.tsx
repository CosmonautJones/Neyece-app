"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/discover", label: "Home", icon: "🏠" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/saved", label: "Saved", icon: "❤️" },
  { href: "/profile", label: "Profile", icon: "👤" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-ink z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                active
                  ? "text-coral"
                  : "text-muted hover:text-ink"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[10px] font-body font-bold ${active ? "text-coral" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for notch phones */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
