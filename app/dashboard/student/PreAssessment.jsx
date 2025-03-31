'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const PreAssessment = () => {
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const testStatus = localStorage.getItem('preAssessmentDone');
    setHasTakenTest(testStatus === 'true');
  }, []);

  const handleBeginTest = () => {
    localStorage.setItem('preAssessmentDone', 'true');
    router.push('/dashboard/assessment');
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-8"
      style={{
        backgroundImage: "url('https://picjumbo.com/wp-content/uploads/abstract-background-free-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* **Light Overlay for Readability Without Hiding Background** */}
      <div className="absolute inset-0 bg-black/30"></div>

      

      {/* **Main Content: Semi-Transparent Box for Clarity** */}
      <main className="relative z-10 flex flex-col items-center justify-center p-8 bg-white/20 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 text-center w-[90%] max-w-lg">
        {!hasTakenTest ? (
          <>
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Welcome to the Pre-Assessment
            </h1>
            <p className="text-lg mb-6 opacity-90">
              This assessment helps us evaluate your skills.  
              **Only after completing this assessment, you can access other sections.**
            </p>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
              onClick={handleBeginTest}
            >
              🚀 Begin Pre-Assessment Exam
            </button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
              🎉 Assessment Completed!
            </h1>
            <p className="text-lg mb-6 opacity-90">
              Congratulations! You’ve completed the Pre-Assessment.  
              You can now proceed to learning modules.
            </p>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-600 hover:scale-105 transition-transform duration-300"
              onClick={() => router.push('/modules')}
            >
              📚 Proceed to Modules
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default PreAssessment;
