'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent, SheetHeader,SheetTitle} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FiPlusCircle } from "react-icons/fi";
import { MenuSquareIcon } from 'lucide-react';
import Walletadpt from '@/components/Walletadpt';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path ? ' text-black' : '';

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" prefetch={false}>
              <Image src={'/ruma-banner.png'} alt='ruma-logo' width={120} height={80} />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/events"
                className={`text-base text-[#999999] hover:text-black hover:underline px-3 py-2 rounded-md ${isActive('/events')}`}
                prefetch={false}
              >
                Event
              </Link>
              <Link
                href="/discover"
                className={`text-base text-[#999999] hover:text-black hover:underline px-3 py-2 rounded-md ${isActive('/discover')}`}
                prefetch={false}
              >
                Discover
              </Link>
              <Link
                href="#"
                className="text-base text-[#999999] hover:text-black hover:underline px-3 py-2 rounded-md"
                prefetch={false}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Button  size="sm" className="mr-2 h-12 px-6 rounded bg-slate-500 hover:bg-slate-600 font-bold text-md">
              <FiPlusCircle className="" />
              Create Event
            </Button>
            <Walletadpt />
          </div>
          <div className="md:hidden flex items-center">
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
                <div className="flex flex-col space-y-4 mt-4">
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
                    <Walletadpt />
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

