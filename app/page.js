"use client";
import { useState, useEffect } from "react";
import StepBar from "./components/StepBar";
import Upload from "./pages/Upload";
import EditInfo from "./pages/EditInfo";
import Processing from "./pages/Processing";
import { FileProvider } from "@/app/utils";
import Success from "./components/Success";
import Error from "./components/Error";

export default function Home() {
  const [showUpload, setShowUpload] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [closingToast, setClosingToast] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    let timeout;
    if (showSuccessToast || showErrorToast) {
      timeout = setTimeout(() => {
        handleCloseToast();
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccessToast, showErrorToast]);

  const handleCloseToast = () => {
    setClosingToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setShowErrorToast(false);
      setClosingToast(false);
    }, 500);
  };

  return (
    <main className="flex flex-col items-center">
      <StepBar currentStep={currentStep} />
      <FileProvider>
        {showUpload && (
          <Upload setShowEdit={setShowEdit} setShowUpload={setShowUpload} />
        )}
        {showEdit && (
          <EditInfo
            setShowUpload={setShowUpload}
            setShowProcessing={setShowProcessing}
            setShowEdit={setShowEdit}
            setShowErrorToast={setShowErrorToast}
            setShowSuccessToast={setShowSuccessToast}
          />
        )}
        {showProcessing && <Processing setShowUpload={setShowUpload} />}
      </FileProvider>
      <div
        className={`toast-container ${
          (showSuccessToast || showErrorToast) && !closingToast ? "show" : ""
        } ${closingToast ? "closing" : ""}`}
      >
        {showSuccessToast && <Success onClose={handleCloseToast} />}
        {showErrorToast && <Error onClose={handleCloseToast} />}
      </div>
    </main>
  );
}
