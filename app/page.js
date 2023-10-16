"use client";
import { useState, createContext, useContext, useEffect } from "react";
import StepBar from "./components/StepBar";
import Upload from "./components/Upload";
import EditInfo from "./components/EditInfo";
import Processing from "./components/Processing";
import { FileProvider } from "@/utils";

export default function Home() {
  const [showUpload, setShowUpload] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    File;
    if (showUpload) {
      setCurrentStep(1);
      setShowEdit(false);
      setShowProcessing(false);
    } else if (showEdit) {
      setCurrentStep(2);
      setShowUpload(false);
      setShowProcessing(false);
    } else if (showProcessing) {
      setCurrentStep(3);
      setShowUpload(false);
      setShowEdit(false);
    }
  }, [showUpload, showEdit, showProcessing]);

  return (
    <main className="flex flex-col items-center">
      <StepBar currentStep={currentStep} />
      <FileProvider>
        {showUpload && (
          <Upload setShowEdit={setShowEdit} setShowUpload={setShowUpload} />
        )}
        {showEdit && <EditInfo />}
        {showProcessing && <Processing />}
      </FileProvider>
    </main>
  );
}
