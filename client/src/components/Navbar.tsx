'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FiPlusCircle } from 'react-icons/fi';
import { MenuSquareIcon, Ticket, Compass, User } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { name: 'Events', href: '/events', icon: Ticket },
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Profile', href: '/profile', icon: User },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => (pathname === path ? ' text-black' : '');

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto py-1 sm:px-6 lg:px-4">
        <div className="flex h-16 items-center justify-between px-[6%]">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" prefetch={false}>
              <Image
                src={'/ruma-banner.png'}
                alt="ruma-logo"
                width={120}
                height={80}
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-base text-[#999999] hover:text-black ${isActive(item.href)} flex items-center gap-2`}
                  prefetch={false}
                >
                  <item.icon size={20} className="mr-[2px] mt-[-2px]" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/create-event" prefetch={false}>
              <Button
                size="sm"
                className="text-md mr-2 h-[44px] rounded bg-slate-500 px-4 font-bold hover:bg-slate-600"
              >
                <FiPlusCircle className="" />
                Create Event
              </Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuSquareIcon size={24} />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium hover:underline"
                      prefetch={false}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/create-event"
                    className="text-lg font-medium hover:underline"
                    prefetch={false}
                  >
                    Create Event
                  </Link>
                  <div className="pt-4"></div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
