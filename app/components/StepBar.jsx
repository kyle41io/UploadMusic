"use client";
import React, { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import styles from "./StepBar.css";

const StepBar = ({ currentStep }) => {
  const steps = ["Upload your music", "Edit information", "Processing"];
  //const [currentStep, setCurrentStep] = useState(2);
  const [complete, setComplete] = useState(false);
  return (
    <div className="flex mb-10">
      {steps?.map((step, i) => (
        <div
          key={i}
          className={`step-item ${currentStep === i + 1 && "active"} ${
            (i + 1 < currentStep || complete) && "complete"
          } `}
        >
          <div className="step">
            {i + 1 < currentStep || complete ? (
              <IconCheck size={14} strokeWidth={3} />
            ) : null}
          </div>
          <p className=" step-text">{step}</p>
        </div>
      ))}
    </div>
  );
};

export default StepBar;
