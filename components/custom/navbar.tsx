import Image from "next/image";
import Link from "next/link";

import { auth } from "@/app/(auth)/auth";

import { History } from "./history";
import { SlashIcon } from "./icons";
import { UserMenu } from "./user-menu";
import { Button } from "../ui/button";

export const Navbar = async () => {
  let session = await auth();

  return (
    <>
      <div className="bg-black fixed top-0 left-0 w-full py-2 z-30 border-b border-white/10 shadow-sm shadow-cyan-400/20">
        <div className="max-w-6xl mx-auto px-4 justify-between flex flex-row items-center">
          <div className="flex flex-row gap-3 items-center">
            <History user={session?.user} />
            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/images/gemini-logo.png"
                height={20}
                width={20}
                alt="gemini logo"
              />
              <div className="text-zinc-500">
                <SlashIcon size={16} />
              </div>
              <div className="text-lg font-bold">
                <span className="text-cyan-400">MYT</span>
                <span className="text-white">X</span>
              </div>
            </div>
          </div>

          {session ? (
            <UserMenu session={session} />
          ) : (
            <Link href="/login" 
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 hover:bg-cyan-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
