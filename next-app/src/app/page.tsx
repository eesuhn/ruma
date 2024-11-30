import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-1 place-content-center items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className=" flex flex-row items-center ">
        <div className="mr-8 flex flex-col">
          <h1 className="text-[42px] font-bold">Ruma</h1>
          <p className="font-[family-name:var(--font-geist-mono)] text-[24px]">
            Start joining events on the chain and get some cool NFTs
          </p>
          <a
            className="mt-4 flex h-10 w-[25%] items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-[24px] text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base"
            href="/events"
          >
            <p className="text-[24px]">Events</p>
          </a>
        </div>
        <Image
          className="rounded-md shadow-lg dark:invert"
          src={'/sample/landing-hero.jpg'}
          alt="Landing Image"
          width={360}
          height={38}
          priority
        />
        
      </main>
      
    </div>
  );
}
