"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequiredIcon from "../assets/icons/RequiredIcon";

export default function EditInfomation() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-between p-14 ">
      <div className="flex flex-col justify-center items-center h-[440px] w-[645px] p-6 gap-3 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]">
        <div className="flex gap-6">
          <div className="h-[200px] w-[200px] bg-primary"></div>
          <div className="flex flex-col h-[346px] w-[373px] gap-4 items-center justify-center text-xs">
            <div className="w-full gap-1">
              <label htmlFor="title">
                Title <RequiredIcon />
              </label>
              <input id="title" type="text" className="h-7 w-full" />
            </div>
            <div className="flex h-8 w-full gap-1">
              <div className="w-[117px]">
                <h3 className="">Duration</h3>
                <div className=""></div>
              </div>
              <div className="w-[117px]">
                <h3 className="">Size</h3>
                <div className=""></div>
              </div>
              <div className="w-[117px]">
                <h3 className="">Type</h3>
                <div className=""></div>
              </div>
            </div>
            <div className="w-full gap-1">
              <label htmlFor="slug">
                Slug
                <RequiredIcon />
              </label>
              <input id="slug" type="text" className="h-7 w-full" />
            </div>
            <div className="flex gap-4">
              <div className="gap-1">
                <label htmlFor="genre">Genre</label>
                <input
                  id="genre"
                  type="text"
                  className="w-[178.5px] h-7 rounded border"
                />
              </div>
              <div className="gap-1">
                <label htmlFor="artist">Artist</label>
                <input
                  placeholder="Enter the artist’s name"
                  id="artist"
                  type="text"
                  className="w-[178.5px] h-7 rounded border"
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="desc">Description</label>
              <textarea
                placeholder="Describe your track"
                name=""
                id="desc"
                cols="30"
                rows="10"
                className="h-20"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <p className="text-black text-xs">
            <RequiredIcon />
            Required fields
          </p>
          <div className="flex gap-4">
            <Link
              href={"/"}
              className="flex items-center px-2 py-1-md border rounded-md  hover:bg-slate-300"
            >
              Cancel
            </Link>
            <Link
              href={"/processing"}
              className="px-2 py-1 bg-primary text-white rounded-md hover:bg-orange-700"
            >
              Save
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
