import React, { useState, useEffect } from 'react';
import { ButtonFill, ButtonOutlined } from '../../../components/UiComponents/Button';
import { Input, Label } from '../../../components/UiComponents/Forms';
import { ErrorIcon, SuccessIcon } from '../../../components/UiComponents/Icons';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import { TextArea } from '../../Topics/Components/EditTopic';
import { IDiscipline } from "../../../interfaces/Discipline/discipline.interface";
import { ConfirmationModal, Image } from '../../../components/UiComponents';
import axios from 'axios';
import { apiConfig } from '../../../services/api/apiClient';
import { isAxiosError } from 'axios';
import { fetchAllDiscipline } from '../../../services/api';


interface ModalProps {
  mode: string;
  active: boolean;
  setModal: (isActive: boolean) => void;
  onCancel: (isActive: boolean) => void;
  onConfirm: (isActive: boolean) => void;
  message?: string;
  children?: React.ReactNode;
  discipline?: IDiscipline;
  setDiscipline: React.Dispatch<React.SetStateAction<IDiscipline[]>>
}

export const CreateModal: React.FC<ModalProps> = (props: ModalProps) => {
  const APIform = new FormData();
  const InitialErrors = {
    disciplineNameError: {
      error: false,
      message: '',
    },
    disciplineDescriptionError: {
      error: false,
      message: '',
    },
    imageAltTextError: {
      error: false,
      message: '',
    },
  }
  const [errors, setErrors] = useState(InitialErrors);

  const [formData, setFormData] = useState({
    disciplineName: '',
    disciplineDescription: '',
    disciplineImage: '',
    imageAltText: '',
  });
  const [base64Image, setBase64Image] = useState<string | null>(null);
  useEffect(() => {
    if (props.mode === 'edit' && props.discipline) {
      setBase64Image(props.discipline?.disciplineImage)
    }
  }, [])

  const validateForm = () => {
    const newErrors = { ...errors };
    let isError = false;
    if (!formData.disciplineName) {
      newErrors.disciplineNameError.error = true;
      newErrors.disciplineNameError.message = 'Discipline Name is required';
      isError = true;
    } else {
      newErrors.disciplineNameError.error = false;
      newErrors.disciplineNameError.message = '';
    }
    if (!formData.disciplineDescription) {
      newErrors.disciplineDescriptionError.error = true;
      newErrors.disciplineDescriptionError.message = 'Discipline Description is required';
      isError = true;
    } else {
      newErrors.disciplineDescriptionError.error = false;
      newErrors.disciplineDescriptionError.message = '';
    }
    if (!formData.imageAltText) {
      newErrors.imageAltTextError.error = true;
      newErrors.imageAltTextError.message = 'Image Alt Text is required';
      isError = true;
    } else {
      newErrors.imageAltTextError.error = false;
      newErrors.imageAltTextError.message = '';
    }
    setErrors(newErrors);
    return isError;
  }

  useEffect(() => {
    if (props.discipline) {
      setFormData({
        disciplineName: props.discipline.disciplineName,
        disciplineDescription: props.discipline.disciplineDescription,
        disciplineImage: props.discipline.disciplineImage,
        imageAltText: props.discipline.imageAltText,
      });
      setBase64Image(props.discipline.disciplineImage)
    }
  }, [props.discipline]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [disableCreateButton, setDisableCreateButton] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const Submit = async () => {
    if (validateForm()) {
      return;
    }
    setDisableCreateButton(true);
    APIform.append('disciplineName', formData.disciplineName);
    APIform.append('disciplineDescription', formData.disciplineDescription);
    APIform.append('imageAltText', formData.imageAltText.replace(/\s/g, '-'));
    if (file) {
      APIform.append('disciplineImage', file);
    }

    try {
      const config = {
        method: props.mode === "add" ? 'post' : 'put',
        url: props.mode === "add"
          ? `${apiConfig.baseURL}/disciplines`
          : `${apiConfig.baseURL}/disciplines/${props.discipline?._id}`,
        data: APIform,
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      const response = await axios(config);
      if (response.status) {
        props.setModal(false);
        showToast(`Discipline
        ${props.mode === "edit" ? "updated" : "created"} successfully!`, 'success', <SuccessIcon />);
        setFormData({
          disciplineName: '',
          disciplineDescription: '',
          disciplineImage: '',
          imageAltText: '',
        });
        setBase64Image(null);
        setFile(null);
        props.setModal(false);
        //update state
        const response2 = await fetchAllDiscipline()
        if (response2.status) {
          props.setDiscipline(response2.body.disciplines)
        }


      } else {
        showToast('Something went wrong', 'error', <ErrorIcon />);
      }
    }
    catch (error) {
      if (isAxiosError(error)) {
        showToast(error.response?.data.header.errorMessage, 'error');
      }
      else {
        showToast('Something went wrong', 'error');
      }
    }
    setDisableCreateButton(false);
  };

  const [confirmationModal, setConfirmationModal] = useState(false)

  const handleFileChange = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64Image(reader.result as string);
    };
  };


  const removeFile = () => {
    setFile(null);
    setBase64Image('');
    setFormData(
      {
        ...formData,
        disciplineImage: ''
      }
    )
  };

  return (
    <div
      id="createProductModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${props.active ? '' : 'hidden'
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative p-4 bg-white rounded-lg shadow ">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 className="text-lg font-semibold text-gray-900 ">
              {props.mode === 'add' ? 'Add New Discipline' : 'Edit Discipline'}
            </h3>
            <MyToast />
            <button
              type="button"
              className="text-gray-400 bg-transparent hover.bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
              data-modal-target="createProductModal"
              data-modal-toggle="createProductModal"
              onClick={() => {
                props.setModal(false);
              }}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label>Discipline Name</Label>
              <Input
                type="text"
                placeholder="Enter Discipline Name"
                value={formData.disciplineName}
                name="disciplineName"
                onChange={handleInputChange}
                isError={errors.disciplineNameError.error}
                errorMessage={errors.disciplineNameError.message}
              />
            </div>

            <div className="space-y-2">
              <Label>Discipline Description</Label>
              <TextArea
                limit={300}
                setTextArea={(text: string) => {
                  setFormData({ ...formData, disciplineDescription: text });
                }}
                disabled={false}
                value={formData.disciplineDescription}
                isError={errors.disciplineDescriptionError.error}
                errorMessage={errors.disciplineDescriptionError.message}
              />
            </div>

            <div className="space-y-2">
              <Label>Discipline Image</Label>
              <p>
                Allowed file types (.jpg, .png) | Max file size 50MB | Ideal Image Sizes (1080x1080px)
              </p>
              <div>
                <div className="flex items-center justify-center w-full flex-col space-y-2 bg-gray-200 py-4">
                  <div className="relative flex items-center justify-center w-full overflow-hidden cursor-pointer hover.bg-gray-100 bg-gray-200 border-2">
                    {base64Image ? (
                      <>
                        <Image src={
                          base64Image
                        } shape="rectangle" size="lg" disabled />
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
                        base64Image={base64Image}
                        onRemoveImage={removeFile}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image Alt Text</Label>
              <Input
                type="text"
                placeholder="Enter Image Alt Text"
                value={formData.imageAltText}
                name="imageAltText"
                onChange={handleInputChange}
                isError={errors.imageAltTextError.error}
                errorMessage={errors.imageAltTextError.message}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <ButtonOutlined
                handleClick={() => {
                  if (props.discipline && JSON.stringify(formData) !== JSON.stringify(props.discipline)) {
                    setConfirmationModal(true)
                  }
                  else if (formData.disciplineName !== "" ||
                    formData.disciplineDescription !== "" ||
                    formData.imageAltText !== "") {
                    setConfirmationModal(true)
                  }
                  else {
                    props.setModal(false)
                  }
                }}
              >
                Cancel
              </ButtonOutlined>
              <ButtonFill handleClick={Submit} disabled={disableCreateButton}>
                {props.mode === 'add' ? 'Create' : 'Update'}
              </ButtonFill>
            </div>
          </div>
          <ConfirmationModal
            active={confirmationModal}
            onCancel={() => {
              setConfirmationModal(false)
            }}
            onConfirm={() => {
              setFormData({
                disciplineName: '',
                disciplineDescription: '',
                disciplineImage: '',
                imageAltText: '',
              });
              props.setModal(false)
              setConfirmationModal(false)
            }}
            message={"Are you sure you want to leave this page?"}
          />
        </div>
      </div>
    </div>
  );
};

interface ImageUploadProps {
  onImageChange: (file: File) => void;
  base64Image: string | null;
  onRemoveImage: () => void;
}
const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, base64Image, onRemoveImage }) => {

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
      {base64Image && (
        <div className="absolute top-25 bottom-25 left-50 flex items-center justify-center w-1/2 h-1/2 bg-gray-900/50 rounded hover.bg-gray-900/70 cursor-pointer text-white">
          <button onClick={onRemoveImage}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default CreateModal;
