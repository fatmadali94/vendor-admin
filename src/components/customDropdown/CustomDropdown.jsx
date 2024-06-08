import React, { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";

const CustomDropdown = ({ options, onSelect, reset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("انتخاب");
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.title); // Assuming the object has a label property for display
    setIsOpen(false);
    onSelect(option);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (reset) {
      setSelectedOption("انتخاب");
    }
  }, [reset]);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="custom-dropdown__selected" onClick={handleToggleDropdown}>
        {selectedOption}
      </div>
      {isOpen && (
        <div className="custom-dropdown__options">
          {options.map((option, index) => (
            <div
              key={index}
              className="custom-dropdown__option"
              onClick={() => handleOptionClick(option)}
            >
              {option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
