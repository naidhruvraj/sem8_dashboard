// import React from 'react'
// import Header from './_components/Header'

// function Dashboardlayout({children}) {
//   return (
//     <div>
//       <Header/>
//         {children}
//     </div>
//   )
// }

// export default Dashboardlayout

"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";

function DashboardLayout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Ensure Clerk is fully loaded before proceeding

    if (!user) {
      console.log("User not authenticated. Redirecting to sign-in...");
      router.replace("/sign-in"); // Redirect unauthenticated users to sign-in
      return;
    }

    console.log("User metadata:", user.publicMetadata); // ✅ Debugging output

    const role = user.publicMetadata?.role;
    if (role === "teacher") {
      console.log("Redirecting to teacher dashboard...");
      router.replace("/dashboard/teacher");
    } else {
      console.log("No role assigned. Redirecting to student dashboard...");
      router.replace("/dashboard/student");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <div>Loading...</div>; // Show loading state until Clerk is ready

  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default DashboardLayout;

