import React from "react";
import SuccessTickIcon from "../assets/icons/SuccessTickIcon";
import XIcon from "../assets/icons/XIcon";

const Success = ({ onClose }) => {
  return (
    <div className="flex gap-10 items-center w-[326px] h-[41px] rounded-lg p-[10px] border-2 border-[#1AB232] bg-[#1ab2320d]">
      <SuccessTickIcon />
      <p className="w-[180px]">Upload Successfully</p>
      <button onClick={onClose}>
        <XIcon />
      </button>
    </div>
  );
};

export default Success;
