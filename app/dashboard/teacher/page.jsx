'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import TeacherDashboard from './teacher-dashboard';

const TeacherPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (isLoaded && user?.publicMetadata?.role !== 'teacher') {
    router.replace('/dashboard/student');
    return null;
  }

  return <TeacherDashboard />;
};

export default TeacherPage;
