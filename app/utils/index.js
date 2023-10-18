import React, { createContext, useState } from "react";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [titleFile, setTitleFile] = useState(null);
  const [artistFile, setArtistFile] = useState(null);
  const [durationFile, setDurationFile] = useState(null);
  const [genreFile, setGenreFile] = useState(null);
  const [slugFile, setSlugFile] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);

  return (
    <FileContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        titleFile,
        setTitleFile,
        artistFile,
        setArtistFile,
        durationFile,
        setDurationFile,
        genreFile,
        setGenreFile,
        uploadedImageFile,
        setUploadedImageFile,
        slugFile,
        setSlugFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export default FileContext;
