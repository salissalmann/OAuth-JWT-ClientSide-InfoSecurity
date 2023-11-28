import { isAxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../../components/UiComponents';
import DropDown from '../../../components/UiComponents/DropDown';
import { Input, Label } from '../../../components/UiComponents/Forms';
import Image from '../../../components/UiComponents/Image';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import { createUniversity, fetchAllUniversities } from '../../../services/api';
import { fetchUniversities } from '../../../services/api/deckGroupApi';
import { TextArea } from '../../DeckGroups/Components/EditGroupForm';
import { IUniversity } from "./Universities.interface";


interface AddFormInterface {
  AddingForm: (value: boolean) => void;
  setUnivers: React.Dispatch<React.SetStateAction<IUniversity[] | undefined>>;
}

export const AddingForm: React.FC<AddFormInterface> = ({
  AddingForm,
  setUnivers,
}) => {

  const [Universities, setUniversities] = useState([]);
  const [UniversitiesNames, setUniversitiesNames] = useState([]);
  const usefetchUniversities = async () => {
    const response = await fetchUniversities();
    setUniversities(response.body.universities);
    setUniversitiesNames(
      response.body.universities.map(
        (university: IUniversity) => university.universityName
      )
    );
  };
  useEffect(() => {
    usefetchUniversities();
  }, []);

  const [formData, setFormData] = useState<{
    universityName: string;
    universityDescription: string;
    acronym: string,
    parentUniversityId: string,
    importCurriculam: boolean
  }>({
    universityName: '',
    universityDescription: '',
    acronym: '',
    parentUniversityId: '',
    importCurriculam: false
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const getDropDownUniversityValue = (value: string) => {
    let UniversityId = '';
    Universities.filter(
      (university: IUniversity) => university.universityName === value
    ).map((university: IUniversity) => (UniversityId = university._id));
    setFormData({
      ...formData,
      parentUniversityId: UniversityId,
    });
  };

  const initialErrorState = {
    universityNameError: {
      error: false,
      message: '',
    },
    universityDescriptionError: {
      error: false,
      message: '',
    },
    acronymError: {
      error: false,
      message: '',
    },
  }

  const [error, setError] = useState(initialErrorState);
  const validateField = async () => {
    let isError = false;
    const errors = {
      universityNameError: {
        error: false,
        message: '',
      },
      universityDescriptionError: {
        error: false,
        message: '',
      },
      acronymError: {
        error: false,
        message: '',
      },
    };
    if (formData.universityName === '') {
      isError = true;
      errors.universityNameError.error = true;
      errors.universityNameError.message = 'University Name is required';
    }
    if (formData.universityDescription === '') {
      isError = true;
      errors.universityDescriptionError.error = true;
      errors.universityDescriptionError.message =
        'University Description is required';
    }
    if (formData.acronym === '') {
      isError = true;
      errors.acronymError.error = true;
      errors.acronymError.message = 'Acronym is required';
    }
    setError(errors);
    return isError;
  }



  const OnSubmit = async () => {
    const error = await validateField();
    if (error) return;

    const universityData = new FormData();
    universityData.append('universityName', formData.universityName);
    universityData.append('universityDescription', formData.universityDescription);
    universityData.append('acronym', formData.acronym);
    if (formData.parentUniversityId !== '') {
      universityData.append('parentUniversityId', formData.parentUniversityId);
    }
    universityData.append('importCurriculam', formData.importCurriculam.toString());
    if (Logo) {
      universityData.append('universityLogo', Logo);
    }

    try {

      const response = await createUniversity({ formData: universityData })
      if (response.status === 200) {
        showToast('University Added Successfully', 'success');
        AddingForm(false);
        const Response2 = await fetchAllUniversities()
        setUnivers(Response2.body.universities)
      }
    } catch (error) {
      if (isAxiosError(error)) {
        showToast(error.response?.data.header.errorMessage, 'error');
      }
      else {
        showToast('Something went wrong', 'error');
      }
    }

  };

  const isEmptyFormData = () => {
    return (
      formData.universityName === '' &&
      formData.universityDescription === '' &&
      formData.acronym === '' &&
      formData.parentUniversityId === '' &&
      formData.importCurriculam === false &&
      Logo === null
    );
  };


  const [Logo, setLogo] = useState<
    File | null
  >(null);
  const handleFileChange = (file: File) => {
    setLogo(file);
  };
  const removeFile = () => {
    setLogo(null);
  };

  const [confirmationModal, setConfirmationModal] = useState(false)
  //Get UniversityName by id
  const getUniversityName = (id: string) => {
    let UniversityName = '';
    Universities.filter(
      (university: IUniversity) => university._id === id
    ).map((university: IUniversity) => (UniversityName = university.universityName));
    return UniversityName
  }

  return (
    <div>
      <div>
        <Label>University Name</Label>
        <Input
          type="text"
          placeholder="Enter University Name"
          name="universityName"
          onChange={handleInputChange}
          value={formData.universityName}
          isError={error.universityNameError.error ? error.universityNameError.error : false}
          errorMessage={error.universityNameError.error ? error.universityNameError.message : ''}
        />
      </div>
      <div>
        <Label>Acronym</Label>
        <Input
          type="text"
          placeholder="Enter Acronym"
          name="acronym"
          onChange={handleInputChange}
          value={formData.acronym}
          isError={error.acronymError.error ? error.acronymError.error : false}
          errorMessage={error.acronymError.error ? error.acronymError.message : ''}
        />
      </div>

      <div className="mt-5">
        <Label>University Description</Label>
        <TextArea
          setTextArea={(text) => {
            setFormData({ ...formData, universityDescription: text });
          }}
          value={formData.universityDescription}
          isError={error.universityDescriptionError.error ? error.universityDescriptionError.error : false}
          errorMessage={error.universityDescriptionError.error ? error.universityDescriptionError.message : ''}
        />
      </div>

      <div className="mt-4">
        <Label>Parent University</Label>
        <DropDown
          options={UniversitiesNames}
          onSelect={(value: string | number) =>
            getDropDownUniversityValue(value.toString())
          }
          label={''}
          value={getUniversityName(formData.parentUniversityId)}
        />
      </div>

      <div className="mt-4">
        <input
          type="checkbox"
          checked={formData.importCurriculam}
          onChange={() => {
            setFormData({
              ...formData,
              importCurriculam: !formData.importCurriculam
            })
          }}
        />
        <span className="ml-2">Import Curriculum from Parent University</span>
      </div>


      <div className="space-y-2 mt-5">
        <Label>University Logo</Label>
        <p>
          Allowed file types (.jpg, .png) | Max file size 50MB | Ideal Image Sizes (1080x1080px)
        </p>
        <div>
          <div className="flex items-center justify-center w-full flex-col space-y-2 bg-gray-200 py-4">
            <div className="relative flex items-center justify-center w-full overflow-hidden cursor-pointer hover.bg-gray-100 bg-gray-200 border-2">
              {Logo ? (
                <>
                  <Image
                    src={URL.createObjectURL(Logo)}
                    shape="rectangle" size="xl" disabled />
                  <div
                    className="absolute top-25 bottom-25 left-50 flex items-center justify-center w-1/2 h-1/2 bg-gray-900/50 rounded hover.bg-gray-900/70 cursor-pointer text-white"
                    onClick={removeFile}
                  >
                    Remove
                  </div>
                </>
              ) : (
                <ImageUpload
                  onImageChange={handleFileChange}
                  Logo={Logo}
                  onRemoveImage={removeFile}
                />
              )}
            </div>
          </div>
        </div>
      </div>



      <div
        className="flex flex-row gap-6 items-center 
            justify-end mt-1"
      >
        <button
          className="bg-white-500 bg-opacity-100 text-gray rounded p-2 mt-8 w-1/4 border border-gray-300
                    hover:bg-white hover:text-gray-500 hover:border hover:border-gray-500"
          onClick={() => {
            //if formdata not empty
            if (!isEmptyFormData()) {
              setConfirmationModal(true)
              return
            }
            AddingForm(false)
          }}
        >
          Cancel
        </button>
        <button
          className="bg-primary-500 bg-opacity-100 text-white rounded p-2 mt-8 w-1/4 border border-primary hover:bg-white hover:text-primary hover:border hover:border-primary"
          onClick={() => {
            OnSubmit();
          }}
        >
          Add
        </button>
        <MyToast />

        <ConfirmationModal
          active={confirmationModal}
          message="You have unsaved changes"
          onConfirm={() => {
            setConfirmationModal(false)
            AddingForm(false)
            setFormData({
              universityName: '',
              universityDescription: '',
              acronym: '',
              parentUniversityId: '',
              importCurriculam: false,
            })
            setLogo(null)
          }}
          onCancel={() => setConfirmationModal(false)}
        />
      </div>
    </div>
  );
};


interface ImageUploadProps {
  onImageChange: (file: File) => void;
  Logo: string | null;
  onRemoveImage: () => void;
}
const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, Logo, onRemoveImage }) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 p-5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover.bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-4 w-full">
          <div className="text-center w-full">
            <p className="mb-2 text-lg text-gray-500 font-semibold">Click to upload</p>
            <p className="text-base text-gray-500">Files accepted: SVG, PNG, JPG, JPEG, or GIF</p>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          name="image"
          id="image"
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
        />
      </label>
      {Logo && (
        <div className="absolute top-25 bottom-25 left-50 flex items-center justify-center w-1/2 h-1/2 bg-gray-900/50 rounded hover.bg-gray-900/70 cursor-pointer text-white">
          <button onClick={onRemoveImage}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default AddingForm;
