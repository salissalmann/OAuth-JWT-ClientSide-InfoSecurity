import { isAxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../../components/UiComponents';
import DropDown from '../../../components/UiComponents/DropDown';
import { Input, Label } from '../../../components/UiComponents/Forms';
import { ErrorIcon, SuccessIcon } from '../../../components/UiComponents/Icons';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import Switcher from '../../../components/UiComponents/Switcher';
import { useAddDeckToGroup, useFetchDeckTypes } from '../../../hooks';
import { fetchUniversities } from '../../../services/api/deckGroupApi';
import { IUniversity } from '../../Decks/Interfaces';
import { TextArea } from '../ManageDeckGroups';

interface AddFormInterface {
  AddingForm: (value: boolean) => void;
  deckGroupId: string;
}

export const AddingForm: React.FC<AddFormInterface> = ({
  AddingForm,
  deckGroupId,
}) => {

  const [decktypes, setDeckTypes] = useState([])
  const { data, isLoading, isError } = useFetchDeckTypes()

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setDeckTypes(data.data)
    }
  }, [
    isLoading,
    isError,
    data
  ])



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
    deckName: string;
    deckDescription: string;
    availableForAllUniversities: boolean;
    deckTime: number;
    isPremium: boolean;
    isPublished: boolean;
    deckCriteria: {
      universityId: string;
      deckType?: string;
    };
  }>({
    deckName: '',
    deckDescription: '',
    availableForAllUniversities: false,
    deckTime: 0,
    isPremium: false,
    isPublished: true,
    deckCriteria: {
      universityId: '',
      deckType: '',
    },
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = () => {
    setFormData({ ...formData, isPremium: !formData.isPremium });
  };

  const [enabled1] = useState(() => {
    return formData.isPremium !== undefined && formData.isPremium !== null
      ? formData.isPremium
      : false;
  });

  const getDropDownUniversityValue = (value: string) => {
    let UniversityId = '';
    Universities.filter(
      (university: IUniversity) => university.universityName === value
    ).map((university: IUniversity) => (UniversityId = university._id));
    setFormData({
      ...formData,
      deckCriteria: { ...formData.deckCriteria, universityId: UniversityId },
    });
  };

  const CreateDeckInfoMutation = useAddDeckToGroup();
  const InitialErrors = {
    deckNameError: {
      error: false,
      message: '',
    },
    deckDescriptionError: {
      error: false,
      message: '',
    },
    deckTimeError: {
      error: false,
      message: '',
    },
    deckUniversityError: {
      error: false,
      message: '',
    },
    deckTypeError: {
      error: false,
      message: '',
    },
  }

  const [errors, setErrors] = useState(InitialErrors);

  const validateForm = () => {
    const newErrors = { ...errors };
    let isError = false;

    if (!formData.deckName) {
      newErrors.deckNameError = {
        error: true,
        message: 'Deck Name is required',
      };
      isError = true;
    } else {
      newErrors.deckNameError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckDescription) {
      newErrors.deckDescriptionError = {
        error: true,
        message: 'Deck Description is required',
      };
      isError = true;
    } else {
      newErrors.deckDescriptionError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckTime) {
      newErrors.deckTimeError = {
        error: true,
        message: 'Deck Time is required',
      };
      isError = true;
    } else {
      newErrors.deckTimeError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckCriteria.universityId) {
      newErrors.deckUniversityError = {
        error: true,
        message: 'University is required',
      };
      isError = true;
    } else {
      newErrors.deckUniversityError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckCriteria.deckType) {
      newErrors.deckTypeError = {
        error: true,
        message: 'Deck Type is required',
      };
      isError = true;
    } else {
      newErrors.deckTypeError = {
        error: false,
        message: '',
      };
    }
    setErrors(newErrors);
    return isError;
  }


  const OnSubmit = async () => {
    if (validateForm()) {
      return;
    }
    const FormData = {
      deckName: formData.deckName,
      deckDescription: formData.deckDescription,
      availableForAllUniversities: formData.availableForAllUniversities,
      deckTime: formData.deckTime,
      isPremium: formData.isPremium,
      isPublished: formData.isPublished,
      deckCriteria: {
        universityId: formData.deckCriteria.universityId,
        deckType: formData.deckCriteria.deckType,
      },
    };

    const body = {
      body: {
        groupId: deckGroupId,
        deckData: FormData,
      },
    };
    try {
      const updatedDeckData = await CreateDeckInfoMutation.mutateAsync(body);
      if (updatedDeckData.success) {
        showToast(updatedDeckData.Message, 'success', <SuccessIcon />);
        setFormData({
          deckName: '',
          deckDescription: '',
          availableForAllUniversities: false,
          deckTime: 0,
          isPremium: false,
          isPublished: true,
          deckCriteria: {
            universityId: '',
            deckType: '',
          },
        });
        setTimeout((
        ) => {
          AddingForm(false);
        }
          ,
          2000
        )
      } else {
        showToast(updatedDeckData.Message, 'error', <ErrorIcon />);
      }
    }
    catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    if (!CreateDeckInfoMutation.isLoading && CreateDeckInfoMutation.isError) {
      if (isAxiosError(CreateDeckInfoMutation.error)) {
        const message =
          CreateDeckInfoMutation.error.response?.data?.header?.errorMessage ||
          'Internal Server Error';
        showToast(message, 'error');
      } else {
        showToast('Internal Server Error', 'error');
      }
    }
  }, [
    CreateDeckInfoMutation.isLoading,
    CreateDeckInfoMutation.isError,
    CreateDeckInfoMutation.error,
  ]);




  const [confirmationModal, setConfirmationModal] = useState(false)
  const GetUniversityName = (id: string) => {
    let universityName = ''
    Universities.filter((university: IUniversity) => university._id === id).map((university: IUniversity) => universityName = university.universityName)
    return universityName
  }

  return (
    <div>
      <div>
        <Label>Deck Name</Label>
        <Input
          type="text"
          placeholder="Enter Deck Name"
          name="deckName"
          onChange={handleInputChange}
          value={formData.deckName}
          isError={errors.deckNameError.error}
          errorMessage={errors.deckNameError.message}
        />
      </div>
      <div className="mt-5">
        <Label>Deck Description</Label>
        <TextArea
          setTextArea={(text) => {
            setFormData({ ...formData, deckDescription: text });
          }}
          value={formData.deckDescription}
          isError={errors.deckDescriptionError.error}
          errorMessage={errors.deckDescriptionError.message}
        />
      </div>

      <div className="flex flex-row gap-6 items-center justify-start mt-8 p-2">
        <div className="w-full xl:w-3/4">
          <Label>Is this available for all universities?</Label>
          <Switcher
            for={'UniSwitch'}
            size="small"
            isActive={false}
            onChange={() => {
              setFormData({
                ...formData,
                availableForAllUniversities:
                  !formData.availableForAllUniversities,
              });
            }}
          />
        </div>
        <div className="w-full xl:w-3/4">
          <Label>Is this a premium deck?</Label>
          <Switcher
            for={'Premium'}
            size="small"
            isActive={false}
            onChange={handleToggleChange}
            togglevalue={enabled1}
          />
        </div>
      </div>

      <div className="mt-4">
        <Label>University</Label>
        <DropDown
          options={UniversitiesNames}
          onSelect={(value: string | number) =>
            getDropDownUniversityValue(value.toString())
          }
          label={''}
          value={GetUniversityName(formData.deckCriteria.universityId)}
        />
        {errors.deckUniversityError.error && (
          <div className="text-red-500 text-xs">{errors.deckUniversityError.message}</div>
        )}
      </div>

      <div className="mt-4">
        <Label>Deck Type</Label>
        <DropDown
          options={decktypes}
          onSelect={(value: string | number) => {
            setFormData({
              ...formData,
              deckCriteria: {
                ...formData.deckCriteria,
                deckType: value.toString(),
              },
            });
          }}
          label={''}
          value={formData.deckCriteria.deckType}
        />
        {errors.deckTypeError.error && (
          <div className="text-red-500 text-xs">{errors.deckTypeError.message}</div>
        )}
      </div>

      <div className="mt-2">
        <Label>Deck Time</Label>
        <input
          className="w-full border border-gray-300 p-3 rounded-md"
          type="number"
          placeholder="Enter Deck Time"
          name="deckTime"
          onChange={(e) => {
            const inputValue = e.target.value;
            const numericValue = parseInt(inputValue);

            if (!isNaN(numericValue)) {
              setFormData({ ...formData, deckTime: numericValue });
            } else {
              setFormData({ ...formData, deckTime: 0 });
            }
          }}
        />
        {
          errors.deckTimeError.error && (
            <div className="text-red-500 text-xs">{errors.deckTimeError.message}</div>
          )
        }
      </div>

      <div className="flex flex-row gap-6 items-center justify-start mt-8 p-2">
        <div className="w-full xl:w-3/4">
          <Label>Published Deck</Label>
          <Switcher
            for={formData.deckName + 1}
            size="small"
            isActive={false}
            onChange={() => {
              setFormData({ ...formData, isPublished: !formData.isPublished });
            }}
            togglevalue={formData.isPublished}
          />
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
            if (
              JSON.stringify(formData) !== JSON.stringify({
                deckName: '',
                deckDescription: '',
                availableForAllUniversities: false,
                deckTime: 0,
                isPremium: false,
                isPublished: true,
                deckCriteria: {
                  universityId: '',
                  deckType: '',
                },
              })
            ) {
              setConfirmationModal(true)
            }
            else {
              AddingForm(false);
            }
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
          message="You will lose all the changes if you go back."
          onConfirm={() => {
            AddingForm(false);
            setFormData(
              {
                deckName: '',
                deckDescription: '',
                availableForAllUniversities: false,
                deckTime: 0,
                isPremium: false,
                isPublished: true,
                deckCriteria: {
                  universityId: '',
                  deckType: '',
                },
              }
            )
            setConfirmationModal(false)
          }}
          onCancel={() => {
            setConfirmationModal(false)
          }}
        />
      </div>

    </div>
  );
};

export default AddingForm;
