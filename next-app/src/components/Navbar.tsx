'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CgProfile } from 'react-icons/cg';
import { BsQrCodeScan } from 'react-icons/bs';
import { MenuSquareIcon, Mountain } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path ? 'underline text-black' : '';
  return (
    <div className="flex items-center justify-between px-6 py-4 font-[family-name:var(--font-geist-sans)]">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Mountain className="h-10 w-10 text-[#999999]" />
        <span className="text-[28px] font-semibold">Ruma</span>
      </Link>
      <div className="hidden gap-12 lg:flex">
        <Link
          href="/"
          className="text-lg text-[#999999] underline-offset-4 hover:text-black hover:underline"
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href="/events"
          className={`text-lg text-[#999999] underline-offset-4 hover:text-black hover:underline ${isActive(
            '/eventpage'
          )}`}
          prefetch={false}
        >
          Event
        </Link>
        <Link
          href="#"
          className="text-lg text-[#999999] underline-offset-4 hover:text-black hover:underline"
          prefetch={false}
        >
          Calender
        </Link>
        <Link
          href="#"
          className="text-lg text-[#999999] underline-offset-4 hover:text-black hover:underline"
          prefetch={false}
        >
          Discover
        </Link>
        <Link
          href="#"
          className="text-lg text-[#999999] underline-offset-4 hover:text-black hover:underline"
          prefetch={false}
        >
          Contact
        </Link>
      </div>
      <div className="flex flex-row place-content-center items-center">
        <a className="mr-6 cursor-pointer rounded-md border-[2px] border-[#999999] px-4 py-1 text-slate-500 hover:scale-105 hover:border-black hover:text-black">
          <p className="flex flex-row items-center">
            <BsQrCodeScan className="mr-2" />
            Check In
          </p>
        </a>
        <Link
          href="/profile"
          className="flex items-center gap-2"
          prefetch={false}
        >
          <CgProfile className="h-10 w-10 text-[#999999] hover:scale-105 hover:text-black" />
        </Link>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuSquareIcon size={24} />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid w-[200px] p-4">
            <Link
              href="#"
              className="text-lg font-medium underline-offset-4 hover:underline"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-lg font-medium underline-offset-4 hover:underline"
              prefetch={false}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-lg font-medium underline-offset-4 hover:underline"
              prefetch={false}
            >
              Services
            </Link>
            <Link
              href="#"
              className="text-lg font-medium underline-offset-4 hover:underline"
              prefetch={false}
            >
              Portfolio
            </Link>
            <Link
              href="#"
              className="text-lg font-medium underline-offset-4 hover:underline"
              prefetch={false}
            >
              Contact
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
