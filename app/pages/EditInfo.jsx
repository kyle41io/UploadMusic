"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import FileContext from "@/app/utils";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
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
  const [errorImage, setErrorImage] = useState(null);
  const [percent, setPercent] = useState(0);

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
    return String(str)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleCancle = () => {
    setShowUpload(true);
  };

  const handleImageUpload = (file) => {
    const fileSizeInBytes = file.size;
    const maxFileSize = 5 * 1024 * 1024;

    if (fileSizeInBytes > maxFileSize) {
      setErrorImage(true);
    }
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(file);
    setUploadedImageFile(imageUrl);
    setUploadedImageURL(imageUrl);
  };

  const checkFileExists = async (fileRef) => {
    try {
      await getDownloadURL(fileRef);
      return true;
    } catch (error) {
      return false;
    }
  };

  // const generateUniqueFileName = async (fileRef, fileName) => {
  //   let suffix = 0;
  //   let newFileName = fileName;

  //   while (await checkFileExists(`${fileRef}/${newFileName}`)) {
  //     suffix++;
  //     const fileExtension = fileName.split(".").pop();
  //     const baseName = fileName.split(".").slice(0, -1).join(".");
  //     newFileName = `${baseName} (${suffix}).${fileExtension}`;
  //     fileRef = ref(storage, `files/${slug}/${newFileName}`);
  //   }

  //   return newFileName;
  // };

  const generateUniqueFileName = async (fileRef, fileName) => {
    let newFileName = fileName;
    let suffix = 0;

    while (true) {
      const exists = await checkFileExists(`${fileRef}/${newFileName}`);
      if (!exists) {
        break;
      }

      suffix++;
      const fileExtension = fileName.split(".").pop();
      const baseFileName = fileName.split(".").slice(0, -1).join(".");
      newFileName = `${baseFileName} (${suffix}).${fileExtension}`;
    }

    return newFileName;
  };

  const handleUpload = async () => {
    if (!title || !slug) {
      setShowToast(true);
      setError(true);
      return;
    }

    if (!uploadedFile) {
      alert("Please upload an audio file first!");
      return;
    }
    setPercent(1);
    const storage = getStorage();

    const newFileName = await generateUniqueFileName(
      ref(storage, `files/${slug}`),
      `${title}.${fileType}`
    );
    // const newFileName = `${title}.${fileType}`;
    // Tạo Blob mới với tên file mới
    const modifiedMp3File = new Blob([uploadedFile], {
      type: uploadedFile.type,
    });
    modifiedMp3File.name = newFileName;
    // Tạo tham chiếu đến file trên Firebase Storage
    const mp3FileRef = ref(storage, `/files/${slug}/${newFileName}`);
    const uploadTask = uploadBytesResumable(mp3FileRef, modifiedMp3File);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (percent === 100) {
          setPercent(100);
          setShowEdit(false);
          setShowProcessing(true);
          setShowToast(true);
          setError(false);
        }
      },
      (error) => {
        console.log(error);
        // Handle upload error
      },
      async () => {
        if (uploadedImage) {
          const imageFileRef = ref(
            storage,
            `/files/${slug}/${uploadedImage.name}`
          );
          const imageUploadTask = uploadBytesResumable(
            imageFileRef,
            uploadedImage
          );

          imageUploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.log(error);
              // Handle upload error
            }
          );
        }
      }
    );
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
    <div className="flex flex-col justify-center items-center h-[440px] w-[645px] p-6 gap-3 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]">
      <div
        className={`flex gap-6 ${
          percent !== 100 && percent !== 0 ? "animate-pulse" : ""
        }`}
      >
        <div className="">
          <div
            className={`h-[200px] w-[200px] flex flex-col justify-end items-center rounded-lg bg-center bg-cover bg-no-repeat ${
              errorImage ? "border-2 border-red-400" : ""
            } `}
            style={{
              backgroundImage: uploadedImageURL
                ? `url(${uploadedImageURL})`
                : "linear-gradient(135deg, #9A8080 0%, #82A8C2 100%)",
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
            {percent !== 0 ? (
              <div className="circle">
                <LoadingIcon />
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      {/* {percent !== 0 && (
        <p className="text-primary text-xl font-bold">{percent} %</p>
      )} */}
    </div>
  );
};
export default EditInfo;
