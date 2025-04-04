// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import Header from "@/app/dashboard/_components/Header"; 

// // Function to generate a URL-friendly slug from module name
// const generateSlug = (name) => {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-") // Replace spaces & special chars with "-"
//     .replace(/^-+|-+$/g, ""); // Remove leading & trailing dashes
// };

// const colors = [
//   { text: "#ff4d4d", bg: "#ffcccc" },
//   { text: "#4d79ff", bg: "#cce0ff" },
//   { text: "#33cc33", bg: "#ccffcc" },
//   { text: "#ff9933", bg: "#ffddb3" },
//   { text: "#9933ff", bg: "#e0ccff" },
//   { text: "#ff6699", bg: "#ffccd9" },
// ];

// const StudentAssessment = () => {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const [modules, setModules] = useState([]);

//   // Fetch modules
//   const fetchModules = useCallback(async () => {
//     try {
//       const response = await axios.get("/api/modules/getModules");
//       setModules(response.data.modules);
//     } catch (error) {
//       console.error("Error fetching modules:", error);
//       alert("Failed to load modules. Please try again later.");
//     }
//   }, []);

//   useEffect(() => {
//     fetchModules();
//   }, [fetchModules]);

//   // Handle navigation using module slug
//   const handleStartTest = (module) => {
//     const moduleSlug = generateSlug(module.name);
//     router.push(`/maintest/student/post-assessment/${moduleSlug}?id=${module._id}`);
//   };
  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-300">
//       <div className="relative z-50 bg-white shadow-md">
//         <Header />
//       </div>

//       <div className="mt-20">
//         <h1 className="text-4xl font-bold text-center mt-6 text-indigo-900">
//           📝 Select a Module for Assessment
//         </h1>
//         <p className="text-center text-lg text-gray-700 mb-6">
//           Click "Start Test" to begin your assessment.
//         </p>

//         {/* Modules Container */}
//         <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10 p-6">
//           {modules.map((mod, index) => {
//             const colorIndex = index % colors.length;
//             return (
//               <div
//                 key={mod._id}
//                 className="relative p-6 rounded-2xl shadow-lg border-4 border-white flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105"
//                 style={{
//                   backgroundColor: colors[colorIndex].bg,
//                   minHeight: "250px",
//                   width: "400px",
//                   justifyContent: "center",
//                   textAlign: "center",
//                   position: "relative",
//                 }}
//               >
//                 <div
//                   className="absolute top-0 left-0 w-full p-3 text-xl font-bold rounded-t-2xl"
//                   style={{
//                     backgroundColor: colors[colorIndex].text,
//                     color: "white",
//                   }}
//                 >
//                   {mod.name}
//                 </div>

//                 <div className="mt-12 px-4">
//                   <p className="text-gray-800 text-lg">{mod.description}</p>

//                   <button
//                     className="mt-4 px-6 py-2 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md transition-all hover:bg-indigo-700 active:scale-95"
//                     onClick={() => handleStartTest(mod)}
//                   >
//                     Start Test
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentAssessment;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "@/app/dashboard/_components/Header"; 

const colors = [
  { text: "#ff4d4d", bg: "#ffcccc" },
  { text: "#4d79ff", bg: "#cce0ff" },
  { text: "#33cc33", bg: "#ccffcc" },
  { text: "#ff9933", bg: "#ffddb3" },
  { text: "#9933ff", bg: "#e0ccff" },
  { text: "#ff6699", bg: "#ffccd9" },
];

const StudentAssessment = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [modules, setModules] = useState([]);

  // Fetch modules
  const fetchModules = useCallback(async () => {
    try {
      const response = await axios.get("/api/modules/getModules");
      setModules(response.data.modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      alert("Failed to load modules. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Handle navigation and store module ID in sessionStorage
  const handleStartTest = (module) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedModuleId", module._id); // Store module ID
      sessionStorage.setItem("selectedModuleName", module.name);
    }
    router.push("/maintest/student/post-assessment"); // Navigate to PostAssessment page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-300">
      <div className="relative z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="mt-20">
        <h1 className="text-4xl font-bold text-center mt-6 text-indigo-900">
          📝 Select a Module for Assessment
        </h1>
        <p className="text-center text-lg text-gray-700 mb-6">
          Click "Start Test" to begin your assessment.
        </p>

        {/* Modules Container */}
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10 p-6">
          {modules.map((mod, index) => {
            const colorIndex = index % colors.length;
            return (
              <div
                key={mod._id}
                className="relative p-6 rounded-2xl shadow-lg border-4 border-white flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105"
                style={{
                  backgroundColor: colors[colorIndex].bg,
                  minHeight: "250px",
                  width: "400px",
                  justifyContent: "center",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full p-3 text-xl font-bold rounded-t-2xl"
                  style={{
                    backgroundColor: colors[colorIndex].text,
                    color: "white",
                  }}
                >
                  {mod.name}
                </div>

                <div className="mt-12 px-4">
                  <p className="text-gray-800 text-lg">{mod.description}</p>

                  <button
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md transition-all hover:bg-indigo-700 active:scale-95"
                    onClick={() => handleStartTest(mod)}
                  >
                    Start Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentAssessment;
