"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Building2,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

type AdminSidebarProps = {
  sidebarOpen: boolean;
};

const mainLinks = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "College Setup",
    href: "/admin/college-setup",
    icon: Building2,
  },
  {
    label: "Teachers",
    href: "/admin/teachers",
    icon: UserRound,
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

const bottomLinks = [
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Help & Support",
    href: "/admin/help",
    icon: HelpCircle,
  },
];

export default function AdminSidebar({
  sidebarOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed bottom-0 left-0 top-16 z-40 w-64 bg-[#11263d] text-white transition-transform duration-200 ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col px-4 py-5">

        {/* Main navigation */}
        <nav className="space-y-1.5">
          {mainLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex h-12 items-center gap-4 rounded-xl px-4 text-[15px] transition ${
                  active
                    ? "bg-[#2c61c8] font-semibold text-white shadow-sm"
                    : "text-slate-100 hover:bg-white/10"
                }`}
              >
                <Icon size={21} strokeWidth={2} />

                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-5 border-t border-slate-500/40" />

        {/* Bottom navigation */}
        <nav className="space-y-1.5">
          {bottomLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex h-12 items-center gap-4 rounded-xl px-4 text-[15px] transition ${
                  active
                    ? "bg-[#2c61c8] font-semibold text-white"
                    : "text-slate-100 hover:bg-white/10"
                }`}
              >
                <Icon size={21} strokeWidth={2} />

                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}