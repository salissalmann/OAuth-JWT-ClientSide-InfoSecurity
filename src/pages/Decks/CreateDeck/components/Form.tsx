import {
  DropDown,
  Input,
  Label,
  Switcher,
  TextArea,
} from '../../../../components/UiComponents';
import { showToast } from '../../../../components/UiComponents/MyToast';

import {
  IDeckErrorState,
  IDeckFormData,
  initialErrorState,
} from '../../Interfaces';
import { UniversityDropDown } from '../../components';
import { IUniversity } from '../../components/UniversityDropDown';

interface FormProps {
  formData: IDeckFormData;
  setFormData: (data: IDeckFormData) => void;
  onSubmit: () => void;
  disabledDeckForm: boolean;
  errors: IDeckErrorState;
}

export const Form: React.FC<FormProps> = ({
  formData,
  setFormData,
  disabledDeckForm,
  errors = initialErrorState,
}) => {
  const handleInputChange = (
    name: string,
    value: string | boolean | number
  ) => {
    if (name === 'year') {
      // Ensure that the input is numeric and has at most 4 characters
      const numericValue = String(value).replace(/\D/g, ''); // Remove non-numeric characters
      if (numericValue.length <= 4) {
        setFormData({
          ...formData,
          deckCriteria: {
            ...formData.deckCriteria,
            year: numericValue,
          },
        });
      } else {
        showToast('Year must be a 4-digit number', 'error');
      }
    } else if (name === 'deckType') {
      setFormData({
        ...formData,
        deckCriteria: {
          ...formData.deckCriteria,
          deckType: value as string,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const getDropDownValue = (selectedValue: string | number, name?: string) => {
    handleInputChange(name || 'deckType', selectedValue);
  };

  const getSwitcherValue = (enabled: boolean, name: string) => {
    handleInputChange(name, enabled);
  };

  const handleTextAreaChange = (name: string, value: string) => {
    handleInputChange(name, value);
  };

  const getSelectedUniversityValue = (selectedValue: IUniversity) => {
    setFormData({
      ...formData,
      deckCriteria: {
        ...formData.deckCriteria,
        universityId: selectedValue._id ? selectedValue._id : '',
      },
    });
  };

  return (
    <form className="my-8">
      <div className="space-y-8">
        <div className="flex items-start space-y-3 md:space-y-0 md:items-center md:space-x-4 flex-col md:flex-row">
          <div className="flex items-center space-x-2">
            <Switcher
              size="small"
              for="published"
              togglevalue={formData.isPublished}
              onChange={getSwitcherValue}
              disabled={disabledDeckForm}
            />
            <span className="">Published</span>
          </div>

          <div className="flex items-center space-x-2">
            <Switcher
              size="small"
              for="availableForAllUniversities"
              togglevalue={formData.availableForAllUniversities}
              onChange={getSwitcherValue}
              disabled={disabledDeckForm}
            />
            <span className="">is this available for all universities</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switcher
              size="small"
              for="isPremium"
              togglevalue={formData.isPremium}
              onChange={getSwitcherValue}
              disabled={disabledDeckForm}
            />
            <span className="">Is this a premium deck?</span>
          </div>
        </div>
        {/* Deck */}
        <div className=" flex flex-col gap-6">
          <div className="w-full ">
            <Label>Deck Name</Label>
            <Input
              type="text"
              placeholder="Enter your first name"
              value={formData.deckName}
              name="deckName"
              onChange={handleInputChange}
              isError={errors?.deckNameError.error}
              errorMessage={errors?.deckNameError.message}
              disabled={disabledDeckForm}
            />
          </div>

          <div className="w-full ">
            <Label>Deck Description</Label>
            <TextArea
              limit={300}
              for="deckDescription"
              value={formData.deckDescription}
              setValue={handleTextAreaChange}
              disabled={disabledDeckForm}
              isError={errors?.deckDescriptionError.error}
              errorMessage={errors?.deckDescriptionError.message}
            />
          </div>
        </div>
        {/* University */}
        <div className="">
          <header className=" font-medium text-lg border-b-[1px] border-b-gray-100">
            University{' '}
            {errors?.deckTypeError.error && errors?.deckTypeError.message && (
              <span className="text-red-700">
                {errors?.deckTypeError.message}
              </span>
            )}
          </header>
        </div>
        <div className="flex items-start md:space-x-2 flex-col md:flex-row space-y-3 md:space-y-0">
          <div className="w-full md:w-96">
            <UniversityDropDown
              onSelect={getSelectedUniversityValue}
              value={formData.deckCriteria.universityId}
              disabled={disabledDeckForm}
              reset={false}
            />
          </div>
          <div className="w-full md:w-80">
            <Label>Year</Label>
            <Input
              type="text"
              placeholder="Year"
              value={formData.deckCriteria?.year}
              name="year"
              onChange={handleInputChange}
              isError={false}
              disabled={disabledDeckForm}
            />
            {errors.deckYearError.error && errors.deckYearError.message && (
              <span className="text-red-700">
                {errors?.deckYearError.message}
              </span>
            )}
          </div>
          <DropDown
            value={
              formData.deckCriteria?.deckType
                ? formData.deckCriteria.deckType
                : 'Select'
            }
            name="deckType"
            label="Deck Type"
            options={['Quiz', 'ANNUAL_EXAM', 'MODULE_EXAM']}
            onSelect={getDropDownValue}
            disabled={disabledDeckForm}
            width='w-full md:w-80'
          />
        </div>
        <div className="w-full ">
          <Label>Deck Tags</Label>
          <TextArea
            for="deckTags"
            value={formData.deckTags}
            setValue={handleTextAreaChange}
            disabled={disabledDeckForm}
            limit={300}
            isError={errors?.deckTagsError.error}
            errorMessage={errors?.deckTagsError.message}
          />
        </div>
        <div className="">
          <Label>Questions</Label>
          <div className="h-44 bg-gray-100/80"></div>
        </div>
      </div>
    </form>
  );
};

export default Form;
