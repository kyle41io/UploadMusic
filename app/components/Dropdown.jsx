"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { IconChevronUp } from "@tabler/icons-react";
import "./Dropdown.css";

const Dropdown = ({ genre, setGenre, setInfoFile }) => {
  const [inputStyles, setInputStyles] = useState({
    outlineColor: "#f08c51",
    borderColor: "#CFD3D4",
  });
  const [labelStyles, setLabelStyles] = useState({
    color: "#CFD3D4",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options = ["None", "Ballad", "Rock", "RnB", "Acoustic", "EDM"];
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleChangeGenre = (genre) => {
    setGenre(genre);
    setInfoFile((prevInfoFile) => ({
      ...prevInfoFile,
      genre: genre,
    }));
    setInputStyles({
      ...inputStyles,
      border: "1px solid #474646b0",
    });
    setLabelStyles({
      ...labelStyles,
      color: "#474646b0",
    });
  };

  return (
    <div>
      <label className="text-xs" style={labelStyles} htmlFor="text-input">
        Genre
      </label>
      <div
        ref={inputRef}
        id="genre"
        className="flex relative justify-between items-center h-7 px-1 mt-1 rounded border"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onBlur={(e) => handleBlur(e.target.value)}
        style={inputStyles}
      >
        {genre}
        {dropdownOpen ? (
          <IconChevronUp size={20} color="gray" />
        ) : (
          <IconChevronDown size={20} color="gray" />
        )}

        {dropdownOpen && (
          <ul className="dropdown-list w-full h-24 absolute z-10 mt-32 -ml-1 bg-white border border-[#dcdcdc] rounded overflow-y-scroll">
            {options.map((option) => (
              <li key={option} onClick={() => handleChangeGenre(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
