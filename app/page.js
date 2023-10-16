"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);

  function getAudioType(file) {
    if (file.type.match("audio.*")) return true;
  }

  const handleFileChange = (file) => {
    if (!getAudioType(file)) {
      return alert(
        "Unsupported file type. Only mp3 and wav files are allowed."
      );
    }
    router.push("/edit");
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFileChange(event.dataTransfer.files[0]);
  };

  return (
    <main
      className={`flex flex-col items-center justify-between p-14 ${
        dragging ? "border-[#0F0F0F] border-dashed" : "border-[#DCDCDC]"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col justify-center items-center h-[335px] w-[645px] p-6 gap-3 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]">
        <input
          id="file"
          type="file"
          className="hidden"
          accept=".mp3,.wav"
          onChange={(event) => handleFileChange(event.target.files[0])}
          maxFileSize={100 * 1024 * 1024}
        />
        <h2 className="text-[#0F0F0F] h-[67px] text-2xl font-medium">
          Drag & Drop your track here
        </h2>
        <label
          htmlFor="file"
          className="w-[271px] h-[34px] text-white text-sm bg-primary py-2 text-center cursor-pointer rounded-md hover:opacity-90"
          onDragOver={(event) => event.preventDefault()}
        >
          or choose file to upload
        </label>
        <div className="text-[#979797] text-xs text-center">
          <p>Only accept types: mp3, wav</p>
          <p>Max size: 100mb</p>
        </div>
        <Link href="/edit">Edit page</Link>
      </div>
    </main>
  );
}
