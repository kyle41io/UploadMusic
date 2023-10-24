"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import FileContext from "@/app/utils";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import storage from "@/app/utils/firebaseConfig";
import LoadingIcon from "../assets/icons/LoadingIcon";
import CameraIcon from "../assets/icons/CameraIcon";
import Input from "../components/Input";
import "./EditInfo.css";
import Dropdown from "../components/Dropdown";

const EditInfo = ({
  setShowUpload,
  setShowProcessing,
  setShowEdit,
  setShowToast,
  setError,
}) => {
  const { uploadedFile } = useContext(FileContext);
  const { setInfoFile } = useContext(FileContext);
  const { setUploadedImageFile } = useContext(FileContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [fileDuration, setFileDuration] = useState(null);
  const [errorImage, setErrorImage] = useState(false);
  const [percentAudio, setPercentAudio] = useState(0);
  const [percentImage, setPercentImage] = useState(0);

  const fileName = uploadedFile?.name?.split(".").slice(0, -1).join(".");
  const fileSize = uploadedFile?.size;
  const fileType = uploadedFile?.name?.split(".").pop();
  const [title, setTitle] = useState(fileName || "");
  const [slug, setSlug] = useState(slugify(fileName || ""));
  const [genre, setGenre] = useState("None");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");

  const audioRef = useRef();

  useEffect(() => {
    if (uploadedFile) {
      audioRef.current.src = URL.createObjectURL(uploadedFile);
      const audioElement = new Audio();
      audioElement.addEventListener("loadedmetadata", () => {
        const duration = audioElement.duration;

        setFileDuration(duration);
        setInfoFile((prevInfoFile) => ({
          ...prevInfoFile,
          duration: formatTime(duration),
        }));
      });
      audioElement.src = URL.createObjectURL(uploadedFile);
    }
  }, [uploadedFile, setInfoFile]);

  useEffect(() => {
    setInfoFile((prevInfoFile) => ({
      ...prevInfoFile,
      title: title,
      slug: slug,
    }));
  }, [title, slug, setInfoFile]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return time ? `${formattedMinutes}:${formattedSeconds}` : "--:--";
  };

  const formatSize = (size) => {
    if (!size) return "--";
    const fileSizeInBytes = size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes.toFixed(2) + " MB";
  };

  function slugify(str) {
    const slug = String(str)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    return `${slug}`;
  }

  const handleCancle = () => {
    setShowUpload(true);
  };

  const handleImageUpload = (file) => {
    const fileSizeInBytes = file.size;
    const maxFileSize = 5 * 1024 * 1024;

    if (fileSizeInBytes > maxFileSize) {
      setErrorImage(true);
      return;
    } else {
      setErrorImage(false);
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(file);
      setUploadedImageFile(imageUrl);
      setUploadedImageURL(imageUrl);
    }
  };

  const handleUpload = async () => {
    const timestamp = Date.now();
    let audioUploadComplete = false;
    let imageUploadComplete = false;

    if (!title || !slug || !uploadedFile) {
      setShowToast(true);
      setError(true);
      return;
    } else {
      const audioFileRef = ref(
        storage,
        `/files/${slug}/${title}-${timestamp}.${fileType}`
      );
      setInfoFile((prevInfoFile) => ({
        ...prevInfoFile,
        ref: audioFileRef,
      }));
      const uploadTask = uploadBytesResumable(audioFileRef, uploadedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentAudio(percent);
          if (percent === 100) {
            audioUploadComplete = true;
            checkUploadComplete();
          }
        },
        (error) => {
          console.log(error);
          setShowToast(true);
          setError(true);
        },
        async () => {}
      );
    }

    if (uploadedImage) {
      const imageFileRef = ref(storage, `/files/${slug}/${uploadedImage.name}`);
      const imageUploadTask = uploadBytesResumable(imageFileRef, uploadedImage);

      imageUploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentImage(percent);
          if (percent === 100) {
            imageUploadComplete = true;
            checkUploadComplete();
          }
        },
        (error) => {
          console.log(error);
          setShowToast(true);
          setError(true);
        },
        async () => {}
      );
    }
    const checkUploadComplete = () => {
      if (audioUploadComplete && (imageUploadComplete || !uploadedImage)) {
        setShowEdit(false);
        setShowProcessing(true);
        setShowToast(true);
        setError(false);
      }
    };
  };

  const handleChangeTitle = (title) => {
    setTitle(title);
  };
  const handleChangeArtist = (artist) => {
    setArtist(artist);
    setInfoFile((prevInfoFile) => ({
      ...prevInfoFile,
      artist: artist,
    }));
  };

  const handleChangeSlug = (slug) => {
    setSlug(slug);
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-[440px] w-[645px] p-6 gap-3 rounded-md border border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]`}
    >
      <div className="flex gap-6">
        <div className="">
          <div
            className={`h-[200px] w-[200px] flex flex-col justify-end items-center rounded-lg bg-center bg-cover bg-no-repeat border-2 `}
            style={{
              backgroundImage: uploadedImageURL
                ? `url(${uploadedImageURL})`
                : "linear-gradient(135deg, #9A8080 0%, #82A8C2 100%)",
              borderColor: errorImage ? "red" : "",
            }}
          >
            <input
              id="image"
              type="file"
              accept=".jpg,.png"
              className="hidden"
              onChange={(event) => handleImageUpload(event.target.files[0])}
              maxfilesize={5 * 1024 * 1024}
            />
            <label
              className="flex gap-1 justify-center items-center w-28 h-6 text-xs bg-white p-1 rounded-md mb-4 hover:opacity-80 cursor-pointer"
              htmlFor="image"
            >
              <CameraIcon />
              Upload Image
            </label>
          </div>
          {errorImage ? (
            <p className="text-red-400 text-xs">
              Invalid image. Type must be PNG or JPG and max size is 5MB
            </p>
          ) : (
            ""
          )}
        </div>

        <audio ref={audioRef} className="audio-element"></audio>
        <div className="flex flex-col h-[346px] w-[373px] gap-3 items-center justify-center text-xs">
          <Input
            value={title}
            onChange={(e) => handleChangeTitle(e)}
            required
            label={"Title"}
          />
          <div className="flex h-8 w-full gap-1">
            <div className="w-[117px] text-xs gap-1">
              <h3 className="">Duration</h3>
              <div className="text-[#979797] ">{formatTime(fileDuration)}</div>
            </div>
            <div className="w-[117px] text-xs gap-1">
              <h3 className="">Size</h3>
              <div className="text-[#979797]">{formatSize(fileSize)}</div>
            </div>
            <div className="w-[117px] text-xs gap-1">
              <h3 className="">Type</h3>
              <div className="text-[#979797]">{fileType}</div>
            </div>
          </div>
          <Input
            value={slug}
            onChange={(e) => handleChangeSlug(e)}
            required
            label={"Slug"}
          />
          <div className="w-full flex gap-3">
            <div style={{ width: "calc(50% - 6px)" }}>
              <Dropdown
                genre={genre}
                setGenre={setGenre}
                setInfoFile={setInfoFile}
              />
            </div>

            <div style={{ width: "calc(50% - 6px)" }}>
              <Input
                value={artist}
                onChange={(e) => handleChangeArtist(e)}
                label={"Artist"}
              />
            </div>
          </div>
          <Input
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e)}
            label={"Description"}
          />
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <p className="text-black text-xs">
          <span className="text-red-500 font-bold text-base ml-1">*</span>{" "}
          Required fields
        </p>
        <div className="flex gap-4">
          <button
            className="flex items-center px-2 py-1-md border rounded-md  hover:bg-slate-300"
            onClick={handleCancle}
          >
            Cancel
          </button>
          <button
            className="flex items-center justify-center px-2 py-1 w-[55px] h-[25px] bg-primary text-white rounded-md hover:bg-orange-700"
            onClick={handleUpload}
          >
            {(percentAudio !== 100 && percentAudio !== 0) ||
            (percentImage !== 100 && percentImage !== 0) ? (
              <div className="circle">
                <LoadingIcon />
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center gap-28">
        {percentImage === 100 && <p className="text-sm text-primary">Image</p>}
        {percentImage !== 100 && percentImage !== 0 && (
          <div className="flex flex-col justify-center items-center text-slate-200 text-sm font-semibold">
            <div className="">Image</div>
            <progress
              className="w-48 h-1 rounded-md"
              value={percentImage}
              max="100"
            ></progress>
          </div>
        )}
        {percentAudio !== 100 && percentAudio !== 0 && (
          <div className="flex flex-col justify-center items-center text-slate-200 text-sm font-semibold">
            <div className="">Audio</div>
            <progress
              className="w-48 h-1 rounded-md"
              value={percentAudio}
              max="100"
            ></progress>
          </div>
        )}
        {percentAudio === 100 && <p className="text-sm text-primary">Audio</p>}
      </div>
    </div>
  );
};
export default EditInfo;
