"use client";
import Image from "next/image";
import React, { useContext } from "react";
import CopyIcon from "../assets/icons/CopyIcon";
import FileContext from "@/utils";

const Processing = ({ setShowUpload }) => {
  const { titleFile } = useContext(FileContext);
  const { artistFile } = useContext(FileContext);
  const { durationFile } = useContext(FileContext);
  const { genreFile } = useContext(FileContext);
  const { uploadedImageFile } = useContext(FileContext);

  const handleAction = () => {
    setShowUpload(true);
  };

  return (
    <div className="flex flex-col items-center p-14 gap-6 ">
      <div className="flex justify-start items-center h-[162px] w-[645px] p-10 gap-10 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]">
        <Image
          src={uploadedImageFile ? `${uploadedImageFile}` : "/Music-Club.jpeg"}
          width={130}
          height={130}
          className="rounded-md"
          alt=""
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#0F0F0F] font-semibold text-base">
            Congratulation, you’ve uploaded successfully !
          </h2>
          <div className="flex text-sm gap-1">
            <p>{titleFile}</p> <span> - </span> <p>{artistFile}</p>
          </div>
          <div className="flex gap-4 text-xs text-[#979797]">
            <p>{durationFile}</p> <p>{genreFile}</p>
          </div>
          <div className="flex flex-col gap-[2px]">
            <label className="text-[#979797] text-xs" htmlFor="link">
              Link
            </label>
            <div className="relative">
              <input
                name="link"
                type="text"
                className="bg-slate-100 w-full text-blue-600 p-2 text-sm h-7"
              />
              <div className="flex justify-center items-center w-5 h-5 rounded-md absolute right-3 top-1/2 -translate-y-[10px] cursor-pointer hover:bg-primary/50">
                <span className="">
                  <CopyIcon />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[#979797]">
        <button
          className="text-blue-600 hover:text-blue-600/80"
          onClick={handleAction}
        >
          Go Home
        </button>{" "}
        or{" "}
        <button
          className="text-blue-600 hover:text-blue-600/80"
          onClick={handleAction}
        >
          Upload another track
        </button>
      </div>
    </div>
  );
};
export default Processing;
