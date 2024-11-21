/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CowzfwdSDEY
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CgProfile } from 'react-icons/cg';
import { BsQrCodeScan } from 'react-icons/bs';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path ? 'underline text-black' : '';
  return (
    <div className="flex items-center justify-between px-6 py-4 font-[family-name:var(--font-geist-sans)]">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="text-[28px]  font-semibold">Ruma</span>
      </Link>
      <div className="hidden lg:flex gap-12">
        <Link
          href="/"
          className="text-lg text-[#999999]  hover:underline hover:text-black underline-offset-4"
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href="/events"
          className={`text-lg text-[#999999]  hover:underline hover:text-black underline-offset-4 ${isActive(
            '/eventpage'
          )}`}
          prefetch={false}
        >
          Event
        </Link>
        <Link
          href="#"
          className="text-lg text-[#999999]  hover:underline hover:text-black underline-offset-4"
          prefetch={false}
        >
          Calender
        </Link>
        <Link
          href="#"
          className="text-lg text-[#999999]  hover:underline hover:text-black underline-offset-4"
          prefetch={false}
        >
          Discover
        </Link>
        <Link
          href="#"
          className="text-lg text-[#999999]  hover:underline hover:text-black underline-offset-4"
          prefetch={false}
        >
          Contact
        </Link>
      </div>
      <div className="flex flex-row place-content-center items-center">
        <a className="mr-6 py-1 px-4 border-[2px] border-[#999999] text-slate-500 cursor-pointer hover:scale-105 hover:text-black hover:border-black rounded-md">
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
          <CgProfile className="h-10 w-10 text-[#999999] hover:text-black hover:scale-105 " />
        </Link>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid w-[200px] p-4">
            <Link
              href="#"
              className="text-lg font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-lg font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-lg font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Services
            </Link>
            <Link
              href="#"
              className="text-lg font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Portfolio
            </Link>
            <Link
              href="#"
              className="text-lg font-medium hover:underline underline-offset-4"
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

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
