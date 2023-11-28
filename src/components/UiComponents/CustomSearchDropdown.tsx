import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "./Icons";

interface CustomSearchDropdownProps {
  options: string[];
  default?: string;
  width?: string;
  placeholder?: string;
  getDropDownValue: (value: string) => void;
}

const CustomSearchDropdown: React.FC<CustomSearchDropdownProps> = (props) => {
  const { options } = props;
  const [searchTerm, setSearchTerm] = useState<string>(
    props?.default ? props.default : ""
  );
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    setIsDropdownOpen(true);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(newSearchTerm.toLowerCase())
    );
    props?.getDropDownValue(newSearchTerm);
    setFilteredOptions(filtered);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);

    if (!isDropdownOpen && searchTerm) {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (!isDropdownOpen && searchTerm === "") {
      setFilteredOptions(options);
    }
  };

  const handleItemClick = (item: string) => {
    props?.getDropDownValue(item);
    setSearchTerm(item);
    setFilteredOptions([]);
    setIsDropdownOpen(false);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className={`relative  ${props?.width}`} ref={dropdownRef}>
      <div className="relative text-gray-800">
        <input
          type="text"
          placeholder={props?.placeholder ? props.placeholder : ""}
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          onClick={() => handleDropdownToggle()}
        />
        <div
          className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            handleDropdownToggle();
          }}
        >
          {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isDropdownOpen && (
        <ul className="bg-white border border-gray-300 rounded absolute top-full left-0 w-full max-h-44 overflow-y-auto z-10 shadow-md p-0">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleItemClick(option)}
                className="p-2 cursor-pointer transition hover:bg-gray-200"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="p-2 cursor-pointer transition hover:bg-gray-200">
              No options
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSearchDropdown;
