'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';

const TeacherDashboard = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-primary">
          Welcome, {user?.fullName || 'Teacher'}!
        </h1>
        <p className="mt-4 text-gray-600">
          "A teacher's role in shaping young minds is invaluable. Your guidance 
          and dedication empower students to unlock their full potential."
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
