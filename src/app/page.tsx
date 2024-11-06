// Root Home page
'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <Image
    //     aria-hidden
    //     src="/secret-oven.svg"
    //     alt="Globe icon"
    //     width={100}
    //     height={100}
    //   />
    // </div>
    null
  );
}
