"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PreAssessment from "@/app/dashboard/student/PreAssessment";

const StudentDashboard = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      const role = user?.publicMetadata?.role;

      if (role === "teacher") {
        router.replace("/dashboard/teacher"); // Redirect teachers
      }
      // No need to check for student role. Default is student.
    }
  }, [isLoaded, user, router]);

  return <PreAssessment />;
};

export default StudentDashboard;


// "use client";

// import React, { useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import PreAssessment from "@/app/dashboard/student/PreAssessment";

// const StudentDashboard = () => {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     if (isLoaded) {
//       const role = user?.publicMetadata?.role;

//       if (role === "teacher") {
//         router.replace("/dashboard/teacher"); // Redirect teachers
//       }
//       // No need to check for student role. Default is student.
//     }
//   }, [isLoaded, user, router]);

//   return <PreAssessment />;
// };

// export default StudentDashboard;

