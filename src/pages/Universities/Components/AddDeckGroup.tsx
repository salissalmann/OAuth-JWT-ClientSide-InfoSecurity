import { isAxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmationModal, Switcher } from '../../../components/UiComponents';
import DropDown from '../../../components/UiComponents/DropDown';
import { Input, Label } from '../../../components/UiComponents/Forms';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import { AddDeckGroup } from '../../../services/api';
import { fetchUniversities } from '../../../services/api/deckGroupApi';
import { TextArea } from '../../DeckGroups/Components/EditGroupForm';
import { IDeckGroup } from '../../Decks/Interfaces';
import { IUniversity } from './Universities.interface';
import { fetchDeckGroupOfUniversity } from '../../../services/api';
interface DeckGroups {
  _id: string;
  groupName: string;
  groupSource: string;
  groupDescription: string;
}
interface AcademicYear {
  academicYear: string;
  deckgroups: DeckGroups[];
}

interface AddFormInterface {
  AddingForm: (value: boolean) => void;
  currentTab: string,
  universityName: string
  setDeckgroups: React.Dispatch<React.SetStateAction<AcademicYear[] | undefined>>
}

export const AddingForm: React.FC<AddFormInterface> = ({
  AddingForm,
  currentTab,
  universityName,
  setDeckgroups
}) => {

  const { id } = useParams()
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

  const [selectedYear, setSelectedYear] = useState<string>(currentTab)
  const TabList = [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year',
  ];


  const [formData, setFormData] = useState<{
    groupName: string;
    groupDescription: string;
    groupSource: string;
    published: string;
  }>({
    groupName: '',
    groupDescription: '',
    groupSource: '',
    published: 'true'
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const getDropDownUniversityValue = (value: string) => {
    let UniversityId = '';
    Universities.filter(
      (university: IDeckGroup) => university.groupName === value
    ).map((university: IDeckGroup) => (UniversityId = university._id));
    setFormData({
      ...formData,
      groupSource: UniversityId
    })
  }


  const initialErrorState = {
    groupNameError: {
      error: false,
      message: '',
    },
    groupDescriptionError: {
      error: false,
      message: '',
    },
  }

  const [error, setError] = useState(initialErrorState);
  const validateField = async () => {
    let isError = false;
    const errors = {
      groupNameError: {
        error: false,
        message: '',
      },
      groupDescriptionError: {
        error: false,
        message: '',
      },
    };
    if (formData.groupName === '') {
      isError = true;
      errors.groupNameError.error = true;
      errors.groupNameError.message = 'Group Name is required';
    }
    if (formData.groupDescription === '') {
      isError = true;
      errors.groupDescriptionError.error = true;
      errors.groupDescriptionError.message = 'Group Description is required';
    }
    setError(errors);
    return isError;
  }



  const OnSubmit = async () => {
    const error = await validateField();
    if (error) return;
    if (id) {
      try {
        setFormData({
          ...formData,
          groupSource: id
        })
        const Response = await AddDeckGroup(id, selectedYear.split(" ").map((word) => word.toUpperCase()).join("_"), formData)
        if (Response.status === 200) {
          showToast('DeckGroup Added Successfully', 'success');
          AddingForm(false)

          const Response2 = await fetchDeckGroupOfUniversity(id)
          console.log("response", Response2)
          setDeckgroups(Response2.body.academicYears)


        }
      }
      catch (err) {
        if (isAxiosError(error)) {
          showToast(error.response?.data.header.errorMessage, 'error');
        }
        else {
          showToast('Something went wrong', 'error');
        }
      }
    }

  }





  const [confirmationModal, setConfirmationModal] = useState(false)

  return (
    <div>
      <div>
        <Label>Deck Group Name</Label>
        <Input
          type="text"
          placeholder="Enter Deck Group Name"
          name="groupName"
          onChange={handleInputChange}
          value={formData.groupName}
          isError={error.groupNameError.error ? error.groupNameError.error : false}
          errorMessage={error.groupNameError.error ? error.groupNameError.message : ''}
        />
      </div>

      <div className="mt-5">
        <Label>Deck Group Description</Label>
        <TextArea
          setTextArea={(text) => {
            setFormData({
              ...formData,
              groupDescription: text
            })
          }}
          value={formData.groupDescription}
          isError={error.groupDescriptionError.error ? error.groupDescriptionError.error : false}
          errorMessage={error.groupDescriptionError.error ? error.groupDescriptionError.message : ''}
        />
      </div>

      <div className="mt-4">
        <Label>DeckGroup Source</Label>
        <DropDown
          options={UniversitiesNames}
          disabled
          onSelect={(value: string | number) =>
            getDropDownUniversityValue(value.toString())
          }
          label={''}
          value={universityName}
        />
      </div>

      <div className="mt-4">
        <Label>Academic Year</Label>
        <DropDown
          options={TabList}
          onSelect={(value: string | number) =>
            setSelectedYear(value.toString())
          }
          label={''}
          value={selectedYear}
        />
      </div>

      <div className="mt-4">
        <Label>Published</Label>
        <Switcher
          for={"20-1023"}
          togglevalue={formData.published === 'true' ? true : false}
          onChange={(value) => {
            setFormData({
              ...formData,
              published: value ? 'true' : 'false'
            })
          }}
        />
      </div>




      <div
        className="flex flex-row gap-6 items-center 
            justify-end mt-1"
      >
        <button
          className="bg-white-500 bg-opacity-100 text-gray rounded p-2 mt-8 w-1/4 border border-gray-300
                    hover:bg-white hover:text-gray-500 hover:border hover:border-gray-500"
          onClick={() => {
            if (formData.groupName !== '' || formData.groupDescription !== '') {
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
              groupName: '',
              groupDescription: '',
              groupSource: '',
              published: 'true'
            })
          }}
          onCancel={() => setConfirmationModal(false)}
        />
      </div>
    </div>
  );

}



export default AddingForm;
