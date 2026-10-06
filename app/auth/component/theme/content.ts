import {
  BookOpen,
  ClipboardCheck,
  Compass,
  Megaphone,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Role = "student" | "teacher";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "yellow" | "emerald";
};

export type PanelContent = {
  heading: string;
  // Exactly 4 words: the rotating animation is timed for 4 slots.
  words: [string, string, string, string];
  tagline: string;
  features: Feature[];
};

export const panelContent: Record<Role, PanelContent> = {
  // student 
  student: {
    heading: "Student",
    words: ["Learn", "Compete", "Connect", "Grow"],
    tagline: "Your campus, your community, your arena.",
    features: [
      {
        icon: BookOpen,
        title: "My Learning",
        description:
          "Access your courses, notes, assignments and track your progress.",
        accent: "emerald",
      },
      {
        icon: Trophy,
        title: "Compete",
        description:
          "Test your knowledge. Challenge yourself. Climb the league.",
        accent: "yellow",
      },
      {
        icon: Users,
        title: "Peer-to-Peer",
        description: "Ask doubts, help others and earn recognition from your community.",
        accent: "emerald",
      },
      {
        icon: Compass,
        title: "Discover",
        description: "Explore resources, achievements and opportunities beyond the classroom.",
        accent: "yellow",
      },
    ],
  },

  // Placeholder copy: replace with the real teacher dashboard sections.
  teacher: {
    heading: "Teacher",
    words: ["Teach", "Create", "Engage", "Inspire"],
    tagline: "Turn your classroom into a more connected learning experience.",
    features: [
      {
        icon: BookOpen,
        title: "My Courses",
        description: "Create courses, share notes and set assignments.",
        accent: "emerald",
      },
      {
        icon: Users,
        title: "My Students",
        description: "See progress and support every learner in your class.",
        accent: "yellow",
      },
      {
        icon: ClipboardCheck,
        title: "Assessments",
        description: "Set quizzes and exams, then review the results.",
        accent: "emerald",
      },
      {
        icon: Megaphone,
        title: "Announcements",
        description: "Share updates and celebrate student achievements.",
        accent: "yellow",
      },
    ],
  },
};
