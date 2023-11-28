import { ButtonFill } from './Button';
import { SubTitle } from './Headings';
import { useEffect, useState } from 'react';
import { UploadFile } from './UploadFile';
import { CheckIcon } from './Icons';
import Switcher from './Switcher';
import DropDown from './DropDown';
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  checkboxes: string[];
}

export const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    checkboxes: [],
  });
  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // 🔰 // 🔰  For Checkboxes
  const getDropDownValue = (selectedValue: string | number) => {
    console.log('Selected Value:', selectedValue);
  };

  // 🔰  For Checkboxes
  const handleCheckboxChange = (checkboxName: string, isChecked: boolean) => {
    if (isChecked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        checkboxes: [...prevFormData.checkboxes, checkboxName],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        checkboxes: prevFormData.checkboxes.filter(
          (name) => name !== checkboxName
        ),
      }));
    }
  };

  // 🔰  To  get <Switcher/> value
  const getSwitcherValue = (enabled: boolean) =>
    console.log('Switcher is enabled:', enabled);

  console.log('🚀 Form Data: ', formData);

  // File Handler:
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (imageSrc: string) => {
    // console.log("🟡 Inside handleImageUpload: ", imageSrc);
    setSelectedImage(imageSrc);
    console.log(selectedImage);
  };

  return (
    <div className="rounded-sm  bg-white shadow-default ">
      <div className="border-b border-stroke py-2  ">
        <SubTitle>Form Components:</SubTitle>
      </div>
      <form className="my-8">
        <div className="space-y-8">
          <div className=" flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <Label>First name</Label>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                name="firstName"
                onChange={handleInputChange}
                isError={true}
              />
            </div>

            <div className="w-full xl:w-1/2">
              <Label>Last name</Label>
              <Input
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                name="lastName"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="">
            <Label required={true}>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <Label>Subject</Label>
            <Input
              type="text"
              placeholder="Select subject"
              value={formData.subject}
              name="subject"
              onChange={handleInputChange}
            />
          </div>
          {/* ======Drop Down Select Box ======*/}
          <DropDown
            label="Subject"
            options={['Biology', 'Chemistry', 'Mathematics']}
            onSelect={getDropDownValue}
          />
          {/*======Categories Check Boxes  ======*/}
          <div className="">
            <label className="mb-2.5 block text-black ">
              Select Categories
            </label>
            <div className="flex items-center justify-start space-x-4">
              <Checkbox
                for="Biology"
                checked={formData.checkboxes.includes('Biology')}
                onChange={(checked) => handleCheckboxChange('Biology', checked)}
              />
              <Checkbox
                for="Chemistry"
                checked={formData.checkboxes.includes('Chemistry')}
                onChange={(checked) =>
                  handleCheckboxChange('Chemistry', checked)
                }
              />
              <Checkbox
                for="Mathematics"
                checked={formData.checkboxes.includes('Mathematics')}
                onChange={(checked) =>
                  handleCheckboxChange('Mathematics', checked)
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-start space-x-4">
            <Radio />
          </div>
          {/* Toggles */}
          <div className="">
            <label className="mb-2.5 block text-black ">
              Want to Publish this?
            </label>
            <Switcher for="test" onChange={getSwitcherValue} />
          </div>
          {/* <TextArea limit={300} /> */}
          {/* ====== 🔰 Upload File ====== */}
          <Label>Accepts only image files</Label>
          <UploadFile fileType="image" onImageUpload={handleImageUpload} />
          <Label>Accepts only Pdf files </Label>
          <UploadFile fileType="pdf" onImageUpload={handleImageUpload} />
          <Label> Accepts both image and PDF files</Label>
          <UploadFile fileType="both" onImageUpload={handleImageUpload} />
          <Label> Default: Accepts only image files </Label>
          <UploadFile onImageUpload={handleImageUpload} />
          <div>
            <Label>Upload Image</Label>
            <input
              type="file"
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke   file:py-3 file:px-5 file:bg-primary file:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white "
            />
          </div>
          <div className="flex w-full justify-center rounded p-3 font-medium text-gray">
            <ButtonFill handleClick={() => {}}>Submit </ButtonFill>
          </div>
        </div>
      </form>
    </div>
  );
};

// ==================================
// ==================================

interface CustomInputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  value?: string | number;
  name: string;
  onChange?: (name: string, value: string) => void;
  isError?: boolean;
  disabled?: boolean;
  errorMessage?: string;
}

export const Input: React.FC<CustomInputProps> = ({
  type = 'text',
  value = '',
  name = '',
  onChange,
  placeholder = '',
  isError = false,
  disabled = false,
  errorMessage = '',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = event.target.value;

  //   if (onChange) {
  //     onChange(event.target.name, newValue);
  //   }
  // };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          type={isPasswordVisible ? 'text' : type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={
            onChange
              ? (event) => {
                  onChange(event.target.name, event.target.value);
                }
              : undefined
          }
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter           disabled:text-gray-400 disabled:font-light"
          disabled={disabled}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          >
            {isPasswordVisible ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {isError && (
        <span className="text-red-700">
          {errorMessage ? errorMessage : 'Required Field.'}
        </span>
      )}
    </div>
  );
};
// ==================================
// ==================================

export const Label: React.FC<{ children: string; required?: boolean }> = ({
  children,
  required,
}) => {
  return (
    <label className="mb-2.5 block text-black ">
      {children}{' '}
      {required ? required && <span className="text-meta-1">*</span> : null}
    </label>
  );
};

// ==================================
// ==================================

interface TextAreaProps {
  limit?: number;
  for?: string;
  value: string;
  setValue?: (name: string, value: string) => void;
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  limit,
  for: name,
  value = '',
  setValue,
  disabled = false,
  isError = false,
  errorMessage = '',
}) => {
  const [text, setText] = useState(value);
  const [charCount, setCharCount] = useState(0);
  console.log(name);
  useEffect(() => {
    if (limit !== undefined) {
      setCharCount(text.length);
    }
  }, [text, limit]);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;

    if (limit === undefined || newText.length <= limit) {
      setText(newText);
      setValue && setValue(name ? name : '', newText);
    }
  };

  return (
    <div className="">
      <textarea
        rows={6}
        placeholder="Type your message"
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:opacity-60"
        name={name}
        value={text}
        onChange={handleChange}
        disabled={disabled}
      ></textarea>
      {limit !== undefined && (
        <div className="text-gray-500 mt-2">
          {charCount}/{limit} characters
        </div>
      )}

      {isError && (
        <span className="text-red-700">
          {errorMessage ? errorMessage : 'Required Field.'}
        </span>
      )}
    </div>
  );
};

// ==================================
// ==================================

export const Checkbox = (props: {
  for: string;
  checked: boolean;
  showLabel?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  const { showLabel = true } = props;
  return (
    <div>
      <label
        htmlFor={`checkboxLabel_${props.for}`}
        className="flex cursor-pointer select-none items-center "
      >
        <div className="relative">
          <input
            type="checkbox"
            id={`checkboxLabel_${props.for}`}
            className="sr-only"
            checked={props.checked}
            onChange={() => {
              props.onChange(!props.checked);
            }}
            disabled={props.disabled}
          />
          <div
            className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
              props.checked && 'border-primary bg-gray'
            }`}
          >
            <span className={`opacity-0 ${props.checked && '!opacity-100'}`}>
              <CheckIcon size="w-4 h-4" color="text-primary" />
            </span>
          </div>
        </div>
        {showLabel && props.for}
      </label>
    </div>
  );
};

export const Radio = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleRadioChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <input
        id="default-radio-1"
        type="radio"
        value=""
        name="default-radio"
        className="w-6 h-6 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:bg-primary-200 text-primary-600 cursor-pointer"
        checked={isChecked}
        onChange={handleRadioChange}
      />
      <label
        htmlFor="default-radio-1"
        className="ml-2 text-sm font-medium text-gray-900"
      >
        Select Radio
      </label>
    </div>
  );
};

// ==================================
// ==================================
