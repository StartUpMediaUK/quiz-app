'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Breadcrumbs = () => {
  const pathname = usePathname();

  if (!pathname) return null;

  // Split path and remove empty strings
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="flex space-x-2">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {pathSegments.length > 0 && <span className="mx-1">/</span>}
        </li>

        {pathSegments.map((segment, index) => {
          // Build the URL up to the current segment
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;

          // Optional: replace hyphens with spaces and capitalize
          const label = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <li key={href}>
              {isLast ? (
                <span className="font-medium">{label}</span>
              ) : (
                <>
                  <Link href={href} className="hover:underline">
                    {label}
                  </Link>
                  <span className="mx-1">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
