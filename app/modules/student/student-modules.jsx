"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from "@/app/dashboard/_components/Header";

// Define colors for text and backgrounds
const colors = [
  { text: "#ff4d4d", bg: "#ffcccc" },
  { text: "#4d79ff", bg: "#cce0ff" },
  { text: "#33cc33", bg: "#ccffcc" },
  { text: "#ff9933", bg: "#ffddb3" },
  { text: "#9933ff", bg: "#e0ccff" },
  { text: "#ff6699", bg: "#ffccd9" },
];

const StudentModules = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [modules, setModules] = useState([]);

  // Redirect unauthorized users
  useEffect(() => {
    if (isLoaded) {
      const userRole = user?.publicMetadata?.role;
      if (userRole === "teacher") {
        router.replace("/dashboard/teacher");
      }
    }
  }, [isLoaded, user, router]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300">
      <Header />

      <h1 className="text-4xl font-bold text-center mt-6 text-indigo-900">
        🎓 Learn with Fun!
      </h1>
      <p className="text-center text-lg text-gray-700 mb-6">
        Explore exciting learning modules with interactive videos!
      </p>

      {/* Modules Container */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10 p-6">
        {modules.map((mod, index) => {
          const colorIndex = index % colors.length;
          return (
            <div
              key={mod._id}
              className="p-6 rounded-2xl shadow-lg border-4 border-white flex flex-col items-center"
              style={{
                backgroundColor: colors[colorIndex].bg,
                minHeight: "450px",
                width: "450px",
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <h2
                className="text-3xl font-bold text-center"
                style={{ color: colors[colorIndex].text }}
              >
                {mod.name}
              </h2>
              <p className="text-gray-800 text-center text-lg">{mod.description}</p>
              <video controls className="w-full rounded-lg shadow-md" style={{ height: "250px" }}>
                <source src={mod.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentModules;
