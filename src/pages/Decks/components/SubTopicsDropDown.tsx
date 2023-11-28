import React, { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  ClearIcon,
} from "../../../components/UiComponents";
import { useFetchAllSubTopics } from "../../../services/query";
import { ISubTopic } from "../Interfaces";

interface DropDownProps {
  value?: string;
  onSelect: (selectedValue: ISubTopic) => void;
  getAllOptions?: (
    name: string,
    values: string[] | object[] | number[]
  ) => void;
  width?: string;
  all?: true;
  reset: boolean;
  activeSubTopicIds?: string[];
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const SubTopicsDropDown: React.FC<DropDownProps> = (props) => {
  const initialSubTopicState = {
    _id: "",
    subtopicName: "",
    subtopicDescription: "",
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<ISubTopic>(initialSubTopicState);
  const [subTopics, setSubTopics] = useState<ISubTopic[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const {
    data: subTopicsData,
    isLoading,
    isError,
    error,
  } = useFetchAllSubTopics();

  useEffect(() => {
    if (props?.reset) {
      handleClear();
    }
  }, [props.reset]);

  useEffect(() => {
    if (!isLoading && !isError) {
      let filteredSubTopics = subTopicsData.body.subtopics;

      if (props.activeSubTopicIds) {
        // Filter the subtopics based on activeSubTopicIds if provided
        filteredSubTopics = subTopicsData.body.subtopics.filter(
          (subtopic: ISubTopic) =>
            props?.activeSubTopicIds?.includes(subtopic._id)
        );
      }

      setSubTopics(filteredSubTopics);

      if (props.getAllOptions) {
        props.getAllOptions("subTopics", subTopicsData.body.subtopics);
      }
    }
  }, [subTopicsData, props.activeSubTopicIds]);

  useEffect(() => {
    if (props.value && subTopicsData) {
      // Check if subTopicsData is defined
      const opt = subTopicsData.body.subtopics.filter(
        (c: ISubTopic) => c._id === props.value
      );

      opt.length > 0 && opt[0]._id !== ""
        ? setSelectedOption(opt[0])
        : setSelectedOption(initialSubTopicState);
    }
  }, [props.value, subTopicsData]);

  const handleOptionClick = (option: ISubTopic) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    props.onSelect(option);
  };

  const toggleDropdown = () => {
    if (!props.disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleClear = () => {
    setSelectedOption(initialSubTopicState);
    props.onSelect(initialSubTopicState);
  };

  if (error && !isLoading) return "Something went wrong";

  return (
    <div className={`relative ${props?.width ? props.width : "w-full"}`}>
      <div className="flex items-center justify-between">
        <label className="mb-2.5 block text-black">Sub Topics</label>
        <div className="" onClick={() => handleClear()}>
          <ClearIcon size="w-5 h-5 cursor-pointer" />
        </div>
      </div>
      <div
        ref={dropdownRef}
        className={`relative bg-transparent border border-stroke rounded py-3 px-5 outline-none transition focus:border-primary ${
          isDropdownOpen ? "border-primary" : ""
        }
        ${props.disabled && " opacity-70  cursor-not-allowed "} 
        `}
        onClick={toggleDropdown}
      >
        <div className="flex justify-between items-center">
          <span className="flex-grow">
            {selectedOption.subtopicName || "Select"}
          </span>
          <div className="cursor-pointer">
            {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {isDropdownOpen && (
          <ul className="bg-white border border-gray-300 rounded mt-[14px] absolute left-0 w-full max-h-44 overflow-y-auto z-[200] shadow-md p-0">
            {subTopics &&
              subTopics.length > 0 &&
              subTopics.map((item) => (
                <li
                  key={item._id}
                  className="p-2 cursor-pointer transition hover-bg-gray-200"
                  onClick={() => handleOptionClick(item)}
                >
                  {item.subtopicName}
                </li>
              ))}
          </ul>
        )}
      </div>
      {props.isError && (
        <span className="text-red-700">
          {props.errorMessage ? props.errorMessage : "Required Field."}
        </span>
      )}
    </div>
  );
};

export default SubTopicsDropDown;
