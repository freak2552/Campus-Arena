//checks whether onboarding is completed

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function ProtectedStudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/auth/login");
  }

  const academicProfile =
    await prisma.studentAcademicProfile.findUnique({
      where: {
        userId: user.id,
      },
    });

  if (!academicProfile) {
    redirect("/student/onboarding");
  }

  return <>{children}</>;
}