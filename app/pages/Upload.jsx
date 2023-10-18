"use client";
import React, { useState, useContext } from "react";
import FileContext from "@/app/utils";

const Upload = ({ setShowEdit, setShowUpload }) => {
  const [dragging, setDragging] = useState(false);
  const { setUploadedFile } = useContext(FileContext);
  const [error, setError] = useState(false);

  function checkAudioType(file) {
    if (file.type.match("audio.*")) return true;
  }

  const handleFileChange = (file) => {
    const fileSizeInBytes = file.size;
    const maxFileSize = 100 * 1024 * 1024;
    if (!checkAudioType(file) || fileSizeInBytes > maxFileSize) {
      setError(true);
      const timeout = setTimeout(() => {
        setError(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    setUploadedFile(file);
    setShowUpload(false);
    setShowEdit(true);
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
    <div
      className={"flex flex-col items-center justify-between p-14 "}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`flex flex-col justify-center items-center h-[335px] w-[645px] p-6 gap-3 rounded-md ${
          dragging
            ? "border-primary/75 border-4 border-dashed"
            : "border-[#DCDCDC]"
        } shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)] ${
          error ? "border-2 border-red-400" : ""
        }`}
      >
        <input
          id="file"
          type="file"
          className="hidden"
          accept=".mp3,.wav"
          onChange={(event) => handleFileChange(event.target.files[0])}
          maxfilesize={100 * 1024 * 1024}
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
      </div>
      {error ? (
        <p className="text-red-400 text-xs">
          Your uploaded file is invalid. Type must be mp3 or wav and the max
          size is 100mb
        </p>
      ) : (
        ""
      )}
    </div>
  );
};
export default Upload;
