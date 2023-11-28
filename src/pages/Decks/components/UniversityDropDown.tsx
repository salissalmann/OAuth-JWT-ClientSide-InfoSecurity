import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ClearIcon,
} from '../../../components/UiComponents';
import { useFetchAllUniversities } from '../../../services/query';

interface DropDownProps {
  onSelect: (selectedValue: IUniversity) => void;
  getAllOptions?: (
    name: string,
    values: string[] | object[] | number[]
  ) => void;
  width?: string;
  all?: true;
  value?: string | object;
  disabled?: boolean;
  reset: boolean;
}

export interface IAcademicYear {
  academicYear?: string;
  curriculum?: {
    moduleId: string;
    disciplines?: {
      disciplineId: string;
      topics?: {
        topicId: string;
        subTopics: string[];
      }[];
    }[];
  }[];
}

export interface IUniversity {
  _id: string;
  universityName: string;
  universityDescription: string;
  universityImages?: string[];
  parentUniversityId?: string | null;
  academicYears?: IAcademicYear[];
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  acronym?: string;
}

const initialUniversityState = {
  _id: '',
  universityName: '',
  universityDescription: '',
  createdAt: '',
  isActive: false,
};
const UniversityDropDown: React.FC<DropDownProps> = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IUniversity>(
    initialUniversityState
  );
  const [universities, setUniversities] = useState<IUniversity[]>([]);
  const [defaultValue, setDefaultValue] = useState(false);
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
  const {
    data: universitiesData,
    isLoading,
    isError,
    error,
  } = useFetchAllUniversities();

  useEffect(() => {
    if (!isLoading && !isError) {
      setUniversities(universitiesData.body.universities);
      if (props.getAllOptions) {
        props.getAllOptions('universities', universitiesData.body.universities);
      }
    }
  }, [universitiesData]);

  useEffect(() => {
    if (props?.reset) {
      handleClear();
    }
  }, [props.reset]);

  useEffect(() => {
    if (
      !defaultValue &&
      props.value !== undefined &&
      universities &&
      universities.length > 0
    ) {
      setDefaultValue(true);
      const selectedUniversity = universities.find(
        (uni) => uni._id === props.value
      ) as IUniversity;
      setSelectedOption(selectedUniversity);
      setDefaultValue(false);
    }
  }, [props.value, universities]);

  const handleOptionClick = (option: IUniversity) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    props.onSelect(option);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleClear = () => {
    setSelectedOption(initialUniversityState);
    props.onSelect(initialUniversityState);
  };

  if (error && !isLoading) return 'Something went wrong';
  const splitText = (text: string) => {
    return text?.length > 30 ? `${text?.slice(0, 30)}...` : text;
  };
  return (
    <div className={`relative  ${props?.width ? props.width : ' w-full '}`}>
      <div className="flex items-center justify-between">
        <label className="mb-2.5 block text-black ">Universities</label>
        <div className="" onClick={() => handleClear()}>
          <ClearIcon size="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`relative bg-transparent border border-stroke rounded py-3 px-5 outline-none transition focus:border-primary ${
          props.disabled && ' opacity-60 '
        } ${isDropdownOpen ? 'border-primary' : ''}`}
        onClick={toggleDropdown}
      >
        <div className="flex justify-between items-center">
          <span className="flex-grow">
            {splitText(selectedOption?.universityName) || 'Select'}
          </span>
          <div className="cursor-pointer">
            {isDropdownOpen && !props.disabled ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </div>
        </div>
        {isDropdownOpen && !props.disabled && (
          <ul className="bg-white border border-gray-300 rounded mt-[14px] absolute left-0 w-full max-h-44 overflow-y-auto z-[200] shadow-md p-0">
            {universities &&
              universities.length > 0 &&
              universities.map((item) => (
                <li
                  key={item._id}
                  className="p-2 cursor-pointer transition hover:bg-gray-200"
                  onClick={() => handleOptionClick(item)}
                >
                  {item.universityName.length > 30
                    ? `${item.universityName.slice(0, 30)}...`
                    : item.universityName}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UniversityDropDown;
