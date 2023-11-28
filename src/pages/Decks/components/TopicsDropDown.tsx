import React, { useEffect, useState, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ClearIcon,
} from '../../../components/UiComponents';
import { useFetchAllTopics } from '../../../services/query';
import { ITopic } from '../Interfaces';

interface DropDownProps {
  value?: string;
  onSelect: (selectedValue: ITopic) => void;
  getAllOptions?: (
    name: string,
    values: string[] | object[] | number[]
  ) => void;
  width?: string;
  all?: true;
  reset: boolean;
  getSubtopics?: (subTopics: string[]) => void;
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const TopicsDropDown: React.FC<DropDownProps> = (props) => {
  const initialTopicState = {
    _id: '',
    topicName: '',
    topicDescription: '',
    subtopicIds: [],
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<ITopic>(initialTopicState);
  const [topics, setTopics] = useState<ITopic[]>([]);

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

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: topicsData, isLoading, isError, error } = useFetchAllTopics();

  useEffect(() => {
    if (props?.reset) {
      handleClear();
    }
  }, [props.reset]);

  useEffect(() => {
    if (!isLoading && !isError) {
      setTopics(topicsData.body.topics);
      if (props.getAllOptions) {
        props.getAllOptions('topics', topicsData.body.topics);
      }
    }
  }, [topicsData]);

  useEffect(() => {
    if (props.value && topicsData) {
      const opt = topicsData.body.topics.filter(
        (c: ITopic) => c._id === props.value
      );
      opt.length > 0 && opt[0]._id !== ''
        ? setSelectedOption(opt[0])
        : setSelectedOption(initialTopicState);
    }
  }, [props.value, topicsData]);

  const handleOptionClick = (option: ITopic) => {
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
    setSelectedOption(initialTopicState);
    props.onSelect(initialTopicState);
  };

  if (error && !isLoading) return 'Something went wrong';

  return (
    <div className={`relative  ${props?.width ? props.width : ' w-full '}`}>
      <div className="flex items-center justify-between">
        <label className="mb-2.5 block text-black">Topics</label>
        <div className="" onClick={() => handleClear()}>
          <ClearIcon size="w-5 h-5 cursor-pointer" />
        </div>
      </div>
      <div
        ref={dropdownRef} // Attach the ref to the dropdown container
        className={`relative bg-transparent border border-stroke rounded py-3 px-5 outline-none transition focus:border-primary ${
          isDropdownOpen ? 'border-primary' : ''
        }
        ${props.disabled && ' opacity-70  cursor-not-allowed '} 
        `}
        onClick={toggleDropdown}
      >
        <div className="flex justify-between items-center">
          <span className="flex-grow">
            {selectedOption.topicName || 'Select'}
          </span>
          <div className="cursor-pointer">
            {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {isDropdownOpen && (
          <ul className="bg-white border border-gray-300 rounded mt-[14px] absolute left-0 w-full max-h-44 overflow-y-auto z-[200] shadow-md p-0">
            {topics &&
              topics.length > 0 &&
              topics.map((item) => (
                <li
                  key={item._id}
                  className="p-2 cursor-pointer transition hover:bg-gray-200"
                  onClick={() => handleOptionClick(item)}
                >
                  {item.topicName}
                </li>
              ))}
          </ul>
        )}
      </div>

      {props.isError && (
        <span className="text-red-700">
          {props.errorMessage ? props.errorMessage : 'Required Field.'}
        </span>
      )}
    </div>
  );
};

export default TopicsDropDown;
