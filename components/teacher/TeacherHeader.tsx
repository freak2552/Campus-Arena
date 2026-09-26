"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
};

type TeacherHeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TeacherHeader({
  sidebarOpen,
  setSidebarOpen,
}: TeacherHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to load teacher:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b border-blue-950/20 bg-blue-950 text-white shadow-md">
      <div className="flex h-full items-center px-6">

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setSidebarOpen((previous) => !previous)}
          className="mr-5 flex h-9 w-9 items-center justify-center rounded-md text-blue-100 transition-colors hover:bg-blue-900 hover:text-white"
          aria-label={
            sidebarOpen
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
        >
          <span className="text-2xl leading-none">
            ☰
          </span>
        </button>

        {/* Logo */}
        <div className="text-xl font-bold tracking-tight">
          Campus Arena
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-6">

          <button className="text-sm text-blue-100 transition-colors hover:text-white">
            Notifications
          </button>

          <div className="text-right">
            {loading ? (
              <div className="text-sm text-blue-100">
                Loading...
              </div>
            ) : user ? (
              <>
                <div className="text-sm font-medium text-white">
                  {user.fullName}
                </div>

                <div className="text-xs text-blue-200">
                  Teacher
                </div>
              </>
            ) : (
              <div className="text-sm text-blue-100">
                Teacher
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
