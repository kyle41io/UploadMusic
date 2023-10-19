import React from "react";
import SuccessTickIcon from "../assets/icons/SuccessTickIcon";
import XIcon from "../assets/icons/XIcon";
import ErrorTickIcon from "../assets/icons/ErrorTickIcon";

const ToastMessage = ({ onClose, error }) => {
  return (
    <div
      className={`flex justify-between items-center w-[326px] h-[48px] rounded-lg p-[10px] pr-[16px] border-2 `}
      style={{
        borderColor: error ? "#FF4040" : "#1AB232",
        background: error ? "#ff40400d" : "#1ab2320d",
      }}
    >
      {error ? <ErrorTickIcon /> : <SuccessTickIcon />}
      <p className="w-[190px]">Upload Successfully</p>
      <button onClick={onClose}>
        <XIcon />
      </button>
    </div>
  );
};

export default ToastMessage;
