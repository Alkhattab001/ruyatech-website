'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Get the path without locale
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '';

  // Determine next locale
  const nextLocale = locale === 'en' ? 'ar' : 'en';

  // Build the new path
  const newPath = `/${nextLocale}${pathWithoutLocale}`;

  return (
    <Link
      href={newPath}
      className="fixed top-6 right-6 z-50 px-6 py-3 rounded-full bg-primary/90 hover:bg-primary text-white font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 backdrop-blur-sm border border-primary-light/30 !pointer-events-auto cursor-pointer"
      aria-label="Switch language"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>{locale === 'en' ? 'العربية' : 'English'}</span>
      </div>
    </Link>
  );
}
