"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

export const NavItem = ({ href, children }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
        ${
          isActive
            ? "bg-primary-50 text-primary-600"
            : "text-neutral-700 hover:bg-neutral-50"
        }
      `}
    >
      {children}
    </Link>
  );
};

export const Nav = ({ children }: { children: React.ReactNode }) => {
  return <nav className="flex flex-col gap-1">{children}</nav>;
};
