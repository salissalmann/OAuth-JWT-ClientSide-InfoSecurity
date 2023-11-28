import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { ConfirmationModal, Image } from "../../../components/UiComponents";
import {
  ButtonFill,
  ButtonOutlined,
} from "../../../components/UiComponents/Button";
import { Input, Label } from "../../../components/UiComponents/Forms";
import { ErrorIcon, SuccessIcon } from "../../../components/UiComponents/Icons";
import MyToast, { showToast } from "../../../components/UiComponents/MyToast";
import apiClient from "../../../services/api/apiClient";
import { TextArea } from "../../Topics/Components/EditTopic";
import IModule from "./Module.interface";
import { fetchAllModules } from "../../../services/api";

interface ModalProps {
  mode: string;
  active: boolean;
  setModal: (isActive: boolean) => void;
  onCancel: (isActive: boolean) => void;
  onConfirm: (isActive: boolean) => void;
  message?: string;
  children?: React.ReactNode;
  module?: IModule;
  setModule: React.Dispatch<React.SetStateAction<IModule[]>>
}

export const CreateModal: React.FC<ModalProps> = (props: ModalProps) => {
  const APIform = new FormData();
  const InitialErrors = {
    moduleNameError: {
      error: false,
      message: "",
    },
    moduleDescriptionError: {
      error: false,
      message: "",
    },
    imageAltTextError: {
      error: false,
      message: "",
    },
  };
  const [errors, setErrors] = useState(InitialErrors);

  const [formData, setFormData] = useState({
    moduleName: "",
    moduleDescription: "",
    moduleImage: "",
    imageAltText: "",
  });
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors = { ...errors };
    let isError = false;
    if (!formData.moduleName) {
      newErrors.moduleNameError.error = true;
      newErrors.moduleNameError.message = "Module Name is required";
      isError = true;
    } else {
      newErrors.moduleNameError.error = false;
      newErrors.moduleNameError.message = "";
    }
    if (!formData.moduleDescription) {
      newErrors.moduleDescriptionError.error = true;
      newErrors.moduleDescriptionError.message =
        "Module Description is required";
      isError = true;
    } else {
      newErrors.moduleDescriptionError.error = false;
      newErrors.moduleDescriptionError.message = "";
    }
    if (!formData.imageAltText) {
      newErrors.imageAltTextError.error = true;
      newErrors.imageAltTextError.message = "Image Alt Text is required";
      isError = true;
    } else {
      newErrors.imageAltTextError.error = false;
      newErrors.imageAltTextError.message = "";
    }
    setErrors(newErrors);
    return isError;
  };

  useEffect(() => {
    if (props.module) {
      setFormData({
        moduleName: props.module.moduleName,
        moduleDescription: props.module.moduleDescription,
        moduleImage: props.module.moduleImage,
        imageAltText: props.module.imageAltText,
      });
      setBase64Image(props.module.moduleImage);
    }
  }, [props.module]);

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
    APIform.append("moduleName", formData.moduleName);
    APIform.append("moduleDescription", formData.moduleDescription);
    APIform.append("imageAltText", formData.imageAltText.replace(/\s/g, '-'));
    if (file) {
      APIform.append("moduleImage", file);
    }

    try {
      let response;
      if (props.mode === 'add') {
        response = await apiClient.post(
          "/modules",
          APIform,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      else {
        response = await apiClient.put(
          `/modules/${props.module?._id}`,
          APIform,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      if (response.status) {
        props.setModal(false);
        showToast(
          `Module
        ${props.mode === "edit" ? "updated" : "created"} successfully!`,
          "success",
          <SuccessIcon />
        );

        const Response2 = await fetchAllModules()
        props.setModule(Response2.body.modules)

        setFormData({
          moduleName: "",
          moduleDescription: "",
          moduleImage: "",
          imageAltText: "",
        });
        setBase64Image(null);
        setFile(null);
        props.setModal(false);
      } else {
        showToast("Something went wrong", "error", <ErrorIcon />);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        showToast(err.response?.data.header.errorMessage, "error");
      } else {
        showToast("Something went wrong", "error");
      }
    }
    setDisableCreateButton(false);
  };

  const [confirmationModal, setConfirmationModal] = useState(false);

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
    setBase64Image("");
    setFormData({
      ...formData,
      moduleImage: "",
    });
  };

  return (
    <div
      id="createProductModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${props.active ? "" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative w-full max-w-2xl max-h-full p-4">
        <div className="relative p-4 bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
            <h3 className="text-lg font-semibold text-gray-900 ">
              {props.mode === "add" ? "Add New Module" : "Edit Module"}
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
              <Label>Module Name</Label>
              <Input
                type="text"
                placeholder="Enter Module Name"
                value={formData.moduleName}
                name="moduleName"
                onChange={handleInputChange}
                isError={errors.moduleNameError.error}
                errorMessage={errors.moduleNameError.message}
              />
            </div>

            <div className="space-y-2">
              <Label>Module Description</Label>
              <TextArea
                limit={300}
                setTextArea={(text: string) => {
                  setFormData({ ...formData, moduleDescription: text });
                }}
                disabled={false}
                value={formData.moduleDescription}
                isError={errors.moduleDescriptionError.error}
                errorMessage={errors.moduleDescriptionError.message}
              />
            </div>

            <div className="space-y-2">
              <Label>Module Image</Label>
              <p>
                Allowed file types (.jpg, .png) | Max file size 50MB | Ideal
                Image Sizes (1080x1080px)
              </p>
              <div>
                <div className="flex flex-col items-center justify-center w-full py-4 space-y-2 bg-gray-200">
                  <div className="relative flex items-center justify-center w-full overflow-hidden cursor-pointer hover.bg-gray-100 bg-gray-200 border-2">
                    {base64Image ? (
                      <>
                        <Image
                          src={base64Image}
                          shape="rectangle"
                          size="lg"
                          disabled
                        />
                        <div
                          className="absolute top-25 bottom-25 left-50 flex items-center justify-center p-4 bg-gray-900/30 rounded hover-bg-gray-900/90 cursor-pointer text-white hover:p-6  duration-200 hover:shadow-md ease-in-out "
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
                  if (
                    props.module &&
                    JSON.stringify(formData) !== JSON.stringify(props.module)
                  ) {
                    setConfirmationModal(true);
                  } else if (
                    formData.moduleName !== "" ||
                    formData.moduleDescription !== "" ||
                    formData.imageAltText !== ""
                  ) {
                    setConfirmationModal(true);
                  } else {
                    props.setModal(false);
                  }
                }}
              >
                Cancel
              </ButtonOutlined>
              <ButtonFill handleClick={Submit} disabled={disableCreateButton}>
                {props.mode === "add" ? "Create" : "Update"}
              </ButtonFill>
            </div>
          </div>
          <ConfirmationModal
            active={confirmationModal}
            onCancel={() => {
              setConfirmationModal(false);
            }}
            onConfirm={() => {
              setFormData({
                moduleName: "",
                moduleDescription: "",
                moduleImage: "",
                imageAltText: "",
              });
              props.setModal(false);
              setConfirmationModal(false);
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
const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  base64Image,
  onRemoveImage,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <label
        htmlFor="image"
        className="flex flex-col items-center justify-center w-full h-32 p-5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover.bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center w-full pt-5 pb-6 space-y-4">
          <div className="w-full text-center">
            <p className="mb-2 text-lg font-semibold text-gray-500">
              Click to upload
            </p>
            <p className="text-base text-gray-500">
              Files accepted: SVG, PNG, JPG, JPEG, or GIF
            </p>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          name="image"
          id="image"
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFileChange(e)
          }
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
