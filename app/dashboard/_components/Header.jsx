"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

function Header() {
  const pathname = usePathname();

  // Hide header if on assessment page
  if (pathname.includes('/assessment')) {
    return null;
  }

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
      <ul className='flex gap-6'>
        <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>
          <Link href="/modules">Modules</Link>
        </li>
        <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>
          <Link href="/assessments">Assessments</Link>
        </li>
        <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
      <UserButton/>
    </div>
  );
}

export default Header;


