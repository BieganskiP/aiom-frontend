"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavItem = ({ href, children, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
        ${
          isActive
            ? "bg-primary-500/10 text-primary-500"
            : "text-neutral-200 hover:bg-bg-700"
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
