"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { IconChevronUp } from "@tabler/icons-react";

import Image from "next/image";

const Input = ({
  type = "text",
  label,
  placeholder,
  color = "#f08c51",
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  hint,
  icon,
  onChange,
  value,
}) => {
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [inputStyles, setInputStyles] = useState({
    outlineColor: color,
    backgroundColor: disabled ? "#F2F4F5" : "white",
    borderColor: "#CFD3D4",
  });
  const [labelStyles, setLabelStyles] = useState({
    color: disabled ? "#F2F4F5" : "#CFD3D4",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const [text, setText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [isMaxLimitReached, setIsMaxLimitReached] = useState(false);
  const maxLimit = 500;

  const handleChange = (value) => {
    let isValid = true;
    if (type === "text" && required) {
      isValid = value.trim() !== "";
    } else if (type === "textarea") {
      const inputValue = value;
      const currentCharacterCount = inputValue.length;
      setCharacterCount(currentCharacterCount);
      setIsMaxLimitReached(currentCharacterCount >= maxLimit);
      setText(inputValue);
      isValid = !isMaxLimitReached;
    }

    if (isValid === false || error) {
      setInputStyles({
        outlineColor: "red",
        borderColor: "red",
      });
      setLabelStyles({
        color: "red",
      });
    } else {
      setInputStyles({
        outlineColor: color,
        borderColor: color,
      });
      setLabelStyles({
        color: color,
      });
    }
    if (type === "select") {
      setInputStyles({
        ...inputStyles,
        border: "1px solid #474646b0",
      });
      setLabelStyles({
        ...labelStyles,
        color: "#474646b0",
      });
    }

    if (onChange) {
      onChange(value);
    }

    setIsInputChanged(true);
  };

  const handleBlur = (value) => {
    if (value == "" && required) {
      setInputStyles({
        outlineColor: "red",
        borderColor: "red",
      });
      setLabelStyles({
        color: "red",
      });
    } else if (inputStyles.borderColor === color && value !== "") {
      setInputStyles({
        borderColor: "#474646b0",
        outlineColor: color,
      });
      setLabelStyles({
        color: "#474646b0",
      });
    } else if (value === "" && !required) {
      setInputStyles({
        borderColor: "#CFD3D4",
        outlineColor: color,
      });
      setLabelStyles({
        color: "#CFD3D4",
      });
    }
  };

  return (
    <div className="relative w-full">
      <div
        className=" flex flex-col gap-0.5 "
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <label
          onClick={() => {
            inputRef.current?.focus();
          }}
          className="text-xs"
          style={labelStyles}
          htmlFor="text-input"
        >
          {label}
          {required && (
            <span className="text-red-500 font-bold text-base ml-1">*</span>
          )}
        </label>
        {type === "text" && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-[10px]">
              {icon && <Image src={icon} alt="" width={20} height={20} />}
            </span>
            <input
              ref={inputRef}
              placeholder={placeholder}
              className={`h-7 w-full px-2 py-1 rounded border border-[#dcdcdc] outline-[#f08c51] ${
                icon ? "pl-10" : ""
              }`}
              style={inputStyles}
              type={"text"}
              id="input-customize"
              name="input-customize"
              value={value}
              maxLength="100"
              onChange={(e) => handleChange(e.target.value)}
              onBlur={(e) => handleBlur(e.target.value)}
            />
          </div>
        )}
        {type === "textarea" && (
          <div className="relative">
            {!isMaxLimitReached && (
              <span className="absolute bottom-3 right-3 transform translate-y-1/2 text-gray-500">
                {characterCount}/{maxLimit}
              </span>
            )}

            <textarea
              placeholder="Enter your text..."
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              maxLength={maxLimit}
              className="h-20 w-full"
              onBlur={(e) => handleBlur(e.target.value)}
              style={inputStyles}
            ></textarea>

            {isMaxLimitReached && (
              <span className="absolute -bottom-3 right-3 text-red-500">
                Maximum character limit reached.
              </span>
            )}
          </div>
        )}
        {type === "select" && (
          <div
            ref={inputRef}
            id="genre"
            className="flex relative justify-between items-center h-7 px-1 rounded border"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onBlur={(e) => handleBlur(e.target.value)}
            style={inputStyles}
          >
            {value}
            {dropdownOpen ? (
              <IconChevronUp size={20} color="gray" />
            ) : (
              <IconChevronDown size={20} color="gray" />
            )}

            {dropdownOpen && (
              <ul className="dropdown-list w-full h-24 absolute z-10 mt-32 -ml-1 bg-white border border-[#dcdcdc] rounded overflow-y-scroll">
                <li onClick={() => handleChange("None")}>None</li>
                <li onClick={() => handleChange("Ballad")}>Ballad</li>
                <li onClick={() => handleChange("Rock")}>Rock</li>
                <li onClick={() => handleChange("RnB")}>R&amp;B</li>
                <li onClick={() => handleChange("Acoustic")}>Acoustic</li>
              </ul>
            )}
          </div>
        )}
        <div className="">
          {inputStyles.outlineColor === "red" &&
            isInputChanged &&
            value !== "" && (
              <p className="text-red-600 text-xs opacity-70 w-80">
                {errorMessage}
              </p>
            )}
          {inputStyles.outlineColor === "red" && value === "" && (
            <p className="text-red-600 text-xs opacity-70 w-80">
              This field is required, can not be blank.
            </p>
          )}
          {inputStyles.outlineColor !== "red" && (
            <div className="text-xs opacity-70 w-80">{hint}</div>
          )}
        </div>
      </div>
      {disabled && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-50" />
      )}
    </div>
  );
};

export default Input;
