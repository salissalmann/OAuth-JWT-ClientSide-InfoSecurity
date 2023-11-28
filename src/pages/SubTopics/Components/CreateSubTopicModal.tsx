import { useEffect, useState } from "react";
import { ButtonFill, ButtonOutlined, ConfirmationModal, Input, Label, Switcher } from "../../../components/UiComponents";
import { AddIcon, ErrorIcon } from "../../../components/UiComponents/Icons";
import MyToast, { showToast } from "../../../components/UiComponents/MyToast";
import { useCreateSubTopic, useUpdateSubTopic } from "../../../hooks";
import { TextArea } from "../../Topics/Components/EditTopic";
import { isAxiosError } from "axios";
import { ISubTopic } from "../../../interfaces/SubTopics/subtopics.interface";
import { fetchAllSubTopics } from "../../../services/api";

interface CreateSubTopicModalProps {
    mode: string;
    active: boolean;
    setModal: (isActive: boolean) => void;
    onCancel: (isActive: boolean) => void;
    onConfirm: (isActive: boolean) => void;
    message?: string;
    children?: React.ReactNode;
    subtopic?: ISubTopic
    setSubTopics: React.Dispatch<React.SetStateAction<ISubTopic[]>>
}

export const CreateSubTopicModal = (props: CreateSubTopicModalProps) => {

    const [formData, setFormData] = useState<{
        _id?: string;
        subtopicName: string;
        subtopicDescription?: string;
        isActive: boolean;
    }>({

        subtopicName: '',
        subtopicDescription: '',
        isActive: false
    });

    useEffect(() => {
        if (props.subtopic) {
            setFormData({
                _id: props.subtopic._id,
                subtopicName: props.subtopic.subtopicName,
                subtopicDescription: props.subtopic.subtopicDescription,
                isActive: props.subtopic.isActive
            })
        }
    }, [props.subtopic])


    const handleInputChange = (name: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const InitialErrors = {
        subtopicNameError: {
            error: false,
            message: '',
        },
        subtopicDescriptionError: {
            error: false,
            message: '',
        },
    }


    const [errors, setErrors] = useState(InitialErrors);
    const [confirmationModal, setConfirmationModal] = useState(false)

    const ValidateForm = () => {
        const newErrors = { ...errors };
        let isError = false;

        if (formData.subtopicName === '') {
            newErrors.subtopicNameError.error = true;
            newErrors.subtopicNameError.message = 'SubTopic Name is required';
            isError = true;
        }
        else {
            newErrors.subtopicNameError = {
                error: false,
                message: '',
            };
        }
        if (formData.subtopicDescription === '') {
            newErrors.subtopicDescriptionError.error = true;
            newErrors.subtopicDescriptionError.message = 'SubTopic Description is required';
            isError = true;
        }
        else {
            newErrors.subtopicDescriptionError = {
                error: false,
                message: '',
            };
        }
        setErrors(newErrors);
        return isError;
    }

    useEffect(() => {
        ValidateForm
    }
        , [formData])

    const createSubTopicMutation = useCreateSubTopic()
    const updateSubTopicMutation = useUpdateSubTopic();
    const Submit = async () => {
        if (ValidateForm()) return

        if (props.mode === 'add') {
            const body = {
                body: {
                    subtopicName: formData.subtopicName,
                    subtopicDescription: formData.subtopicDescription,
                    isActive: formData.isActive
                }
            }
            try {
                const response = await createSubTopicMutation.mutateAsync(body)
                if (response) {
                    showToast(
                        `SubTopic Created Successfully`,
                        `success`,
                        <AddIcon />
                    )
                    props.setModal(false)
                    const response2 = await fetchAllSubTopics()
                    if (response2) {
                        props.setSubTopics(response2.body.subtopics)
                    }
                    setFormData(
                        {
                            subtopicName: '',
                            subtopicDescription: '',
                            isActive: false
                        }
                    )
                }
            }
            catch (err) {
                if (isAxiosError(err)) {
                    showToast(err.response?.data.header.errorMessage, 'error');
                }
                else {
                    showToast('Something went wrong', 'error');
                }
            }
        }
        else {
            const body = {
                subtopicName: formData.subtopicName,
                subtopicDescription: formData.subtopicDescription,
                isActive: formData.isActive
            }

            if (!formData._id) {
                showToast(
                    `Something went wrong`,
                    `error`,
                    <ErrorIcon />
                )
                return
            }
            try {
                const response = await updateSubTopicMutation.mutateAsync({
                    id: formData._id,
                    body: body
                })
                if (response) {
                    showToast(
                        `SubTopic Updated Successfully`,
                        `success`,
                        <AddIcon />
                    )
                    props.setModal(false)
                    setFormData(
                        {
                            subtopicName: '',
                            subtopicDescription: '',
                            isActive: false
                        }
                    )
                    const response2 = await fetchAllSubTopics()
                    if (response2) {
                        props.setSubTopics(response2.body.subtopics)
                    }

                }
                else {
                    showToast(
                        `Something went wrong`,
                        `error`,
                        <ErrorIcon />
                    )
                }
            }
            catch (error) {
                console.log(error)
            }
        }
    };

    useEffect(() => {
        if (!createSubTopicMutation.isLoading && createSubTopicMutation.isError) {
            if (isAxiosError(createSubTopicMutation.error)) {
                const message =
                    'Internal Server Error';
                showToast(message, 'error');
            } else {
                showToast('Internal Server Error', 'error');
            }
        }
    }, [
        createSubTopicMutation.isLoading,
        createSubTopicMutation.isError,
        createSubTopicMutation.error,
    ]);

    useEffect(() => {
        if (!updateSubTopicMutation.isLoading && updateSubTopicMutation.isError) {
            if (isAxiosError(updateSubTopicMutation.error)) {
                const message =
                    'Internal Server Error';
                showToast(message, 'error');
            } else {
                showToast('Internal Server Error', 'error');
            }
        }
    }, [
        updateSubTopicMutation.isLoading,
        updateSubTopicMutation.isError,
        updateSubTopicMutation.error,
    ]);


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
                    <span className="inline-block py-1 my-4 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                        SUBTOPIC
                    </span>

                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                        <h3 className="text-lg font-semibold text-gray-900 ">
                            {props.mode === 'add' ? 'Add New SubTopic' : 'Edit SubTopic'}
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
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
                    <div className='space-y-4'>
                        <div className="space-y-2">
                            <Label>Sub Topic Name</Label>
                            <Input
                                type="text"
                                placeholder="Enter Sub-Topic Name"
                                value={formData.subtopicName}
                                onChange={handleInputChange}
                                name="subtopicName"
                                isError={errors?.subtopicNameError.error}
                                errorMessage={errors?.subtopicNameError.message}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Topic Description</Label>
                            <TextArea
                                limit={300}
                                setTextArea={(text: string) => {
                                    handleInputChange("subtopicDescription", text)
                                }}
                                disabled={false}
                                value={formData.subtopicDescription}
                                isError={errors?.subtopicDescriptionError.error}
                                errorMessage={errors?.subtopicDescriptionError.message}
                            />
                        </div>

                        <div className="flex flex-row items-center  space-x-2">
                            <span className="text-sm text-gray-900">Active</span>

                            <Switcher
                                for={`${formData.subtopicName}`}
                                onChange={() => {
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        isActive: !prevFormData.isActive,
                                    }));
                                }}
                                togglevalue={formData.isActive}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <ButtonOutlined handleClick={() => {
                                if (formData.subtopicName !== "" || formData.subtopicDescription !== "") {
                                    setConfirmationModal(true)
                                }
                                else {
                                    props.setModal(false)
                                }
                            }}> Cancel</ButtonOutlined>
                            <ButtonFill handleClick={Submit}>
                                {props.mode === 'add' ? 'Add' : 'Update'} Sub
                                Topic</ButtonFill>
                        </div>
                    </div>
                </div>
                <ConfirmationModal
                    active={confirmationModal}
                    onCancel={() => {
                        setConfirmationModal(false)
                    }}
                    onConfirm={() => {
                        setConfirmationModal(false)
                        setFormData(
                            {
                                subtopicName: '',
                                subtopicDescription: '',
                                isActive: false
                            }
                        )
                        props.setModal(false);
                    }}
                    message={"Do you want to discard changes?"}
                />
                <MyToast />
            </div>
        </div>
    );
};

export default CreateSubTopicModal;