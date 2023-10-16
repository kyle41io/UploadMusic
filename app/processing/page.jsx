"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Processing() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center p-14 gap-6 ">
      <div className="flex justify-center items-center h-[162px] w-[645px] p-6 gap-6 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]">
        <Image src={"/next.svg"} width={120} height={120} alt="" />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#0F0F0F] font-medium text-base">
            Congratulation, you’ve uploaded successfully !
          </h2>
          <div className="flex text-sm gap-1">
            <p>Song name</p> <span> - </span> <p>Singer</p>
          </div>
          <div className="flex gap-4 text-xs text-[#979797]">
            <p>00:00</p> <p>genre</p>
          </div>
          <div className="flex flex-col gap-[2px]">
            <label className="text-[#979797] text-sm" htmlFor="link">
              Link
            </label>
            <input name="link" type="text" className="bg-slate-100 w-full" />
          </div>
        </div>
      </div>
      <div className="text-[#979797]">
        <Link href={"/"} className="text-blue-600">
          Go Home
        </Link>{" "}
        or{" "}
        <Link href={"/"} className="text-blue-600">
          Upload another track
        </Link>
      </div>
    </main>
  );
}
