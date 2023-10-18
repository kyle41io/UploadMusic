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
import { getFirestore, collection, addDoc } from "firebase/firestore";
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(file);
    setUploadedImageFile(imageUrl);
    setUploadedImageURL(imageUrl);
  };

  // const fileInfo = {
  //   title: title,
  //   duration: formatTime(fileDuration),
  //   size: formatSize(fileSize),
  //   type: fileType,
  //   slug: slug,
  //   genre: genre,
  //   artist: artist,
  //   description: description,
  // };

  // const audioInfoJSON = JSON.stringify(fileInfo);
  // const audioInfoFile = new File([audioInfoJSON], "audio_info.json", {
  //   type: "application/json",
  // });

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
  //   const fileRef = ref(storage, `/files/${slug}/${title}`);

  //   // Upload audio file to Firebase Storage
  //   const uploadTask = uploadBytesResumable(fileRef, uploadedFile);

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
  //           (snapshot) => {
  //             // Handle image upload progress if needed
  //           },
  //           (error) => {
  //             console.log(error);
  //             // Handle upload error
  //           },
  //           async () => {
  //             // Image file uploaded successfully, get download URL
  //             const imageDownloadURL = await getDownloadURL(
  //               imageUploadTask.snapshot.ref
  //             );

  //             const audioInfoJSON = JSON.stringify(fileInfo);
  //             const audioInfoFile = new File(
  //               [audioInfoJSON],
  //               "audio_info.json",
  //               {
  //                 type: "application/json",
  //               }
  //             );
  //             // Upload audio info file to Firebase Storage
  //             const audioInfoFileRef = ref(
  //               storage,
  //               `/files/${slug}/audio_info.json`
  //             );
  //             const audioInfoUploadTask = uploadBytesResumable(
  //               audioInfoFileRef,
  //               audioInfoFile
  //             );

  //             audioInfoUploadTask.on(
  //               "state_changed",
  //               (snapshot) => {
  //                 // Handle audio info file upload progress if needed
  //               },
  //               (error) => {
  //                 console.log(error);
  //                 // Handle upload error
  //               },
  //               async () => {
  //                 // Audio info file uploaded successfully, get download URL
  //                 const audioInfoDownloadURL = await getDownloadURL(
  //                   audioInfoUploadTask.snapshot.ref
  //                 );

  //                 try {
  //                   const docRef = await addDoc(
  //                     collection(firestore, "files"),
  //                     fileInfo
  //                   );
  //                   console.log("Document written with ID: ", docRef.id);
  //                 } catch (error) {
  //                   console.error("Error adding document: ", error);
  //                   setShowErrorToast(true);
  //                   // Handle Firestore error
  //                 }
  //               }
  //             );
  //           }
  //         );
  //       } else {
  //         const audioInfoJSON = JSON.stringify(fileInfo);
  //         const audioInfoFile = new File([audioInfoJSON], "audio_info.json", {
  //           type: "application/json",
  //         });

  //         // Upload audio info file to Firebase Storage
  //         const audioInfoFileRef = ref(
  //           storage,
  //           `/files/${slug}/audio_info.json`
  //         );
  //         const audioInfoUploadTask = uploadBytesResumable(
  //           audioInfoFileRef,
  //           audioInfoFile
  //         );

  //         audioInfoUploadTask.on(
  //           "state_changed",
  //           (snapshot) => {
  //             // Handle audio info file upload progress if needed
  //           },
  //           (error) => {
  //             console.log(error);
  //             // Handle upload error
  //           },
  //           async () => {
  //             // Audio info file uploaded successfully, get download URL
  //             const audioInfoDownloadURL = await getDownloadURL(
  //               audioInfoUploadTask.snapshot.ref
  //             );

  //             try {
  //               const docRef = await addDoc(
  //                 collection(firestore, "files"),
  //                 fileInfo
  //               );
  //               console.log("Document written with ID: ", docRef.id);
  //             } catch (error) {
  //               console.error("Error adding document: ", error);
  //               setShowErrorToast(true);
  //               // Handle Firestore error
  //             }
  //           }
  //         );
  //       }
  //     }
  //   );
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
    const fileRef = ref(storage, `/files/${slug}/${title}`);

    // Upload audio file to Firebase Storage
    const uploadTask = uploadBytesResumable(fileRef, uploadedFile);

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
        const audioDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);

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
            (snapshot) => {
              // Handle image upload progress if needed
            },
            (error) => {
              console.log(error);
              // Handle upload error
            },
            async () => {
              // Image file uploaded successfully, get download URL
              const imageDownloadURL = await getDownloadURL(
                imageUploadTask.snapshot.ref
              );

              const audioInfo = {
                title: title,
                duration: formatTime(fileDuration),
                size: formatSize(fileSize),
                type: fileType,
                slug: slug,
                genre: genre,
                artist: artist,
                description: description,
                audioDownloadURL: audioDownloadURL,
                imageDownloadURL: imageDownloadURL,
              };

              try {
                const docRef = await addDoc(
                  collection(firestore, "files"),
                  audioInfo
                );
                console.log("Document written with ID: ", docRef.id);
              } catch (error) {
                console.error("Error adding document: ", error);
                setShowErrorToast(true);
                // Handle Firestore error
              }
            }
          );
        } else {
          const audioInfo = {
            title: title,
            duration: formatTime(fileDuration),
            size: formatSize(fileSize),
            type: fileType,
            slug: slug,
            genre: genre,
            artist: artist,
            description: description,
            audioDownloadURL: audioDownloadURL,
          };

          try {
            const docRef = await addDoc(
              collection(firestore, "files"),
              audioInfo
            );
            console.log("Document written with ID: ", docRef.id);
          } catch (error) {
            console.error("Error adding document: ", error);
            setShowErrorToast(true);
            // Handle Firestore error
          }
        }
      }
    );
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
        <div
          className="h-[200px] w-[200px] bg-primary/60 flex flex-col justify-end items-center rounded-lg bg-cover"
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
            onChange={handleImageUpload}
            maxFileSize={5 * 1024 * 1024}
          />
          <label
            className="flex gap-1 justify-center items-center w-28 h-6 text-xs bg-white p-1 rounded-md mb-4 hover:opacity-80 cursor-pointer"
            htmlFor="image"
          >
            <CameraIcon />
            Upload Image
          </label>
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
