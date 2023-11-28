
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Banner from "./Components/Banner";
import EditTopic from "./Components/EditTopic";
import SubTopicTable from "./Components/Table";
import { useFetchTopic, useUpdateTopic } from "../../hooks";
import { SaveIcon, EditIcon, ErrorIcon } from "../../components/UiComponents/Icons";
import MyToast, { showToast } from "../../components/UiComponents/MyToast";
import { ConfirmationModal } from "../../components/UiComponents";
import { ITopic } from "../../interfaces/Topics/topics.interface";
import { LoadingIconFilled } from "../../components/UiComponents/Icons";


const ManageTopics = () => {
    const { topicId } = useParams();
    const { data, isLoading, isError } = useFetchTopic(topicId ? topicId : '');


    const [disabled, setDisabled] = useState(true)
    const [originaltopicCopy, setOriginalTopicCopy] = useState<ITopic>({
        id: '',
        topicName: '',
        topicImage: '',
        topicDescription: '',
        subtopicIds: [],
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [topic, setTopic] = useState<ITopic>({
        id: '',
        topicName: '',
        topicImage: '',
        topicDescription: '',
        subtopicIds: [],
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    useEffect(() => {
        if (!isLoading && !isError && data) {
            setTopic({
                id: data._id,
                topicName: data.topicName,
                topicImage: data.topicImage,
                topicDescription: data.topicDescription,
                subtopicIds: data.subtopicIds,
                isActive: data.isActive,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            });
            setOriginalTopicCopy({
                id: data._id,
                topicName: data.topicName,
                topicImage: data.topicImage,
                topicDescription: data.topicDescription,
                subtopicIds: data.subtopicIds,
                isActive: data.isActive,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            });
        }
    }, [isLoading, isError, data]);


    const HandleDisabled = () => { setDisabled(!disabled) }
    const UpdateTopicMutation = useUpdateTopic()

    const initialErrorState = {
        topicNameError: {
            error: false,
            message: '',
        },
        topicDescriptionError: {
            error: false,
            message: '',
        },
    }

    const [errors, setErrors] = useState(initialErrorState)

    const validateForm = () => {
        const newErrors = { ...errors };
        let isError = false;

        if (topic.topicName === '') {
            newErrors.topicNameError.error = true;
            newErrors.topicNameError.message = 'Topic name is required';
            isError = true;
        }
        else {
            newErrors.topicNameError = {
                error: false,
                message: '',
            };
        }
        if (topic.topicDescription === '') {
            newErrors.topicDescriptionError.error = true;
            newErrors.topicDescriptionError.message = 'Topic description is required';
            isError = true;
        }
        else {
            newErrors.topicDescriptionError = {
                error: false,
                message: '',
            };
        }
        setErrors(newErrors);
        return isError;
    };

    useEffect(() => {
        validateForm();
    }, [topic]);

    const EditTopicDetails = async () => {
        if (originaltopicCopy.topicName === topic.topicName && originaltopicCopy.topicDescription === topic.topicDescription && originaltopicCopy.isActive === topic.isActive) {
            return
        }
        if (validateForm()) {
            setDisabled(false)
            return
        }
        const body = {
            id: topic.id,
            topicName: topic.topicName,
            topicDescription: topic.topicDescription,
            isActive: topic.isActive,
        }
        try {
            const Response = await UpdateTopicMutation.mutateAsync({ body })
            if (Response.status) {
                setDisabled(!disabled)
                showToast(
                    "Successfully Updated Topic Details",
                    "success",
                    <SaveIcon />
                )
            }
            else {
                showToast(
                    "Error in Updating Topic Details",
                    "error",
                    <ErrorIcon />
                )
            }
        }
        catch (err) {
            showToast(
                "Error in Updating Topic Details",
                "error",
                <ErrorIcon />
            )
        }
    }

    if (!isLoading && isError) {
        return (
            <div className="w-screen mt-52 flex items-center justify-center rela">
                <h1 className="text-gray-800 text-3xl">Sorry!, We are unavailable right now</h1>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="w-screen mt-52 flex items-center justify-center">
                <div role="status" className="flex items-center space-x-2">
                    <span className="relative text-3xl font-semibold text-gray-700 flex items-center space-x-3">
                        Loading
                    </span>
                    <LoadingIconFilled />
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="w-full pb-20">
                <Banner
                    category="Topic"
                    heading={`Topic: ${topic.topicName}`}
                    description={topic.topicDescription}
                    image={topic.topicImage}
                    isPicture={true}
                    disabled={disabled}
                    isActive={topic.isActive}
                    topic={topic}
                    setTopic={setTopic}
                />

                <Heading
                    heading="Topic Details"
                    handleDisabled={HandleDisabled}
                    disabled={disabled}
                    handleSave={EditTopicDetails}
                    setTopic={setTopic}
                    topic={topic}
                    originalTopic={originaltopicCopy}
                />

                <EditTopic
                    topic={topic}
                    setTopic={setTopic}
                    disabled={disabled}
                    errors={errors}
                />

                <SubTopicTable
                    topicId={topic.id}
                />


                <MyToast />


            </div>

        </>
    )
}

const Heading: React.FC<{
    heading: string;
    handleDisabled: () => void;
    disabled: boolean
    handleSave: () => void;
    setTopic: (data: ITopic) => void;
    topic: ITopic;
    originalTopic: ITopic;
}> = ({ heading, handleDisabled, disabled,
    handleSave: HandleSave,
    topic,
    setTopic,
    originalTopic
}) => {
        const [confirmationModal, setConfirmationModal] = useState(false)


        return (
            <div className="flex items-center justify-between mt-5 border-b pb-2">
                <h2 className="text-lg font-medium text-gray-900">{heading}</h2>
                {disabled ? (
                    <>
                        <button
                            className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                            onClick={handleDisabled}
                        >
                            <div
                                className={`relative flex items-center space-x-3
                  text-gray-600`}
                            >
                                <EditIcon />
                                <span className=" text-base font-semibold">
                                    Edit
                                </span>
                            </div>
                        </button>
                    </>
                ) : (
                    <>
                        <div className="
                flex items-center justify-between mt-5 border-b pb-2 gap-5
                ">
                            <button
                                className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                                onClick={() => {
                                    if (
                                        originalTopic.topicName === topic.topicName &&
                                        originalTopic.topicDescription === topic.topicDescription &&
                                        originalTopic.isActive === topic.isActive &&
                                        originalTopic.topicImage === topic.topicImage
                                    ) {
                                        handleDisabled()
                                        return
                                    }
                                    setConfirmationModal(true)
                                }}
                            >
                                <div
                                    className={`relative flex items-center space-x-3
                  text-gray-800`}
                                >
                                    <EditIcon />
                                    <span className=" text-base font-semibold">Cancel</span>
                                </div>
                            </button>
                            <button
                                className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-800 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                                onClick={() => {
                                    handleDisabled();
                                    HandleSave();
                                }}
                            >
                                <div className={`relative flex items-center space-x-3 text-white`}>
                                    <SaveIcon />
                                    <span className=" text-base font-semibold">Save</span>
                                </div>
                            </button>
                        </div>

                        <ConfirmationModal
                            active={confirmationModal}
                            message={
                                "Are you sure you want to discard the changes?"
                            }
                            onConfirm={() => {
                                setConfirmationModal(false)
                                setTopic(originalTopic)
                                handleDisabled()
                            }}
                            onCancel={() => {
                                setConfirmationModal(false)
                            }}
                        />

                    </>
                )}
            </div>
        )
    }





export default ManageTopics



