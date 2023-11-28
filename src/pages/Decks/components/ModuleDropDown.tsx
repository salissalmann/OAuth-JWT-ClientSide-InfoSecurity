import { useEffect, useState, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ClearIcon,
} from '../../../components/UiComponents';
import { useFetchAllModules } from '../../../services/query';
import { IModule } from '../Interfaces';

interface DropDownProps {
  value?: string;
  onSelect: (selectedValue: IModule) => void;
  getAllOptions?: (
    name: string,
    values: string[] | object[] | number[]
  ) => void;
  width?: string;
  all?: true;
  reset: boolean;
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

const ModuleDropDown: React.FC<DropDownProps> = (props) => {
  const initialModuleState = {
    _id: '',
    moduleName: '',
    moduleDescription: '',
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<IModule>(initialModuleState);
  const [modules, setModules] = useState<IModule[]>([]);
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

  const { data: modulesData, isLoading, isError, error } = useFetchAllModules();

  useEffect(() => {
    if (props?.reset) {
      handleClear();
    }
  }, [props.reset]);

  useEffect(() => {
    if (!isLoading && !isError) {
      setModules(modulesData.body.modules);
      if (props.getAllOptions) {
        props.getAllOptions('modules', modulesData.body.modules);
      }
    }
  }, [modulesData]);

  useEffect(() => {
    if (props.value && modulesData) {
      const opt = modulesData.body.modules.filter(
        (c: IModule) => c._id === props.value
      );
      opt.length > 0 && opt[0]._id !== ''
        ? setSelectedOption(opt[0])
        : setSelectedOption(initialModuleState);
    }
  }, [props.value, modulesData]);

  const handleOptionClick = (option: IModule) => {
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
    setSelectedOption(initialModuleState);
    props.onSelect(initialModuleState);
  };

  if (error && !isLoading) return 'Something went wrong';

  return (
    <div className={`relative  ${props?.width ? props.width : ' w-full '}`}>
      <div className="flex items-center justify-between">
        <label className="mb-2.5 block text-black">Module</label>
        <div className="" onClick={() => handleClear()}>
          <ClearIcon size="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`relative bg-transparent border border-stroke rounded py-3 px-5 outline-none transition focus:border-primary ${
          isDropdownOpen ? 'border-primary' : ''
        }
        
        
        ${props.disabled && ' opacity-70  cursor-not-allowed '} 
        `}
        onClick={toggleDropdown}
      >
        <div className="flex justify-between items-center">
          <span className="flex-grow">
            {selectedOption.moduleName || 'Select'}
          </span>
          <div className="cursor-pointer">
            {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
        {isDropdownOpen && (
          <ul className="bg-white border border-gray-300 rounded mt-[14px] absolute left-0 w-full max-h-44 overflow-y-auto z-[200] shadow-md p-0">
            {modules &&
              modules.length > 0 &&
              modules.map((item) => (
                <li
                  key={item._id}
                  className="p-2 cursor-pointer transition hover:bg-gray-200"
                  onClick={() => handleOptionClick(item)}
                >
                  {item.moduleName}
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

export default ModuleDropDown;
