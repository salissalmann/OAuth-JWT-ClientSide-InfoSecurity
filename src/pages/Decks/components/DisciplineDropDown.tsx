import { useEffect, useState, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ClearIcon,
} from '../../../components/UiComponents';
import { useFetchAllDiscipline } from '../../../services/query';
import { IDiscipline } from '../Interfaces';

interface DropDownProps {
  value?: string;
  onSelect: (selectedValue: IDiscipline) => void;
  getAllOptions?: (name: string, values: object[]) => void;
  width?: string;
  all?: true;
  reset: boolean;
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const DisciplineDropDown: React.FC<DropDownProps> = (props) => {
  const initialDisciplineState = {
    _id: '',
    disciplineName: '',
    disciplineDescription: '',
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<IDiscipline>(
    initialDisciplineState
  );
  const [disciplines, setDisciplines] = useState<IDiscipline[]>([]);
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
    data: disciplinesData,
    isLoading,
    isError,
    error,
  } = useFetchAllDiscipline();

  useEffect(() => {
    if (props.value && disciplinesData) {
      const opt = disciplinesData.body.disciplines.filter(
        (c: IDiscipline) => c._id === props.value
      );
      opt.length > 0 && opt[0]._id !== ''
        ? setSelectedOption(opt[0])
        : setSelectedOption(initialDisciplineState);
    }
  }, [props.value, disciplinesData]);

  useEffect(() => {
    if (props?.reset) {
      handleClear();
    }
  }, [props.reset]);

  useEffect(() => {
    if (!isLoading && !isError) {
      setDisciplines(disciplinesData.body.disciplines);
      if (props.getAllOptions) {
        props.getAllOptions('disciplines', disciplinesData.body.disciplines);
      }
    }
  }, [disciplinesData]);

  // console.log('disciplinesData: ', disciplines);
  const handleOptionClick = (option: IDiscipline) => {
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
    setSelectedOption(initialDisciplineState);
    props.onSelect(initialDisciplineState);
  };

  if (error && !isLoading) return 'Something went wrong';

  return (
    <div className={`relative  ${props?.width ? props.width : ' w-full '}`}>
      <div className="flex items-center justify-between">
        <label className="mb-2.5 block text-black">Discipline</label>
        <div className="" onClick={() => handleClear()}>
          <ClearIcon size="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`relative bg-transparent 
        ${props.disabled && ' opacity-70  cursor-not-allowed '} 
        
        border border-stroke rounded py-3 px-5 outline-none transition focus:border-primary ${
          isDropdownOpen ? 'border-primary' : ''
        }`}
        onClick={toggleDropdown}
      >
        <div className="flex justify-between items-center">
          <span className="flex-grow">
            {selectedOption.disciplineName || 'Select'}
          </span>
          <div className="cursor-pointer">
            {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {isDropdownOpen && (
          <ul className="bg-white border border-gray-300 rounded mt-[14px] absolute left-0 w-full max-h-44 overflow-y-auto z-[200] shadow-md p-0">
            {props.all !== undefined && props.all && (
              <li
                className="p-2 cursor-pointer transition hover:bg-gray-200"
                onClick={() => handleOptionClick(initialDisciplineState)}
              >
                All
              </li>
            )}
            {disciplines &&
              disciplines.length > 0 &&
              disciplines.map((item) => (
                <li
                  key={item._id}
                  className="p-2 cursor-pointer transition hover:bg-gray-200"
                  onClick={() => handleOptionClick(item)}
                >
                  {item.disciplineName}
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

export default DisciplineDropDown;
