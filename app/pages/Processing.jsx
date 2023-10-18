"use client";
import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
import CopyIcon from "../assets/icons/CopyIcon";
import FileContext from "@/app/utils";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const Processing = ({ setShowUpload }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const { uploadedFile } = useContext(FileContext);
  const { titleFile } = useContext(FileContext);
  const { artistFile } = useContext(FileContext);
  const { durationFile } = useContext(FileContext);
  const { genreFile } = useContext(FileContext);
  const { slugFile } = useContext(FileContext);
  const { uploadedImageFile } = useContext(FileContext);
  const fileType = uploadedFile?.name?.split(".").pop();

  useEffect(() => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `/files/${slugFile}/${titleFile}.${fileType}`
    );

    uploadBytes(storageRef, uploadedFile)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setAudioURL(url);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [uploadedFile, slugFile, titleFile, fileType]);

  const handleCopyLink = () => {
    const linkInput = document.getElementById("link-input");
    linkInput.select();
    document.execCommand("copy");
    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  const handleAction = () => {
    window.location.reload();
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
        <div className="flex w-[410px] flex-col gap-2">
          <h2 className="text-[#0F0F0F] font-semibold text-base">
            Congratulation, you’ve uploaded successfully !
          </h2>
          <div className="flex text-sm gap-1">
            <p>{titleFile}</p> <span> - </span>{" "}
            <p>{artistFile ? artistFile : "N/A"}</p>
          </div>
          <div className="flex gap-4 text-xs text-[#979797]">
            <p>{durationFile}</p> <p>{genreFile}</p>
          </div>
          <div className=" w-full flex flex-col gap-[2px]">
            <label className="text-[#979797] text-xs" htmlFor="link">
              Link
            </label>
            <div className="relative">
              <input
                id="link-input"
                name="link"
                type="text"
                placeholder={audioURL ? "" : "loading..."}
                className="bg-slate-100/50 w-full text-blue-600 p-2 pr-10 text-xs h-7"
                value={audioURL}
                readOnly
              />
              <div
                className="flex justify-center items-center w-5 h-5 rounded-md absolute right-3 top-1/2 -translate-y-[10px] cursor-pointer hover:bg-primary/50"
                onClick={handleCopyLink}
              >
                <span className="">
                  <CopyIcon />
                </span>
              </div>
              {copySuccess && (
                <div className="bg-green-500/80 text-slate-500 text-xs absolute p-1 -bottom-8 left-0 ml-2 mb-1 rounded-md">
                  Copied to clipboard!
                </div>
              )}
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
