import React from "react";
import XIcon from "../assets/icons/XIcon";
import { IconCheck } from "@tabler/icons-react";

const ToastMessage = ({ onClose, error }) => {
  return (
    <div
      className={`flex justify-between items-center w-[326px] h-[48px] rounded-lg p-[10px] pr-[16px] border-2 `}
      style={{
        borderColor: error ? "#FF4040" : "#1AB232",
        background: error ? "#ff40400d" : "#1ab2320d",
      }}
    >
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full"
        style={{
          background: error ? "#FF4040" : "#1AB232",
        }}
      >
        <IconCheck size={18} strokeWidth={3} color="white" />
        {/* {error ? <ErrorTickIcon /> : <SuccessTickIcon />} */}
      </div>
      <p className="w-[190px]">
        {error ? "Failed to upload..." : "Uploaded succesfully!"}
      </p>
      <button onClick={onClose}>
        <XIcon />
      </button>
    </div>
  );
};

export default ToastMessage;
