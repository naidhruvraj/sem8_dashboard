// 'use client';

// import React from 'react';
// import { useUser } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import TeacherDashboard from './teacher-dashboard';

// const TeacherPage = () => {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();

//   if (isLoaded && user?.publicMetadata?.role !== 'teacher') {
//     router.replace('/dashboard/student');
//     return null;
//   }

//   return <TeacherDashboard />;
// };

// export default TeacherPage;

'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import TeacherDashboard from './teacher-dashboard';

const TeacherPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const role = user?.publicMetadata?.role;
      if (role !== 'teacher') {
        setRedirecting(true);
        router.replace('/dashboard/student'); // ✅ Moved inside useEffect
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return <TeacherDashboard />;
};

export default TeacherPage;

