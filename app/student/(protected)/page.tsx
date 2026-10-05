"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Briefcase,
  ChevronDown,
  ClipboardCheck,
  Compass,
  GraduationCap,
  HandHelping,
  Heart,
  Library,
  ListChecks,
  LogOut,
  MapPin,
  Medal,
  Newspaper,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StudentProfile = {
  departmentName: string;
  programmeName: string;
  semesterNumber: number;
};

type StudentUser = {
  fullName: string;
  userId: string;
  role: string;
  profile: StudentProfile | null;
};

type MeResponse = {
  success: boolean;
  message?: string;
  user?: StudentUser;
};

type CardItem = {
  icon: LucideIcon;
  label: string;
};

type ArenaCardData = {
  key: string;
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: CardItem[];
  cta: string;
  cardClass: string;
  iconClass: string;
  itemIconClass: string;
  buttonClass: string;
};

// Change this if your me route lives at a different path
const ME_ENDPOINT = "/api/student/me";

const cards: ArenaCardData[] = [
  {
    key: "compete",
    href: "/student/compete",
    icon: Trophy,
    title: "Compete",
    description:
      "Test your knowledge. Challenge yourself. Climb the leaderboard.",
    items: [
      { icon: ListChecks, label: "Quizzes" },
      { icon: ClipboardCheck, label: "Exams" },
      { icon: Medal, label: "Tournaments" },
      { icon: Award, label: "Leaderboards & Badges" },
    ],
    cta: "Enter Compete",
    cardClass:
      "bg-[linear-gradient(145deg,rgba(255,251,236,0.95),rgba(255,248,220,0.9))] border-[#f4df9e]",
    iconClass: "bg-[linear-gradient(145deg,#ffb615,#ff9f00)]",
    itemIconClass: "text-[#f5a900]",
    buttonClass: "bg-[linear-gradient(90deg,#ffd432,#ffc21d)] text-[#101010]",
  },
  {
    key: "peer",
    href: "/student/peer-to-peer",
    icon: Users,
    title: "Peer-to-Peer",
    description: "Learn together. Help each other. Grow as a community.",
    items: [
      { icon: HandHelping, label: "Find or offer help" },
      { icon: MapPin, label: "Meet on campus" },
      { icon: Zap, label: "Earn XP & build your profile" },
      { icon: Heart, label: "Be a part of a supportive community" },
    ],
    cta: "Enter Peer-to-Peer",
    cardClass:
      "bg-[linear-gradient(145deg,rgba(239,253,247,0.98),rgba(229,250,242,0.95))] border-[#b8eddc]",
    iconClass: "bg-[linear-gradient(145deg,#0caf72,#00a66a)]",
    itemIconClass: "text-[#00a56b]",
    buttonClass: "bg-[linear-gradient(90deg,#36d99b,#23cf90)] text-[#062b1d]",
  },
  {
    key: "discover",
    href: "/student/discover",
    icon: Compass,
    title: "Discover",
    description: "Explore opportunities. Stay updated. Get inspired.",
    items: [
      { icon: Briefcase, label: "Career opportunities" },
      { icon: Library, label: "Useful resources" },
      { icon: Newspaper, label: "Tech & industry updates" },
      { icon: Star, label: "Student achievements" },
    ],
    cta: "Enter Discover",
    cardClass:
      "bg-[linear-gradient(145deg,rgba(242,249,255,0.98),rgba(228,243,255,0.95))] border-[#b9dafe] sm:col-span-2 lg:col-span-1",
    iconClass: "bg-[linear-gradient(145deg,#2f8cf4,#116fe5)]",
    itemIconClass: "text-[#1673e5]",
    buttonClass: "bg-[linear-gradient(90deg,#348cf1,#1874e9)] text-white",
  },
];

const handwritten = "[font-family:'Comic_Sans_MS','Segoe_Print',cursive]";

const pageClass = [
  "relative min-h-screen overflow-hidden",
  "px-4 pt-4 pb-10 sm:px-[5%]",
  "bg-[#f9fcff] text-[#111735]",
  "bg-[url('/images/student_main-home_bg_pc.png')] max-[700px]:bg-[url('/images/student_main-home_bg_mobile.png')]",
  "bg-cover bg-top bg-no-repeat bg-scroll",
  "font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]",
].join(" ");

const containerClass = "mx-auto w-full max-w-[1050px]";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function StudentHomePage() {
  const router = useRouter();

  const [user, setUser] = useState<StudentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load the logged-in student
  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(ME_ENDPOINT, {
          cache: "no-store",
          signal: controller.signal,
        });

        // Not logged in, or logged in with the wrong role
        if (res.status === 401 || res.status === 403) {
          router.replace("/auth/login");
          return;
        }

        const data: MeResponse = await res.json();

        if (!res.ok || !data.success || !data.user) {
          setError(data.message || "Something went wrong.");
          setLoading(false);
          return;
        }

        setUser(data.user);
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Could not load your profile. Please try again.");
        setLoading(false);
      }
    }

    loadUser();

    return () => controller.abort();
  }, [router, reloadKey]);

  // Close the profile menu when clicking outside of it
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/auth/login";
    }
  }

  if (loading) {
    return (
      <main className={`${pageClass} flex items-center justify-center`}>
        <p className="text-[15px] text-[#5a6788]">Loading...</p>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main
        className={`${pageClass} flex flex-col items-center justify-center gap-3`}
      >
        <p className="text-[15px] text-[#5a6788]">
          {error || "Something went wrong."}
        </p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-[25px] border border-[#d1e1f6] bg-[#f4f8fd] px-[17px] py-2.5 text-[12px] font-bold"
        >
          Try again
        </button>
      </main>
    );
  }

  const hour = new Date().getHours();
  const timeOfDay: "morning" | "afternoon" | "evening" =
    hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const firstName = user.fullName.trim().split(/\s+/)[0] || "Student";

  const profileLine = user.profile
    ? `Student • ${user.profile.programmeName} • Sem ${user.profile.semesterNumber}`
    : "Student";

  return (
    <main className={pageClass}>
      {/* HEADER */}
      <header
        className={`${containerClass} relative z-20 flex items-center justify-between gap-3`}
      >
        <div className="min-w-0">
          <div className="text-[26px] font-extrabold leading-none tracking-[-1.5px] text-[#10152f] sm:text-[29px]">
            Campus<span className="text-[#1164db]">Arena</span>
          </div>

          <div className="mt-1.5 text-[11px] text-[#596887] sm:text-xs">
            Learn&nbsp; • &nbsp;Compete&nbsp; • &nbsp;Connect&nbsp; • &nbsp;Grow
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#25345e] transition hover:bg-white/70"
          >
            <Bell size={22} />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-white/70 sm:pr-2"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(145deg,#222d43,#111827)] text-xs font-bold text-white shadow-[0_2px_9px_rgba(0,0,0,0.12)]">
                {getInitials(user.fullName)}
              </span>

              <span className="hidden min-w-0 flex-col text-left sm:flex">
                <strong className="max-w-[220px] truncate text-sm">
                  {user.fullName || "Student"}
                </strong>
                <small className="max-w-[220px] truncate text-xs text-[#687695]">
                  {profileLine}
                </small>
              </span>

              <ChevronDown
                size={18}
                className={`text-[#25345e] transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-[#dce7f4] bg-white shadow-lg"
              >
                {/* Name + class, always visible here (also on phones) */}
                <div className="border-b border-[#eef2f8] px-4 py-3 sm:hidden">
                  <p className="truncate text-sm font-semibold">
                    {user.fullName || "Student"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#687695]">{profileLine}</p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-[#25345e] transition hover:bg-[#f4f8fd]"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className={`${containerClass} relative z-10 mb-6 mt-6 text-center sm:mt-8`}
      >
        <p className="mb-2 text-base text-[#344267]">
          Good {timeOfDay}, {firstName}! 👋
        </p>

        <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-[-1px] sm:text-[36px] sm:tracking-[-1.4px]">
          What do you want to do today?
        </h1>

        <p className="mt-2 text-[15px] text-[#5a6788]">
          Choose a path and make progress.
        </p>

        <div
          className={`absolute right-0 top-0 hidden -rotate-[5deg] text-center text-[15px] leading-[1.4] text-[#25345e] lg:block ${handwritten}`}
        >
          Same Campus
          <br />
          Bigger Possibilities
          <div className="mx-auto mt-1.5 h-[3px] w-[65px] -rotate-[4deg] bg-[#f4b900]" />
        </div>
      </section>

      {/* MY LEARNING (first) */}
      <Link
        href="/student/courses"
        className={`${containerClass} relative z-10 mb-5 flex flex-col gap-4 rounded-2xl border border-[#dce7f4] bg-[rgba(255,255,255,0.9)] p-4 text-[#101735] shadow-[0_5px_20px_rgba(40,75,120,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(40,75,120,0.1)] sm:flex-row sm:items-center`}
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#cbdff7] bg-[#eaf3ff] text-[#17355e]">
            <BookOpen size={24} />
          </span>

          <div className="min-w-0">
            <h3 className="text-[17px] font-bold">My Learning</h3>

            <p className="mt-0.5 text-[13px] text-[#566584]">
              Access your courses, notes, assignments and track your progress.
            </p>
          </div>
        </div>

        <span className="flex items-center justify-center gap-3 whitespace-nowrap rounded-full border border-[#d1e1f6] bg-[#f4f8fd] px-[17px] py-2.5 text-xs font-bold sm:ml-auto">
          View My Courses
          <ArrowRight size={16} />
        </span>
      </Link>

      {/* CARDS */}
      <section
        className={`${containerClass} relative z-10 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3`}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.key}
              href={card.href}
              className={`flex flex-col rounded-2xl border p-5 text-[#101735] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(35,65,110,0.1)] sm:p-6 ${card.cardClass}`}
            >
              <span
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-white ${card.iconClass}`}
              >
                <Icon size={28} />
              </span>

              <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.8px]">
                {card.title}
              </h2>

              <p className="mt-1 text-sm leading-[1.4] text-[#48587d]">
                {card.description}
              </p>

              <div className="my-4 h-px bg-[rgba(47,66,98,0.14)]" />

              <ul className="flex flex-col gap-2.5">
                {card.items.map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 text-[13px] text-[#243253]"
                    >
                      <ItemIcon
                        size={18}
                        className={`shrink-0 ${card.itemIconClass}`}
                      />
                      {item.label}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-6">
                <span
                  className={`flex h-11 items-center justify-center gap-3 rounded-full text-sm font-bold ${card.buttonClass}`}
                >
                  {card.cta}
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* BOTTOM */}
      <div
        className={`${containerClass} relative z-10 mt-10 flex flex-col items-center gap-6 lg:min-h-[75px]`}
      >
        <div
          className={`-rotate-3 text-center text-[15px] leading-[1.4] text-[#25345e] lg:absolute lg:bottom-0 lg:left-0 lg:text-left ${handwritten}`}
        >
          “A better you
          <br />
          builds a brighter tomorrow.”
          <div className="mt-1.5 h-[3px] w-[65px] -rotate-[7deg] bg-[#f4b900] max-lg:mx-auto" />
        </div>

        <div className="hidden items-center justify-center gap-6 pt-2 text-xs text-[#506083] sm:flex">
          <div className="flex items-center gap-2.5">
            <Users size={22} className="text-[#101735]" />
            For Students
          </div>

          <span className="h-7 w-px bg-[#aebbd0]" />

          <div className="flex items-center gap-2.5">
            <GraduationCap size={22} className="text-[#101735]" />
            By Our College
          </div>

          <span className="h-7 w-px bg-[#aebbd0]" />

          <div className="flex items-center gap-2.5">
            <TrendingUp size={22} className="text-[#101735]" />
            For A Brighter Future
          </div>
        </div>
      </div>
    </main>
  );
}