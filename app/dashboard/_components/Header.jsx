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
    <div className="flex p-4 items-center justify-between bg-secondary shadow-md">
      <Image src={"/logo.svg"} width={160} height={100} alt="logo" />
      <ul className="flex gap-6">
        <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
          <Link href={role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}>
            Dashboard
          </Link>
        </li>

        {role === "teacher" ? (
          <>
            <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
              <Link href="/modules/teacher">Manage Modules</Link>
            </li>
            <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
              <Link href="/assessments/teacher">Assessment Reports</Link>
            </li>
            <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
              <Link href="/profile/teacher">Profile</Link>
            </li>
          </>
        ) : (
          <>
            <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
              <Link href="/modules/student">Modules</Link>
            </li>
            <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
              <Link href="/assessments/student">Assessments</Link>
            </li>
            <li className="hover:text-primary hover:font-bold transition-all cursor-pointer">
              <Link href="/profile/student">Profile</Link>
            </li>
          </>
        )}
      </ul>

      {/* ✅ Fix: Ensure sign-out redirects to /sign-in */}
      <UserButton afterSignOutUrl="/dashboard" />
    </div>
  );
}

export default Header;
