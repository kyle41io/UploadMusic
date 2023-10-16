"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-between p-14 ">
      <div className="flex flex-col justify-center items-center h-[335px] w-[645px] p-6 gap-3 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]">
        <h2 className="text-[#0F0F0F] h-[67px] text-2xl font-medium">
          Drag & Drop your track here
        </h2>
        <button className="w-[271px] h-[34px] text-white text-sm bg-primary py-2 text-center rounded-md hover:opacity-90">
          or choose file to upload
        </button>
        <div className="text-[#979797] text-xs text-center">
          <p>Only accept types: mp3, wav</p>
          <p>Max size: 100mb</p>
        </div>
        <Link href="/edit">Edit page</Link>
      </div>
    </main>
  );
}
