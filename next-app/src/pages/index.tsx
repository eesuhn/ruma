import Image from 'next/image';
export default function Home() {
  return (
    <div className="flex flex-1 place-content-center items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="mb-10 flex flex-row items-center">
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
            <Blockchainicon />
          </a>
        </div>
        <Image
          className="rounded-md shadow-lg dark:invert"
          src={'/landingimg.jpg'}
          alt="Landing Image"
          width={360}
          height={38}
          priority
        />
      </main>
    </div>
  );
}

function Blockchainicon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34px"
      height="34px"
      viewBox="0 0 24 24"
    >
      <path
        fill="white"
        d="M12 8L9 9.75v3.5L12 15l3-1.75v-3.5Zm1.517 2.04l-1.53.892l-1.517-.885L12 9.155Zm-3.527.882l1.484.866v1.75l-1.484-.865Zm2.474 2.653v-1.767l1.546-.902v1.767ZM3 0L0 1.75v3.5L3 7l3-1.75v-3.5Zm1.517 2.04l-1.53.892l-1.517-.885L3 1.155ZM.99 2.921l1.484.866v1.75L.99 4.674Zm2.474 2.653V3.808l1.546-.902v1.767ZM3 17l-3 1.75v3.5L3 24l3-1.75v-3.5Zm1.517 2.04l-1.53.892l-1.517-.885L3 18.155Zm-3.527.882l1.484.866v1.75L.99 21.674Zm2.474 2.653v-1.767l1.546-.902v1.767ZM21 0l-3 1.75v3.5L21 7l3-1.75v-3.5Zm1.517 2.04l-1.53.892l-1.517-.885L21 1.155Zm-3.527.882l1.484.866v1.75l-1.484-.865Zm2.474 2.653V3.808l1.546-.902v1.767ZM21 17l-3 1.75v3.5L21 24l3-1.75v-3.5Zm1.517 2.04l-1.53.892l-1.517-.885l1.53-.892Zm-3.527.882l1.484.866v1.75l-1.484-.865Zm2.474 2.653v-1.767l1.546-.902v1.767ZM9 3h6v1H9zm0 17h6v1H9zM3.5 9v6h-1V9zm3.793-.172L5.172 6.707L5.879 6L8 8.12zM16 8.293l2.121-2.121l.707.707L16.707 9zm-7.872 6.586L6.007 17l-.707-.707l2.121-2.121zm8.751-.75L19 16.25l-.707.707l-2.121-2.121zM21.5 9v6h-1V9z"
      />
    </svg>
  );
}
