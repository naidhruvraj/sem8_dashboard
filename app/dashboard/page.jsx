"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      const role = user?.publicMetadata?.role;

      if (role === "teacher") {
        router.replace("/dashboard/teacher");
      } else {
        router.replace("/dashboard/student"); // Default to student if no role
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#b053f3] to-[#bc85ef] text-white p-8">
    {/* Spinning Loader Animation */}
      <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-semibold bg-white/20 px-6 py-3 rounded-lg backdrop-blur-md">
        Loading, please wait...
      </p>
    </div>
    </div>
  );
}