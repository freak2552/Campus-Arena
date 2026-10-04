"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type StudentUser = {
  fullName: string;
  userId: string;
  role: string;
};

type MeResponse = {
  success: boolean;
  message?: string;
  user?: StudentUser;
};

type CardItem = {
  icon: string;
  label: string;
};

type ArenaCardData = {
  key: string;
  href: string;
  icon: string;
  title: string;
  /** Two lines, rendered with a <br /> between them */
  description: [string, string];
  items: CardItem[];
  cta: string;
  cardClass: string;
  iconClass: string;
  itemIconClass: string;
  buttonClass: string;
};


const ME_ENDPOINT = "/api/student/me";

const cards: ArenaCardData[] = [
  {
    key: "compete",
    href: "/student/compete",
    icon: "🏆",
    title: "Compete",
    description: [
      "Test your knowledge. Challenge",
      "yourself. Climb the leaderboard.",
    ],
    items: [
      { icon: "♧", label: "Quizzes" },
      { icon: "▣", label: "Exams" },
      { icon: "🏆", label: "Tournaments" },
      { icon: "♟", label: "Leaderboards & Badges" },
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
    icon: "👥",
    title: "Peer-to-Peer",
    description: ["Learn together. Help each other.", "Grow as a community."],
    items: [
      { icon: "♧", label: "Find or offer help" },
      { icon: "◉", label: "Meet on campus" },
      { icon: "♟", label: "Earn XP & build your profile" },
      { icon: "●", label: "Be a part of a supportive community" },
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
    icon: "◈",
    title: "Discover",
    description: ["Explore opportunities. Stay updated.", "Get inspired."],
    items: [
      { icon: "▣", label: "Career opportunities" },
      { icon: "♟", label: "Useful resources" },
      { icon: "↟", label: "Tech & industry updates" },
      { icon: "★", label: "Student achievements" },
    ],
    cta: "Enter Discover",
    cardClass:
      "bg-[linear-gradient(145deg,rgba(242,249,255,0.98),rgba(228,243,255,0.95))] border-[#b9dafe] max-[1100px]:col-span-2 max-[700px]:col-auto",
    iconClass: "bg-[linear-gradient(145deg,#2f8cf4,#116fe5)]",
    itemIconClass: "text-[#1673e5]",
    buttonClass: "bg-[linear-gradient(90deg,#348cf1,#1874e9)] text-white",
  },
];

const handwritten = "[font-family:'Comic_Sans_MS','Segoe_Print',cursive]";

const pageClass = [
  "relative min-h-screen overflow-hidden",
  "px-[5%] pt-4 pb-[45px] max-[1100px]:px-[4%]",
  "bg-[#f9fcff] text-[#111735]",
  "bg-[url('/images/student_main-home_bg_pc.png')] max-[700px]:bg-[url('/images/student_main-home_bg_mobile.png')]",
  "bg-cover bg-top bg-no-repeat bg-scroll",
  "font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]",
].join(" ");

const bottomFeatureClass = "flex items-center gap-2.5";
const bottomFeatureIconClass = "text-[#101735] text-[22px] font-bold";
const bottomDividerClass = "w-px h-7 bg-[#aebbd0]";

export default function StudentHomePage() {
  const router = useRouter();

  const [user, setUser] = useState<StudentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

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

  return (
    <main className={pageClass}>
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-[225px] top-[135px] h-[340px] w-[340px] rounded-full bg-[rgba(88,180,255,0.12)] blur-[70px]" />
      <div className="pointer-events-none absolute -right-[225px] top-[190px] h-[340px] w-[340px] rounded-full bg-[rgba(88,180,255,0.12)] blur-[70px]" />

      {/* HEADER */}
      <header className="relative z-10 mx-auto flex max-w-[1030px] items-center justify-between">
        <div>
          <div className="text-[29px] font-extrabold leading-none tracking-[-1.5px] text-[#10152f] max-[700px]:text-[28px]">
            Campus<span className="text-[#1164db]">Arena</span>
          </div>

          <div className="mt-1.5 text-[12px] text-[#596887]">
            Learn&nbsp; • &nbsp;Compete&nbsp; • &nbsp;Connect&nbsp; • &nbsp;Grow
          </div>
        </div>

        <div className="ml-auto flex translate-x-[28px] items-center gap-[11px] max-[700px]:translate-x-0">
          <div className="relative mr-2.5 rotate-180 text-[24px] max-[700px]:hidden">
            ♧
            <span className="absolute -right-[7px] -top-1 flex h-3.5 w-3.5 rotate-180 items-center justify-center rounded-full bg-[#ef2d36] text-[8px] font-bold text-white">
              2
            </span>
          </div>

          <div className="flex h-[39px] w-[39px] items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(145deg,#222d43,#111827)] text-[10px] font-bold text-white shadow-[0_2px_9px_rgba(0,0,0,0.12)]">
            p
          </div>

          <div className="flex flex-col gap-[3px] max-[700px]:hidden">
            <strong className="text-[12px]">{user.fullName || "Student"}</strong>
            <small className="text-[11px] text-[#687695]">
              Student&nbsp; • &nbsp;IT Sem 5
            </small>
          </div>

          <div className="ml-3.5 -translate-y-[3px] text-[23px]">⌄</div>
        </div>
      </header>

      {/* MAIN */}
      <section className="relative z-[5] mx-auto mb-3.5 mt-5 text-center max-[700px]:mt-[35px]">
        <p className="mb-[7px] text-[16px] text-[#344267]">
          Good {timeOfDay}, {user.fullName || "Student"}! 👋
        </p>

        <h1 className="text-[36px] font-extrabold leading-[1.15] tracking-[-1.4px] max-[700px]:text-[31px]">
          What do you want to do today?
        </h1>

        <p className="mt-1.5 text-[15px] text-[#5a6788] max-[700px]:text-[16px]">
          Choose a path and make progress.
        </p>

        {/* SAME CAMPUS */}
        <div
          className={`absolute right-[1%] top-[13px] -rotate-[5deg] text-center text-[15px] leading-[1.4] text-[#25345e] max-[1100px]:hidden ${handwritten}`}
        >
          Same Campus
          <br />
          Bigger Possibilities
          <div className="mx-auto mt-1.5 h-[3px] w-[65px] -rotate-[4deg] bg-[#f4b900]" />
        </div>
      </section>

      {/* CARDS */}
      <section className="relative z-[6] mx-auto mt-3.5 grid max-w-[1050px] grid-cols-3 gap-[18px] max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={[
              "relative min-h-[365px] overflow-hidden rounded-2xl border px-[23px] pb-[18px] pt-5 text-[#101735]",
              "transition-[transform,box-shadow] duration-200 ease-[ease]",
              "hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(35,65,110,0.1)]",
              "max-[700px]:min-h-[430px]",
              card.cardClass,
            ].join(" ")}
          >
            <div
              className={`mb-2 flex h-16 w-16 items-center justify-center rounded-[14px] text-[29px] ${card.iconClass}`}
            >
              {card.icon}
            </div>

            <h2 className="text-[24px] font-bold leading-[1.1] tracking-[-0.8px]">
              {card.title}
            </h2>

            <p className="mt-1 text-[14px] leading-[1.4] text-[#48587d]">
              {card.description[0]}
              <br />
              {card.description[1]}
            </p>

            <div className="mb-[9px] mt-[13px] h-px bg-[rgba(47,66,98,0.14)]" />

            <ul className="flex flex-col gap-[7px]">
              {card.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-[13px] text-[#243253]"
                >
                  <span
                    className={`w-[21px] text-center text-[15px] ${card.itemIconClass}`}
                  >
                    {item.icon}
                  </span>{" "}
                  {item.label}
                </li>
              ))}
            </ul>

            <div
              className={`absolute inset-x-[22px] bottom-[17px] flex h-[43px] items-center justify-center gap-[18px] rounded-[28px] text-[14px] font-bold ${card.buttonClass}`}
            >
              {card.cta}
              <b className="text-[22px] font-normal">→</b>
            </div>
          </Link>
        ))}
      </section>

      {/* MY LEARNING */}
      <Link
        href="/student/learning"
        className="relative z-[7] mx-auto mt-[18px] flex min-h-[70px] max-w-[870px] items-center rounded-2xl border border-[#dce7f4] bg-[rgba(255,255,255,0.86)] px-[18px] py-2.5 text-[#101735] shadow-[0_5px_20px_rgba(40,75,120,0.05)] max-[1100px]:mx-0 max-[700px]:flex-wrap max-[700px]:gap-2.5"
      >
        <div className="flex h-[45px] w-[52px] items-center justify-center rounded-[13px] border border-[#cbdff7] bg-[#eaf3ff] text-[22px] text-[#17355e]">
          ▣
        </div>

        <div className="ml-[15px] max-[700px]:ml-0 max-[700px]:max-w-[calc(100%-80px)]">
          <h3 className="text-[17px] font-bold">My Learning</h3>

          <p className="mt-[3px] text-[13px] text-[#566584]">
            Access your courses, notes, assignments and track your progress.
          </p>
        </div>

        <div className="ml-auto whitespace-nowrap rounded-[25px] border border-[#d1e1f6] bg-[#f4f8fd] px-[17px] py-2.5 text-[12px] font-bold max-[700px]:ml-0 max-[700px]:w-full max-[700px]:text-center">
          View My Courses
          <b className="ml-[11px] text-[20px] font-normal">→</b>
        </div>
      </Link>

      {/* BOTTOM */}
      <div className="relative z-[8] mx-auto mt-8 min-h-[75px] max-w-[1050px]">
        <div
          className={`absolute bottom-0 left-0 -rotate-3 text-[15px] leading-[1.4] text-[#25345e] max-[700px]:relative max-[700px]:mt-[25px] ${handwritten}`}
        >
          “A better you
          <br />
          builds a brighter tomorrow.”
          <div className="mt-1.5 h-[3px] w-[65px] -rotate-[7deg] bg-[#f4b900]" />
        </div>

        <div className="flex items-center justify-center gap-6 pt-7 text-[12px] text-[#506083] max-[700px]:hidden">
          <div className={bottomFeatureClass}>
            <span className={bottomFeatureIconClass}>♙</span>
            For Students
          </div>

          <i className={bottomDividerClass} />

          <div className={bottomFeatureClass}>
            <span className={bottomFeatureIconClass}>◇</span>
            By Our College
          </div>

          <i className={bottomDividerClass} />

          <div className={bottomFeatureClass}>
            <span className={bottomFeatureIconClass}>▮▮▮</span>
            For A Brighter Future
          </div>
        </div>
      </div>
    </main>
  );
}