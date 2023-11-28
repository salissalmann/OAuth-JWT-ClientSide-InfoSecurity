import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ClearIcon,
} from '../../../components/UiComponents';
import { IDropDown } from '../Interfaces';

interface DropdownSelectProps {
  onValueChange: (name: string, selectedValue: string) => void;
  propertyKey: string;
  width?: string;
  all?: boolean;
  reset: boolean;
  options: IDropDown[];
  for: string;
  disabled?: boolean;
}

const DropdownSelect: React.FC<DropdownSelectProps> = (props) => {
  const initialState = {
    _id: 'All',
    name: 'All',
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IDropDown>(initialState);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (props?.reset) {
      handleClear();
    }
  }, [props.reset]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: IDropDown) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    props.onValueChange(props.for, option._id);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClear = () => {
    setSelectedOption(initialState);
    props.onValueChange(props.for, '');
  };

  return (
    <div className={`relative ${props?.width ? props.width : 'w-full'}`}>
      <div className="flex items-center justify-between">
        <label className="mb-2.5 block text-black capitalize">
          {props.for}
        </label>
        <div className="" onClick={() => handleClear()}>
          <ClearIcon size="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`relative bg-transparent border border-stroke rounded py-3 px-5 outline-none transition focus:border-primary ${
          isDropdownOpen ? 'border-primary' : ''
        }`}
        onClick={toggleDropdown}
        style={props.disabled ? { pointerEvents: 'none', opacity: 0.6 } : {}}
      >
        <div className="flex justify-between items-center">
          <span className="flex-grow">
            {selectedOption[props.propertyKey] || 'Select'}
          </span>
          <div className="cursor-pointer">
            {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {isDropdownOpen && (
          <ul className="bg-white border border-gray-300 rounded mt-[14px] absolute left-0 w-full max-h-44 overflow-y-auto z-[200] shadow-md p-0">
            {props.all !== undefined && props.all && (
              <li
                className="p-2 cursor-pointer transition hover-bg-gray-200"
                onClick={() => handleOptionClick(initialState)}
              >
                All
              </li>
            )}
            {props.options &&
              props.options.length > 0 &&
              props.options.map((item) => (
                <li
                  key={item._id}
                  className="p-2 cursor-pointer transition hover-bg-gray-200"
                  onClick={() => handleOptionClick(item)}
                >
                  {item[props.propertyKey]}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownSelect;
