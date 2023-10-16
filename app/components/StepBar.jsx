"use client";
import React, { useState } from "react";
import CompleteStep from "../assets/icons/CameraIcon";

const StepBar = ({ currentStep }) => {
  const steps = ["Upload your music", "Edit information", "Processing"];
  //const [currentStep, setCurrentStep] = useState(2);
  const [complete, setComplete] = useState(false);
  return (
    <div className="flex justify-between">
      {steps?.map((step, i) => (
        <div
          key={i}
          className={`step-item ${currentStep === i + 1 && "active"} ${
            (i + 1 < currentStep || complete) && "complete"
          } `}
        >
          <div className="step"></div>
          <p className=" step-text">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default StepBar;
