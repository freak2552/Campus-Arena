import { Check } from "lucide-react";
import { panelContent } from "./content";
import type { Role } from "./content";
import { cn } from "./styles";

// "Campus" in white, "Arena" in yellow
export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-6xl font-extrabold tracking-tight text-white">
        Campus <span className="text-[#FFC72C]">Arena</span>
      </span>
    </div>
  );
}

type BrandPanelProps = {
  role: Role;
  className?: string;
  onMobileLogin?: () => void;
};

export function BrandPanel({ role, className, onMobileLogin }: BrandPanelProps) {
  const content = panelContent[role];

  return (
    <aside
      className={cn(
        "relative flex-col gap-10 overflow-hidden bg-[#1e4477] px-6 py-10 text-white sm:px-12 lg:min-h-screen lg:px-14 lg:py-14",
        className
      )}
    >
      {/* Decorative shapes */}
      <div
        aria-hidden
        className="ca-float pointer-events-none absolute -right-28 -top-28 h-[360px] w-[360px] rounded-full bg-emerald-600 "
      />
      <div
        aria-hidden
        className="ca-drift pointer-events-none absolute -bottom-36 right-10 h-[320px] w-[320px] rounded-full  bg-[#FFC72C]"
      />
      <div
        aria-hidden
        className="ca-spin pointer-events-none absolute -left-20 bottom-40 h-[180px] w-[180px] rounded-full border-[28px] border-[#FFC72C] border-t-emerald-600"
      />

      <div className="relative z-10 flex flex-1 flex-col gap-10">
        <Brand />

        {/* key restarts the animations when the role changes */}
        <div key={role} className="ca-rise flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              {content.heading}
              <span className="relative block h-[1.2em] overflow-hidden text-emerald-400">
                {content.words.map((word, i) => (
                  <span
                    key={word}
                    className="ca-word absolute left-0 top-0 whitespace-nowrap"
                    style={{ animationDelay: `${i * 3}s` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h2>
            <p className="mt-3 text-lg text-slate-300">{content.tagline}</p>
          </div>

          <ul className="grid max-w-[560px] grid-cols-1 gap-3 sm:grid-cols-2">
            {content.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4"
                >
                  <span
                    className={cn(
                      "mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-[#0B1F3A]",
                      feature.accent === "yellow"
                        ? "bg-[#FFC72C]"
                        : "bg-emerald-400"
                    )}
                  >
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-snug text-slate-300">
                    {feature.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {onMobileLogin && (
        <button
          type="button"
          onClick={onMobileLogin}
          className="sticky bottom-4 z-10 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffbb00] text-base font-bold text-[#0B1F3A] shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 lg:hidden"
        >
          Login <span aria-hidden>→</span>
        </button>
      )}
    </aside>
  );
}
