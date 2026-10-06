import type { ReactNode } from "react";
import { Brand, BrandPanel } from "./BrandPanel";
import type { Role } from "./content";
import { ThemeStyles } from "./ThemeStyles";
import { cn } from "./styles";

type AuthShellProps = {
  role: Role;
  children: ReactNode;
  // Login only: on mobile the left panel shows first and a Login button opens the card.
  // Leave undefined (register) to always show the card on mobile.
  mobileCardOpen?: boolean;
  onMobileLogin?: () => void;
};

export function AuthShell({
  role,
  children,
  mobileCardOpen,
  onMobileLogin,
}: AuthShellProps) {
  const cardVisible = mobileCardOpen !== false;

  return (
    <main className="min-h-screen bg-[#0B1F3A] lg:grid lg:grid-cols-[1.05fr_1fr]">
      <ThemeStyles />

      <BrandPanel
        role={role}
        onMobileLogin={onMobileLogin}
        className={cardVisible ? "hidden lg:flex" : "flex"}
      />

      <section
        className={cn(
          "min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 px-4 py-8 sm:px-8 lg:flex",
          cardVisible ? "flex" : "hidden"
        )}
      >
        <div className="rounded-2xl bg-[#0B1F3A] px-5 py-3 lg:hidden">
          <Brand />
        </div>
        {children}
      </section>
    </main>
  );
}
