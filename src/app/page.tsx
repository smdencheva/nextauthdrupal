import Image from "next/image";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import {cookies} from "next/headers";

export default async function Home() {
    const cookiez = await cookies();
    const response = await fetch(`${process.env.AUTH0_BASE_URL}/api/auth/me`, {
        headers: { Cookie: cookiez.toString() },
    });
    const user: UserProfile = await response.json();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <p> Hello, {String(user.nickname ?? '')}!</p>
          <Image
          className="dark:invert"
          src={String(user.picture ?? '/next.svg')}
          alt={String(user.nickname ?? '')}
          width={100}
          height={100}
          priority
        />
      </main>
    </div>
  );
}
