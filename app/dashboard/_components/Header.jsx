import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
function Header() {
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
      <ul className='flex gap-6'>
        <li className= 'hover:text-primary  hover:font-bold transition-all cursor-pointer'>Dashboard</li>
        <li className= 'hover:text-primary  hover:font-bold transition-all cursor-pointer'>Modules</li>
        <li className= 'hover:text-primary  hover:font-bold transition-all cursor-pointer'>Assessments</li>
        <li className= 'hover:text-primary  hover:font-bold transition-all cursor-pointer'>Dashboard</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header

