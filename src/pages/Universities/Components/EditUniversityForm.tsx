import { ChangeEvent, useEffect, useState } from 'react';
import { ConfirmationModal } from '../../../components/UiComponents';
import {
    EditIcon,
    SaveIcon
} from '../../../components/UiComponents//Icons';
import {
    Input,
    Label,
} from "../../../components/UiComponents/Forms";
import { UploadIcon } from "../../../components/UiComponents/Icons";
import { TextArea } from '../../Topics/Components/EditTopic';
import { IUniversity } from './Universities.interface';
import axios from 'axios';
import MyToast, { showToast } from '../../../components/UiComponents//MyToast';
import { addImageToUniversity, removeImageFromUniversity, updateUniversityById } from '../../../services/api';
import { isAxiosError } from 'axios';


interface FormProps {
    originalUniversities: IUniversity
    university: IUniversity,
    setUniversity: (university: IUniversity) => void
    disabled: boolean
    handleDisabled: () => void
    RevertUniversityLogo: () => void
}

export default function EditUniversityForm({ originalUniversities, university, setUniversity, disabled, handleDisabled, RevertUniversityLogo }: FormProps) {

    const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
    const [scrollNumber, setScrollNumber] = useState<number>(0)

    const ErrorsInitialState = {
        universityNameError: {
            error: false,
            message: '',
        },
        acronymError: {
            error: false,
            message: '',
        },
        universityDescriptionError: {
            error: false,
            message: '',
        },
    }

    const [errors, setErrors] = useState(ErrorsInitialState);
    const validateForm = () => {
        const newErrors = { ...errors };
        let isError = false;

        if (!university.universityName) {
            newErrors.universityNameError = {
                error: true,
                message: 'University Name is required',
            };
            isError = true;
        } else {
            newErrors.universityNameError = {
                error: false,
                message: '',
            };
        }

        if (!university.acronym) {
            newErrors.acronymError = {
                error: true,
                message: 'University Acronym is required',
            };
            isError = true;
        } else {
            newErrors.acronymError = {
                error: false,
                message: '',
            };
        }

        if (!university.universityDescription) {
            newErrors.universityDescriptionError = {
                error: true,
                message: 'University Description is required',
            };
            isError = true;
        } else {
            newErrors.universityDescriptionError = {
                error: false,
                message: '',
            };
        }

        setErrors(newErrors);
        return isError;
    }
    const acceptedFileTypes = ".svg, .png, .jpg, .jpeg, .gif, .pdf"
    const fileTypeName = "SVG, PNG, JPG, JPEG, GIF, or PDF"
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file) {
                const formData = new FormData();
                formData.append('A', file);
                try {
                    if (!university?._id) return;
                    const Response = await addImageToUniversity(university._id, formData)
                    if (Response.status === 200) {
                        showToast('Image Added!', 'success');
                        const NewImages = university.universityImages
                        NewImages.push(Response.data.urls.images[0])
                        setUniversity({ ...university, universityImages: NewImages })
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        showToast(error.response?.data, 'error');
                    } else {
                        showToast('Something went wrong', 'error');
                    }
                }
            }
        }
    };


    const handleInputChange = (name: string, value: string) => {
        setUniversity({ ...university, [name]: value });
    };


    const initialImages = university.universityImages || [];
    const [Images, setImages] = useState(
        initialImages.slice(0, Math.min(initialImages.length, 4))
    );

    const handleNextStep = (slide: number) => {
        if (scrollNumber + slide >= 0 && scrollNumber + slide <= university.universityImages.length - 4) {
            setScrollNumber(scrollNumber + slide);
        }
    };

    useEffect(() => {
        const slicedImages = university.universityImages || [];
        setImages(slicedImages.slice(scrollNumber, Math.min(slicedImages.length, scrollNumber + 4)));
    }, [scrollNumber, university.universityImages, setImages]);


    const HandleSave = async () => {
        const isError = validateForm();
        if (isError) return;
        if (JSON.stringify(originalUniversities) === JSON.stringify(university)) {
            handleDisabled()
            return
        }


        const bodydata = {
            universityName: university.universityName,
            universityDescription: university.universityDescription,
            acronym: university.acronym,
        }
        try {
            const Response = await updateUniversityById(university._id, bodydata)
            if (Response.status === 200) {
                showToast('University Updated!', 'success');
                handleDisabled()

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

    const handleRemoveImage = async (image: string) => {
        try {
            if (!university?._id) return;
            const Response = await removeImageFromUniversity(university._id, { imageName: image })
            if (Response.status === 200) {
                showToast('Image Removed!', 'success');
                const NewImages = university.universityImages
                    .filter((img: string) => img !== image)
                setImages(NewImages);
                setUniversity({ ...university, universityImages: NewImages })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                showToast(error.response?.data.header.errorMessage, 'error');
            } else {
                showToast('Something went wrong', 'error');
            }
        }
    }



    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden border-b-2 border-gray-100">
                <div
                    className="mx-auto flex items-center justify-between px-5  md:flex-row flex-col">
                    <div className="flex flex-col items-start">
                        <div className="flex flex-row items-center justify-center gap-3">
                            <h1>University Details</h1>
                        </div>
                    </div>
                    <div className="ml-auto">
                        {disabled ? (
                            <>
                                <button
                                    className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                                    onClick={handleDisabled}
                                >
                                    <div
                                        className={`relative flex items-center space-x-3 text-gray-600`}
                                    >
                                        <EditIcon />
                                        <span className=" text-base font-semibold">
                                            Edit
                                        </span>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-between mt-5 border-b pb-2 gap-5">
                                <button
                                    className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                                    onClick={() => {
                                        if (JSON.stringify(originalUniversities) === JSON.stringify(university)) {
                                            handleDisabled()
                                            return
                                        }
                                        else {
                                            setConfirmationModal(true)
                                        }
                                    }}
                                >
                                    <div
                                        className={`relative flex items-center space-x-3 text-gray-800`}
                                    >
                                        <EditIcon />
                                        <span className=" text-base font-semibold">Cancel</span>
                                    </div>
                                </button>
                                <button
                                    className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-800 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                                    onClick={() => {
                                        HandleSave();
                                    }}
                                >
                                    <div
                                        className={`relative flex items-center space-x-3 text-white`}
                                    >
                                        <SaveIcon />
                                        <span className=" text-base font-semibold">Save</span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <ConfirmationModal
                    active={confirmationModal}
                    message="Are you sure you want to discard the changes you have made?"
                    onConfirm={() => {
                        setUniversity(originalUniversities)
                        RevertUniversityLogo()
                        setConfirmationModal(false)
                        handleDisabled()
                    }}
                    onCancel={() => {
                        setConfirmationModal(false)
                    }}
                />
                <MyToast />
            </section>

            <div className="rounded-sm  bg-white shadow-default ">
                <form className="my-8">
                    <div className="space-y-8">
                        <div className=" flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-3/4">
                                <Label>University Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your university name"
                                    name="universityName"
                                    onChange={handleInputChange}
                                    disabled={disabled}
                                    value={university.universityName}
                                    isError={errors?.universityNameError.error}
                                    errorMessage={errors?.universityNameError.message}
                                />
                            </div>
                            <div className="w-full xl:w-1/4">
                                <Label>University Acronym</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your university acronym"
                                    name="acronym"
                                    onChange={handleInputChange}
                                    disabled={disabled}
                                    value={university.acronym}
                                    isError={errors?.acronymError.error}
                                    errorMessage={errors?.acronymError.message}
                                />
                            </div>

                        </div>
                        <Label>University Description</Label>
                        <TextArea
                            setTextArea={(text: string) => {
                                setUniversity({ ...university, universityDescription: text });
                            }}
                            disabled={disabled}
                            value={university.universityDescription}
                            isError={errors?.universityDescriptionError.error}
                            errorMessage={errors?.universityDescriptionError.message}
                        />
                    </div>
                </form>
            </div>

            <div className='flex flex-col md:flex-row gap-3 justify-start items-center'>
                <div className="flex items-center justify-center w-54 h-48">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-23 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 "
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 space-y-4 p-3">
                            <UploadIcon size="w-12 h-12" color="text-gray-500" />
                            <div className="text-center">
                                <p className="mb-2 text-lg text-gray-500 font-semibold">
                                    Click to upload
                                </p>
                                <p className="text-sm text-gray-500 p-1">
                                    File accepted: {fileTypeName}
                                </p>
                            </div>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            disabled={disabled}
                            accept={acceptedFileTypes}
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
                <div className="flex flex-wrap gap-4">
                    {university.universityImages &&
                        university.universityImages.length > 4
                        &&
                        <ArrowButton
                            onClick={() => handleNextStep(-1)}
                            direction="left"
                        />
                    }

                    {university.universityImages &&
                        Images.map((image: string, index: number) => (
                            <div key={index} className="w-40 h-40 relative" style={{ position: 'relative' }}>
                                {!disabled &&
                                    <button
                                        className="edit-button text-white font-bold py-2 px-4 rounded z-10 bg-gray-700 bg-opacity-15 hover:bg-gray-700 opacity-100 transition duration-300 ease-in-out"
                                        onClick={() => {
                                            handleRemoveImage(image)
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '40%',
                                            left: '20%',
                                            zIndex: 1,
                                        }}
                                    >
                                        Remove
                                    </button>
                                }
                                <img
                                    src={image.includes('https://') ? image : `https://${image}`}
                                    alt="University Logo"
                                    className="w-full h-full rounded-sm object-cover border"
                                />
                            </div>
                        ))}
                    {university.universityImages &&
                        university.universityImages.length > 4
                        &&
                        <ArrowButton
                            onClick={() => handleNextStep(1)}
                            direction="right"
                        />
                    }
                </div>
            </div >




        </>
    )
}

interface ArrowButtonProps {
    onClick: () => void
    direction: "left" | "right"
}
const ArrowButton = ({ onClick, direction }: ArrowButtonProps) => {
    return (
        <button
            className="flex items-center justify-center w-40 h-40 bg-gray-100 rounded-sm"
            onClick={onClick}
        >
            {direction === "left" ?
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 010 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
                :
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M9.293 16.707a1 1 0 010-1.414L13.586 11H4a1 1 0 010-2h9.586l-4.293-4.293a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            }

        </button>
    );
}