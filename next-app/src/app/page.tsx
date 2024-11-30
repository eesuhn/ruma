import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Hero Section */}
      <section className="container flex w-[86%] flex-col-reverse items-center gap-8 px-24 py-12 md:flex-row md:py-24">
        <div className="flex flex-col items-center space-y-6 text-center md:w-1/2 md:items-start md:text-left">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Collect Memories as NFTs
          </h1>
          <p className="pl-2 text-xl text-muted-foreground">
            Join events, connect with like-minded people, and collect exclusive
            NFTs that prove you were there.
          </p>
          <div className="flex gap-4 pl-2">
            <Link href="/discover">
              <Button size="lg" className="h-12 px-8">
                Discover Events
              </Button>
            </Link>
            <a href="/create-event">
              <Button variant="outline" size="lg" className="h-12 px-8">
                Host Event
              </Button>
            </a>
          </div>
        </div>
        <div className="items-center md:w-1/2">
          <Image
            src="/sample/landing-hero.jpg"
            alt="Event Platform Interface"
            width={500}
            height={500}
            className="rounded-3xl shadow-xl"
            priority
          />
        </div>
      </section>
    </div>
  );
}
