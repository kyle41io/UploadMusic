import React from "react";
import ErrorTickIcon from "../assets/icons/ErrorTickIcon";
import XIcon from "../assets/icons/XIcon";

const Error = ({ onClose }) => {
  return (
    <div
      className="flex gap-6 items-center w-[326px] h-[48px] rounded-lg p-[10px] border-2 border-[#FF4040] bg-[#ff40400d]
    "
    >
      <ErrorTickIcon />
      <p className="w-[190px]">Error. Please try again!</p>
      <button onClick={onClose}>
        <XIcon />
      </button>
    </div>
  );
};

export default Error;
