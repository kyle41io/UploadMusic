import React, { createContext, useState } from "react";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <FileContext.Provider value={{ uploadedFile, setUploadedFile }}>
      {children}
    </FileContext.Provider>
  );
};

export default FileContext;
