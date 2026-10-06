// Shared Tailwind class tokens for the Campus Arena auth cards.
// Palette: navy #0B1F3A, yellow #FFC72C, emerald (emerald-700 for text/buttons).

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export type RoleName = "student" | "teacher";

export const ui = {
  card: "relative w-full max-w-[460px] rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(11,31,58,0.15)] sm:p-8",

  // Headings
  heading: "mb-6",
  title: "text-2xl font-extrabold text-[#0B1F3A] sm:text-[28px]",
  subtitle: "mt-1 text-sm text-slate-600",

  // Navigation inside the card
  mobileBack:
    "mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0B1F3A] lg:hidden",
  backToLogin: "mb-4",
  link: "font-semibold text-emerald-700 transition hover:text-[#0B1F3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC72C] rounded",

  // Role selector
  roleContainer: "mb-6 grid grid-cols-2 gap-3",
  roleButton: (active: boolean, role: RoleName) =>
    cn(
      "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC72C]/50",
      active && role === "student" && "border-emerald-600 bg-emerald-50",
      active && role === "teacher" && "border-[#FFC72C] bg-amber-50",
      !active && "border-slate-200 bg-white hover:border-slate-300"
    ),
  roleIcon: "text-2xl",
  roleContent: "flex min-w-0 flex-col",
  roleName: "text-sm font-bold text-[#0B1F3A]",
  roleHint: "text-[11px] text-slate-600",

  // Form
  form: "flex flex-col gap-4",
  inputGroup: "flex flex-col gap-1.5",
  label: "text-sm font-semibold text-[#0B1F3A]",
  input:
    "h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-4 text-base text-[#0B1F3A] placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-[#FFC72C]/40",
  forgot: "text-right text-sm",
  terms: "flex items-start gap-2 text-sm text-slate-600",
  checkbox: "mt-1 h-4 w-4 shrink-0 accent-emerald-700",

  // Buttons
  primaryButton:
    "group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-base font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC72C]/60",
  arrow: "transition-transform group-hover:translate-x-1",
  googleButton:
    "flex h-12 w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-[#0B1F3A] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC72C]/50",
  googleIcon:
    "flex h-6 w-6 items-center justify-center rounded-full bg-[#0B1F3A] text-xs font-bold text-[#FFC72C]",

  // Divider and footer
  divider: "my-5 flex items-center gap-3 text-xs font-semibold text-slate-500",
  dividerLine: "h-px flex-1 bg-slate-200",
  registerText: "mt-5 text-center text-sm text-slate-600",
  cardBottom:
    "mt-5 flex flex-col items-center gap-3 text-sm text-slate-600 sm:flex-row sm:justify-between",
  adminLogin:
    "inline-flex items-center gap-1 rounded-full bg-[white] px-3 py-1.5 text-xs font-semibold text-[#000000] transition hover:bg-[#12305a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC72C]/50",
};
