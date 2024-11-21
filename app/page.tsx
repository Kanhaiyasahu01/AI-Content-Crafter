import Image from "next/image";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          <Link href={'/dashboard'}>dashboard</Link>
    </div>
  );
}
