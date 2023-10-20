"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import FileContext from "@/app/utils";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import storage from "@/app/utils/firebaseConfig";
import LoadingIcon from "../assets/icons/LoadingIcon";
import CameraIcon from "../assets/icons/CameraIcon";
import RequiredIcon from "../assets/icons/RequiredIcon";

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
  const [genre, setGenre] = useState("none");
  const [artist, setArtist] = useState("N/A");
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
    const timestamp = Date.now();
    const slug = String(str)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    return `${slug}-${timestamp}`;
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
    let audioUploadComplete = false;
    let imageUploadComplete = false;
    if (!title || !slug || !uploadedFile) {
      setShowToast(true);
      setError(true);
      return;
    } else {
      const storage = getStorage();

      const newFileName = `${title}.${fileType}`;
      const modifiedAudioFile = new Blob([uploadedFile], {
        type: uploadedFile.type,
      });
      modifiedAudioFile.name = newFileName;
      const audioFileRef = ref(storage, `/files/${slug}/${newFileName}`);
      const uploadTask = uploadBytesResumable(audioFileRef, modifiedAudioFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentAudio(percent);
          if (percent === 100) {
            setShowEdit(false);
            setShowProcessing(true);
            setShowToast(true);
            setError(false);
          }
        },
        (error) => {
          console.log(error);
          setShowToast(true);
          setError(true);
        },
        async () => {
          audioUploadComplete = true;
        }
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

    if (audioUploadComplete && (imageUploadComplete || !uploadedImage)) {
      setShowEdit(false);
      setShowProcessing(true);
      setShowToast(true);
      setError(false);
    }
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
  const handleChangeGenre = (genre) => {
    setGenre(genre);
    setInfoFile((prevInfoFile) => ({
      ...prevInfoFile,
      genre: genre,
    }));
  };
  const handleChangeSlug = (slug) => {
    setSlug(slug);
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-[440px] w-[645px] p-6 gap-3 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)] ${
        (percentAudio !== 100 && percentAudio !== 0) ||
        (percentImage !== 100 && percentImage !== 0)
          ? "animate-pulse"
          : ""
      }`}
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
        <div className="flex flex-col h-[346px] w-[373px] gap-4 items-center justify-center text-xs">
          <div className="w-full gap-1">
            <label
              htmlFor="title"
              className={` ${title === "" ? "!text-red-500" : ""}`}
            >
              Title <RequiredIcon />
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => handleChangeTitle(event.target.value)}
              type="text"
              className={`h-7 w-full ${
                title === "" ? "!border-red-500 !outline-red-500" : ""
              }`}
              maxLength="100"
            />
          </div>
          <div className="flex h-8 w-full gap-1">
            <div className="w-[117px] text-xs">
              <h3 className="">Duration</h3>
              <div className="text-[#979797] ">{formatTime(fileDuration)}</div>
            </div>
            <div className="w-[117px] text-xs">
              <h3 className="">Size</h3>
              <div className="text-[#979797]">{formatSize(fileSize)}</div>
            </div>
            <div className="w-[117px] text-xs">
              <h3 className="">Type</h3>
              <div className="text-[#979797]">{fileType}</div>
            </div>
          </div>
          <div className="w-full gap-1">
            <label
              htmlFor="slug"
              className={`${slug === "" ? "!text-red-500" : ""}`}
            >
              Slug <RequiredIcon />
            </label>
            <input
              id="slug"
              type="text"
              className={`h-7 w-full ${
                slug === "" ? "!border-red-500 !outline-red-500" : ""
              }`}
              value={slug}
              onChange={(event) => handleChangeSlug(event.target.value)}
              maxLength="100"
            />
          </div>
          <div className="flex gap-4">
            <div className="gap-1">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                className="w-[178.5px] h-7 rounded border"
                value={genre}
                onChange={(event) => handleChangeGenre(event.target.value)}
              >
                <option value="None">None</option>
                <option value="Ballad">Ballad</option>
                <option value="Rock">Rock</option>
                <option value="RnB">R&amp;B</option>
                <option value="Acoustic">Acoustic</option>
              </select>
            </div>
            <div className="gap-1">
              <label htmlFor="artist">Artist</label>
              <input
                placeholder="Enter the artist’s name"
                id="artist"
                type="text"
                className="w-[178.5px] h-7 rounded border"
                onChange={(event) => handleChangeArtist(event.target.value)}
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
              onChange={(event) => setDescription(event.target.value)}
              maxLength="500"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <p className="text-black text-xs">
          <RequiredIcon /> Required fields
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
        {percentImage !== 100 && percentImage !== 0 && (
          <div className="flex flex-col justify-center items-center text-primary text-sm font-semibold">
            <div className="">Image</div>
            <progress
              className="w-48 h-1 rounded-md"
              value={percentImage}
              max="100"
            ></progress>
          </div>
        )}

        {percentAudio !== 100 && percentAudio !== 0 && (
          <div className="flex flex-col justify-center items-center text-primary text-sm font-semibold">
            <div className="">audio</div>
            <progress
              className="w-48 h-1 rounded-md"
              value={percentAudio}
              max="100"
            ></progress>
          </div>
        )}
      </div>
    </div>
  );
};
export default EditInfo;
