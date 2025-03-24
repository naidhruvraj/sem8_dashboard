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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        {!hasTakenTest ? (
          <div className="text-center">
            <h1 className="text-2xl mb-4">Welcome to the Dashboard</h1>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600"
              onClick={handleBeginTest}
            >
              Begin Pre-Assessment Exam
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl mb-4">You have successfully completed the Pre-Assessment!</h1>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-600"
              onClick={() => router.push('/modules')}
            >
              Proceed to Modules
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreAssessment;
