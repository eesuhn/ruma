import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-muted px-24 py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <Image
              src="/ruma-logo.png"
              alt="Ruma Logo"
              width={40}
              height={40}
            />
            <span className="pl-4 text-sm text-muted-foreground">
              © 2024. All rights reserved.
            </span>
          </div>
          <nav className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/events" className="underline hover:text-foreground">
              Events
            </Link>
            <Link href="/discover" className="underline hover:text-foreground">
              Discover
            </Link>
            <Link href="/profile" className="underline hover:text-foreground">
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
