'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';

const TeacherDashboard = () => {
  const { user } = useUser();

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('https://cdn.pixabay.com/photo/2018/01/24/18/05/background-3104413_1280.jpg')", // Ensure the correct image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Transparent Card with Text */}
      <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-xl p-8 text-center border border-white/40 max-w-lg">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          Welcome, {user?.fullName || 'Teacher'}! 
        </h1>
        <p className="mt-4 text-lg text-white drop-shadow">
          "A teacher's role in shaping young minds is invaluable. Your guidance 
          and dedication empower students to unlock their full potential."
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
