"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const Header = () => {

  const pathname = usePathname()
  

  return (
   <header>
    <div className='main-container inner'>
        <Link href="/">
        <Image src="logo.svg" alt='TradeNova logo'  width={190} height={1000} />
        </Link>

        <nav>
          <Link href="/" className={cn('nav-link', {
            'is-active': pathname === '/',
            'is-home': true
          })}>Home</Link>
          <p>Search Modeal</p>
          <Link href="/coins" className={cn('nav-link', {
            'is-active': pathname === '/coins',
          })}>All Coins</Link>
        </nav>
    </div>
   </header>
  )
}

export default Header
