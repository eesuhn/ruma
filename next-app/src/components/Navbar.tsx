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
import { MenuSquareIcon } from 'lucide-react';
import WalletAdapter from '@/components/WalletAdapter';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => (pathname === path ? ' text-black' : '');

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
        <div className="flex h-16 items-center justify-between">
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
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/events"
                className={`rounded-md px-3 py-2 text-base text-[#999999] hover:text-black hover:underline ${isActive('/events')}`}
                prefetch={false}
              >
                Events
              </Link>
              <Link
                href="/discover"
                className={`rounded-md px-3 py-2 text-base text-[#999999] hover:text-black hover:underline ${isActive('/discover')}`}
                prefetch={false}
              >
                Discover
              </Link>
              <Link
                href="#"
                className="rounded-md px-3 py-2 text-base text-[#999999] hover:text-black hover:underline"
                prefetch={false}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="hidden items-center md:flex">
            <Button
              size="sm"
              className="text-md mr-2 h-12 rounded bg-slate-500 px-6 font-bold hover:bg-slate-600"
            >
              <FiPlusCircle className="" />
              Create Event
            </Button>
            <WalletAdapter />
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
                  <Link
                    href="/events"
                    className="text-lg font-medium hover:underline"
                    prefetch={false}
                  >
                    Event
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:underline"
                    prefetch={false}
                  >
                    Discover
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:underline"
                    prefetch={false}
                  >
                    Profile
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:underline"
                    prefetch={false}
                  >
                    Create Event
                  </Link>
                  <div className="pt-4">
                    <WalletAdapter />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
