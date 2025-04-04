"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const { user } = useUser();

  if (pathname.includes("/assessment")) {
    return null; // Hide header during assessment
  }

  const role = user?.publicMetadata?.role;

  return (
    <div
      className="relative flex items-center justify-between px-8 py-4 shadow-lg text-white"
      style={{
        backgroundImage: "url('https://picjumbo.com/wp-content/uploads/abstract-background-free-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Logo (if needed) */}
      <div className="relative z-10 flex items-center gap-3">
        {/* <Image src="/logo.svg" width={140} height={80} alt="Logo" /> */}
        <h1 className="text-2xl font-bold tracking-wide">Learning Life</h1>
      </div>

      {/* Navigation Links */}
      <ul className="relative z-10 flex gap-8 text-lg">
        <li className="relative group">
          <Link href={role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}>
            Dashboard
          </Link>
          <div className="absolute left-0 w-full h-1 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </li>

        {role === "teacher" ? (
          <>
            <li className="relative group">
              <Link href="/modules/teacher">Manage Modules</Link>
              <div className="absolute left-0 w-full h-1 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </li>
            <li className="relative group">
              <Link href="/maintest/teacher">Assessment Reports</Link>
              <div className="absolute left-0 w-full h-1 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </li>
          </>
        ) : (
          <>
            <li className="relative group">
              <Link href="/modules/student">Modules</Link>
              <div className="absolute left-0 w-full h-1 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </li>
            <li className="relative group">
              <Link href="/maintest/student">Assessments</Link>
              <div className="absolute left-0 w-full h-1 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </li>
          </>
        )}
      </ul>

      {/* User Profile & Logout Button */}
      <div className="relative z-10">
        <UserButton afterSignOutUrl="/dashboard" />
      </div>
    </div>
  );
}

export default Header;
