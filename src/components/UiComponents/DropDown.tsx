import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "./Icons";

// 🔰 Props Implementation
//  you will have to pass props like this , Also width is optional if you want custom width then pass change rem value like
// min-w-[12rem] , min-w-[5rem] ,min-w-[8rem]

{
  /* <DropDown
label="Subject"
options={["Biology", "Chemistry", "Mathematics"]}
onSelect={getDropDownValue}
width="min-w-[12rem]"
/> */
}

interface DropDownProps {
  label: string;
  options: (string | number)[];
  onSelect: (selectedValue: string | number, name?: string) => void;
  width?: string;
  all?: true;
  disabled?: boolean;
  value?: string;
  name?: string;
  reset?: boolean;
}

const DropDown: React.FC<DropDownProps> = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOptionClick = (option: string | number) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    if (props.name) {
      props.onSelect(option, props.name);
    } else {
      props.onSelect(option);
    }
  };

  const toggleDropdown = () => {
    if (!props.disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleClear = () => {
    if (props.name) {
      setSelectedOption("");
      props.onSelect("", props.name);
    } else {
      setSelectedOption("");
      props.onSelect("");
    }
  };

  useEffect(() => {
    if (props?.reset) {
      handleClear();
    }
  }, [props.reset]);

  useEffect(() => {
    if (props.value) {
      props.options.includes(props.value)
        ? setSelectedOption(props.value)
        : setSelectedOption("");
    } else {
      setSelectedOption("");
    }
  }, [props.value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${props?.width ? props.width : " w-80 "}`}>
      <label className="mb-2.5 block text-black">{props.label}</label>
      <div
        ref={dropdownRef}
        className={`relative bg-transparent border border-stroke rounded py-3 px-5 outline-none transition focus-border-primary ${
          isDropdownOpen ? "border-primary" : ""
        }
        ${props.disabled && " opacity-70  cursor-not-allowed "} 
        `}
        onClick={toggleDropdown}
        // style={props.disabled ? { pointerEvents: 'none', opacity: 0.6 } : {}}
      >
        <div className="flex justify-between items-center">
          <span className="flex-grow">
            {props.value && props.options.includes(props.value)
              ? props.value
              : selectedOption || "Select"}
          </span>

          <div className="cursor-pointer">
            {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {isDropdownOpen && (
          <ul className="bg-white border border-gray-300 rounded mt-3 absolute left-0 w-full max-h-44 overflow-y-auto  z-[200] shadow-md p-0 ">
            {props.all !== undefined && props.all && (
              <li
                className="p-2 cursor-pointer transition hover-bg-gray-200"
                onClick={() => handleOptionClick("All")}
              >
                All
              </li>
            )}
            {props.options.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer transition hover-bg-gray-200"
                onClick={() => handleOptionClick(option)}
                style={
                  props.disabled ? { pointerEvents: "none", opacity: 0.6 } : {}
                }
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropDown;
