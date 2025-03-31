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
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-8"
      style={{ backgroundImage: "url('https://picjumbo.com/wp-content/uploads/abstract-background-free-photo.jpg')" }}
    >
      <p className="text-white text-lg font-semibold bg-black/50 px-6 py-3 rounded-lg">
        Loading...
      </p>
    </div>
  );
}
