"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import FileContext from "@/app/utils";
import storage from "@/firebaseConfig.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import * as id3 from "node-id3";
import LoadingIcon from "../assets/icons/LoadingIcon";
import CameraIcon from "../assets/icons/CameraIcon";
import RequiredIcon from "../assets/icons/RequiredIcon";

const EditInfo = ({
  setShowUpload,
  setShowProcessing,
  setShowEdit,
  setShowSuccessToast,
  setShowErrorToast,
}) => {
  const { uploadedFile } = useContext(FileContext);
  const { setTitleFile } = useContext(FileContext);
  const { setArtistFile } = useContext(FileContext);
  const { setDurationFile } = useContext(FileContext);
  const { setGenreFile } = useContext(FileContext);
  const { setSlugFile } = useContext(FileContext);
  const { setUploadedImageFile } = useContext(FileContext);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [fileDuration, setFileDuration] = useState(null);
  const [errorImage, setErrorImage] = useState(false);

  const audioRef = useRef();

  useEffect(() => {
    if (uploadedFile) {
      audioRef.current.src = URL.createObjectURL(uploadedFile);
      const audioElement = new Audio();
      audioElement.addEventListener("loadedmetadata", () => {
        const duration = audioElement.duration;

        setFileDuration(duration);
        setDurationFile(formatTime(duration));
      });
      audioElement.src = URL.createObjectURL(uploadedFile);
    }
    console.log(URL.createObjectURL(uploadedFile));
  }, [uploadedFile, setDurationFile]);

  const fileName = uploadedFile?.name?.split(".").slice(0, -1).join(".");
  const fileSize = uploadedFile?.size;
  const fileType = uploadedFile?.name?.split(".").pop();

  const [title, setTitle] = useState(fileName || "");
  const [slug, setSlug] = useState(slugify(fileName || ""));
  const [genre, setGenre] = useState("none");
  const [artist, setArtist] = useState("N/A");
  const [description, setDescription] = useState("");
  const [percent, setPercent] = useState(0);
  setTitleFile(title);
  setSlugFile(slug);
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

      const timeout = setTimeout(() => {
        setErrorImage(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(file);
    setUploadedImageFile(imageUrl);
    setUploadedImageURL(imageUrl);
  };

  // const handleUpload = async () => {
  //   if (!title || !slug) {
  //     setShowErrorToast(true);
  //     return;
  //   }

  //   if (!uploadedFile) {
  //     alert("Please upload an audio file first!");
  //     return;
  //   }

  //   const storage = getStorage();
  //   const firestore = getFirestore();

  //   const newFileName = `${title}.${fileType}`; // Tên file mới bạn muốn đặt
  //   // Tạo Blob mới với tên file mới
  //   const modifiedMp3File = new Blob([uploadedFile], {
  //     type: uploadedFile.type,
  //   });
  //   // modifiedMp3File.lastModifiedDate = new Date() - 86400000;
  //   modifiedMp3File.name = newFileName;
  //   // Tạo tham chiếu đến file trên Firebase Storage với tên file mới
  //   const mp3FileRef = ref(storage, `/files/${slug}/${newFileName}`);
  //   const uploadTask = uploadBytesResumable(mp3FileRef, modifiedMp3File);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const percent = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       setPercent(percent);
  //       if (percent === 100) {
  //         setShowEdit(false);
  //         setShowProcessing(true);
  //         setShowSuccessToast(true);
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       // Handle upload error
  //     },
  //     async () => {
  //       // Audio file uploaded successfully, get download URL
  //       const audioDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);

  //       if (uploadedImage) {
  //         const imageFileRef = ref(
  //           storage,
  //           `/files/${slug}/${uploadedImage.name}`
  //         );
  //         const imageUploadTask = uploadBytesResumable(
  //           imageFileRef,
  //           uploadedImage
  //         );

  //         imageUploadTask.on(
  //           "state_changed",
  //           (snapshot) => {},
  //           (error) => {
  //             console.log(error);
  //             // Handle upload error
  //           },
  //           async () => {
  //             const imageDownloadURL = await getDownloadURL(
  //               imageUploadTask.snapshot.ref
  //             );
  //           }
  //         );
  //       }
  //     }
  //   );
  // };

  // const handleUpload = async () => {
  //   if (!title || !slug) {
  //     setShowErrorToast(true);
  //     return;
  //   }

  //   if (!uploadedFile) {
  //     alert("Please upload an audio file first!");
  //     return;
  //   }

  //   const storage = getStorage();
  //   const firestore = getFirestore();

  //   const newFileName = `${title}.${fileType}`; // Tên file mới bạn muốn đặt
  //   // Tạo Blob mới với tên file mới
  //   const modifiedMp3File = new Blob([uploadedFile], {
  //     type: uploadedFile.type,
  //   });
  //   // modifiedMp3File.lastModifiedDate = new Date() - 86400000;
  //   modifiedMp3File.name = newFileName;

  //   // Change ID3 tags
  //   fetch(modifiedMp3File)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       // Tạo một FileReader để đọc dữ liệu từ Blob
  //       const reader = new FileReader();
  //       reader.onloadend = function () {
  //         // Chuyển đổi ArrayBuffer thành Uint8Array để chỉnh sửa dữ liệu
  //         const uint8Array = new Uint8Array(reader.result);

  //         // Tìm vị trí (offset) của chuỗi artist trong tệp MP3
  //         const artistString = "TPE1"; // Chuỗi này là mã tag cho artist trong ID3 metadata
  //         const artistIndex = Array.prototype.indexOf.call(
  //           uint8Array,
  //           artistString.charCodeAt(0)
  //         );

  //         // Kiểm tra xem đã tìm thấy tag artist chưa
  //         if (artistIndex !== -1) {
  //           // Đổi tên artist thành "New Artist Name"
  //           const newArtistName = artist;
  //           const artistNameArray = new TextEncoder().encode(newArtistName);

  //           // Ghi đè dữ liệu trong tệp MP3 bằng tên mới của nghệ sĩ
  //           for (let i = 0; i < artistNameArray.length; i++) {
  //             uint8Array[artistIndex + 4 + i] = artistNameArray[i];
  //           }

  //           // Ghi dữ liệu đã được chỉnh sửa vào tệp MP3
  //           const modifiedBlob = new Blob([uint8Array], { type: "audio/mpeg" });

  //           // Tạo tham chiếu đến file trên Firebase Storage với tên file mới
  //           const mp3FileRef = ref(storage, `/files/${slug}/${newFileName}`);
  //           const uploadTask = uploadBytesResumable(mp3FileRef, modifiedBlob);

  //           uploadTask.on(
  //             "state_changed",
  //             (snapshot) => {
  //               const percent = Math.round(
  //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //               );
  //               setPercent(percent);
  //               if (percent === 100) {
  //                 setShowEdit(false);
  //                 setShowProcessing(true);
  //                 setShowSuccessToast(true);
  //               }
  //             },
  //             (error) => {
  //               console.log(error);
  //               // Handle upload error
  //             },
  //             async () => {
  //               // Audio file uploaded successfully, get download URL
  //               const audioDownloadURL = await getDownloadURL(
  //                 uploadTask.snapshot.ref
  //               );

  //               if (uploadedImage) {
  //                 const imageFileRef = ref(
  //                   storage,
  //                   `/files/${slug}/${uploadedImage.name}`
  //                 );
  //                 const imageUploadTask = uploadBytesResumable(
  //                   imageFileRef,
  //                   uploadedImage
  //                 );

  //                 imageUploadTask.on(
  //                   "state_changed",
  //                   (snapshot) => {},
  //                   (error) => {
  //                     console.log(error);
  //                     // Handle upload error
  //                   },
  //                   async () => {
  //                     const imageDownloadURL = await getDownloadURL(
  //                       imageUploadTask.snapshot.ref
  //                     );
  //                   }
  //                 );
  //               }
  //             }
  //           );

  //           console.log(`Tên nghệ sĩ đã được thay đổi thành ${artist}.`);
  //         } else {
  //           console.error("Không tìm thấy tag artist trong tệp MP3.");
  //         }
  //       };

  //       // Đọc dữ liệu từ Blob
  //       reader.readAsArrayBuffer(blob);
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi:", error);
  //     });
  // };

  const handleUpload = async () => {
    if (!title || !slug) {
      setShowErrorToast(true);
      return;
    }

    if (!uploadedFile) {
      alert("Please upload an audio file first!");
      return;
    }

    const storage = getStorage();
    const firestore = getFirestore();

    const newFileName = `${title}.${fileType}`; // Tên file mới bạn muốn đặt
    const modifiedMp3File = new Blob([uploadedFile], {
      type: uploadedFile.type,
    });
    modifiedMp3File.name = newFileName;

    // Modify ID3 tags
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const arrayBuffer = this.result;
      const tags = {
        title: title,
        genre: genre,
        artist: artist,
      };
      const updatedArrayBuffer = id3.update(tags, arrayBuffer);
      const updatedFile = new Blob([updatedArrayBuffer], {
        type: uploadedFile.type,
      });
      updatedFile.name = newFileName;

      // Upload the modified file
      const mp3FileRef = ref(storage, `/files/${slug}/${newFileName}`);
      const uploadTask = uploadBytesResumable(mp3FileRef, updatedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(percent);
          if (percent === 100) {
            setShowEdit(false);
            setShowProcessing(true);
            setShowSuccessToast(true);
          }
        },
        (error) => {
          console.log(error);
          // Handle upload error
        },
        async () => {
          // Audio file uploaded successfully, get download URL
          const audioDownloadURL = await getDownloadURL(
            uploadTask.snapshot.ref
          );

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
              },
              async () => {
                const imageDownloadURL = await getDownloadURL(
                  imageUploadTask.snapshot.ref
                );
              }
            );
          }
        }
      );
    };

    // Read the uploaded file as an ArrayBuffer
    fileReader.readAsArrayBuffer(modifiedMp3File);
  };

  const handleChangeTitle = (title) => {
    setTitle(title);
  };
  const handleChangeArtist = (artist) => {
    setArtist(artist);
    setArtistFile(artist);
  };
  const handleChangeGenre = (genre) => {
    setGenre(genre);
    setGenreFile(genre);
  };
  const handleChangeSlug = (slug) => {
    setSlug(slug);
  };

  return (
    <div className="flex flex-col justify-center items-center h-[440px] w-[645px] p-6 gap-3 rounded-md border-[#DCDCDC] shadow-[0px_0px_8px_0px_rgba(51,51,51,0.10)]">
      <div className="flex gap-6">
        <div className="">
          <div
            className={`h-[200px] w-[200px] bg-primary/60 flex flex-col justify-end items-center rounded-lg bg-cover ${
              errorImage ? "border-2 border-red-400" : ""
            }`}
            style={{
              backgroundImage: uploadedImageURL
                ? `url(${uploadedImageURL})`
                : "url(/Music-Club.jpeg)",
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
              maxlength="100"
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
              maxlength="100"
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
              maxlength="500"
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
            {percent === 0 ? (
              "Save"
            ) : (
              <div className="circle">
                <LoadingIcon />
              </div>
            )}
          </button>
        </div>
      </div>
      {percent !== 0 && (
        <p className="text-primary text-xl font-bold">{percent} %</p>
      )}
    </div>
  );
};
export default EditInfo;
