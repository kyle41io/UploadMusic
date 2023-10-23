import React, { createContext, useState } from "react";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [infoFile, setInfoFile] = useState({
    title: null,
    artist: null,
    duration: null,
    genre: null,
    slug: null,
    ref: null,
  });
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <FileContext.Provider
      value={{
        infoFile,
        setInfoFile,
        uploadedImageFile,
        setUploadedImageFile,
        uploadedFile,
        setUploadedFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileContext;
