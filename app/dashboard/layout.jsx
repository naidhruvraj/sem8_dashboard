// "use client";

// import React, { useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import Header from "./_components/Header";

// function DashboardLayout({ children }) {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoaded) return; // Ensure Clerk is fully loaded before proceeding

//     if (!user) {
//       console.log("User not authenticated. Redirecting to sign-in...");
//       router.replace("/sign-in"); // Redirect unauthenticated users to sign-in
//       return;
//     }

//     console.log("User metadata:", user.publicMetadata); // ✅ Debugging output

//     const role = user.publicMetadata?.role;
//     if (role === "teacher") {
//       console.log("Redirecting to teacher dashboard...");
//       router.replace("/dashboard/teacher");
//     } else {
//       console.log("No role assigned. Redirecting to student dashboard...");
//       router.replace("/dashboard/student");
//     }
//   }, [isLoaded, user, router]);

//   if (!isLoaded) return <div>Loading...</div>; // Show loading state until Clerk is ready

//   return (
//     <div>
//       <Header />
//       <main>{children}</main>
//     </div>
//   );
// }

// export default DashboardLayout;
"use client";

import React, { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";

function DashboardLayout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      console.log("User not authenticated. Redirecting to sign-in...");
      router.replace("/sign-in");
      return;
    }

    setAuthLoading(false); // ✅ Authentication check done

    const role = user.publicMetadata?.role;
    if (role === "teacher") {
      console.log("Teacher detected. Showing header...");
      setIsTeacher(true);
      setShowHeader(true); // ✅ Show header for teachers
      return;
    }

    console.log("No role assigned. Checking student pre-assessment status...");

    const checkPreAssessmentStatus = async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        const res = await fetch(`/api/saveStudentData?email=${email}`);

        if (!res.ok) {
          if (res.status === 404) {
            console.warn("Student record not found. Assuming new student.");
            setShowHeader(false); // New student → No Header, Show UserButton
          } else {
            console.error("Failed to fetch student status:", await res.text());
          }
          return;
        }

        const data = await res.json();
        setShowHeader(data.preAssessmentCompleted || false); // ✅ Show header if pre-assessment is done
      } catch (error) {
        console.error("Error checking student status:", error);
      }
    };

    checkPreAssessmentStatus();
  }, [isLoaded, user, router]);

  // ✅ Show engaging loading screen while authentication is in progress
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-purple-400">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
        <p className="text-white text-lg font-semibold">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ✅ Show header for both teachers & students (if pre-assessment is completed) */}
      {showHeader && <Header />}

      {/* ✅ Show UserButton only if: 
          - User is NOT a teacher 
          - Header is NOT shown (New Students) */}
      {!showHeader && !isTeacher && (
        <div className="absolute top-4 right-4">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      )}

      <main>{children}</main>
    </div>
  );
}

export default DashboardLayout;
