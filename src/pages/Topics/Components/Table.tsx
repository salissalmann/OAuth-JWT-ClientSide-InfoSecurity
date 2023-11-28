import React, { useEffect, useState } from "react";
import { Checkbox } from "../../../components/UiComponents";
import Badge from "../../../components/UiComponents/Badges";
import DropDown from "../../../components/UiComponents/DropDown";
import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    EyeIcon,
    LoadingIconFilled,
    SearchIcon,
    SettingDotsIcon,
    SuccessIcon,
    SaveIcon,
    ErrorIcon
} from "../../../components/UiComponents/Icons";
import MyToast, { showToast } from "../../../components/UiComponents/MyToast";
import { useFetchSubtopics, useFetchAllSubTopics, useAddSubtopicsToTopics, useRemoveSubtopicsFromTopic } from "../../../hooks";
import { Drawer } from "../../../components/UiComponents";
import { ConfirmationModal } from "../../../components/UiComponents/Modals";
import { ButtonOutlined } from "../../../components/UiComponents";



interface ISubTopics {
    _id?: string,
    subtopicId: string;
    subtopicName: string;
    subtopicDescription: string;
    isActive: boolean;
}

interface ITableProps {
    topicId: string;
}

const Table: React.FC<ITableProps> = ({ topicId }) => {
    const { data, isLoading } = useFetchSubtopics(topicId || '');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectStatus, setSelectStatus] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [toBeRemovedIds, setToBeRemovedIds] = useState<string[]>([]);
    const [permenentDelete, setPermenentDelete] = useState<string[]>([]);
    let filteredData: ISubTopics[] = [];
    let currentDecks: ISubTopics[] = [];
    const startIndex = (currentPage - 1) * 10 + 1;
    const endIndex = Math.min(currentPage * 10, filteredData.length);
    const subTopicsPerPage = 10;


    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (unsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave this page?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [unsavedChanges]);

    useEffect(() => {
        if (disabled) {
            setUnsavedChanges(false);
        } else {
            setUnsavedChanges(true);
        }
    }, [disabled]);


    const HandleDelete = (deckId: string) => {
        setToBeRemovedIds([...toBeRemovedIds, deckId]);
        setUnsavedChanges(true);
    }

    if (data && !isLoading) {
        filteredData = data.filter((subtopic: ISubTopics) => {
            if (permenentDelete.includes(`${subtopic.subtopicId}`)) {
                return false
            }
            const matchesSearch =
                subtopic.subtopicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                subtopic.subtopicDescription.toLowerCase().includes(searchQuery.toLowerCase());

            if (selectStatus === 'All') {
                return matchesSearch;
            } else if (selectStatus === 'Active') {
                return matchesSearch && subtopic.isActive;
            } else if (selectStatus === 'Not Active') {
                return matchesSearch && !subtopic.isActive;
            }

            return false;
        });

        currentDecks = filteredData.slice((currentPage - 1) * subTopicsPerPage, currentPage * subTopicsPerPage);
    }


    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSelectStatusChange = (selectedStatus: string) => {
        setSelectStatus(selectedStatus);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= Math.ceil(filteredData.length / subTopicsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    const HandleDisabled = () => {
        setDisabled(!disabled);
    };

    const [confirmationModal, setConfirmationModal] = useState(false);
    const [confirmationModalType, setConfirmationModalType] = useState('');

    const handleSaveChanges = () => {
        setConfirmationModal(false);
        setConfirmationModalType('');
        setDisabled(true);
        setToBeRemovedIds([]);
    };

    const handleBulkDelete = () => {
        setPermenentDelete([
            ...permenentDelete,
            ...toBeRemovedIds
        ])
        setToBeRemovedIds([])
        setConfirmationModal(false);
        setConfirmationModalType('');
    };


    const removeSubTopicsToTopicMutation = useRemoveSubtopicsFromTopic()
    const SaveChanges = async () => {
        if (permenentDelete.length < 1) {
            showToast('No Changes Made', 'info', <LoadingIconFilled />);
            return;
        }

        const response = await removeSubTopicsToTopicMutation.mutateAsync({ id: topicId, body: permenentDelete })
        if (response) {
            showToast('Changes Saved', 'success', <SuccessIcon />);
            setToBeRemovedIds([]);
            setUnsavedChanges(false);
        }
        else {
            showToast('Something went wrong', 'error', <ErrorIcon />);
        }
    };

    return (
        <>
            <section className="antialiased my-10">
                <div className="mx-auto">
                    <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                        <TableTop
                            searchQuery={searchQuery}
                            disabled={disabled}
                            setIsDrawerOpen={setIsDrawerOpen}
                            handleSearchQueryChange={handleSearchQueryChange}
                            HandleDisabled={HandleDisabled}
                            SaveChanges={SaveChanges}
                            unsavedChanges={unsavedChanges}
                            setUnsavedChanges={setUnsavedChanges}
                            confirmationModal={confirmationModal}
                            setConfirmationModal={setConfirmationModal}
                            confirmationModalType={confirmationModalType}
                            setConfirmationModalType={setConfirmationModalType}
                        />

                        <div className="flex items-end space-x-3 p-4">
                            <DropDown
                                label="Active Status"
                                options={["All", "Active", "Not Active"]}
                                onSelect={(selectedStatus: string | number) => handleSelectStatusChange(selectedStatus.toString())}
                                width="min-w-[12rem]"
                                value={selectStatus}
                                disabled={!disabled}

                            />
                            {!disabled && (
                                <ButtonOutlined
                                    margin={false}
                                    icon={<DeleteIcon />}
                                    disabled={toBeRemovedIds?.length < 1}
                                    handleClick={() => {
                                        setConfirmationModal(true);
                                        setConfirmationModalType('bulkDelete');
                                    }}
                                >
                                    Bulk Remove
                                </ButtonOutlined>
                            )}
                        </div>

                        <TableView
                            currentSubTopics={currentDecks}
                            disabled={disabled}
                            HandleDelete={HandleDelete}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            filteredData={filteredData}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            subTopicsPerPage={subTopicsPerPage}
                            toBeRemovedIds={toBeRemovedIds}
                            settoBeRemovedIds={setToBeRemovedIds}
                        />

                        <ConfirmationModal
                            active={confirmationModal}
                            message={
                                confirmationModalType === 'Save Changes'
                                    ? 'Are you sure you want to discard the changes?'
                                    :
                                    confirmationModalType === 'bulkDelete'
                                        ? 'Are you sure you want to remove the selected subtopics?'
                                        : ''
                            }
                            onConfirm={() =>
                                confirmationModalType === 'Save Changes'
                                    ? handleSaveChanges()
                                    : confirmationModalType === 'bulkDelete'
                                        ? handleBulkDelete()
                                        : ''
                            }
                            onCancel={() => {
                                if (confirmationModalType === 'Save Changes') {
                                    setConfirmationModal(false);
                                    setConfirmationModalType('');
                                    return
                                }
                                if (confirmationModalType === 'bulkDelete') {
                                    setConfirmationModal(false);
                                    setConfirmationModalType('');
                                    setToBeRemovedIds([])
                                    return
                                }
                                setConfirmationModal(false);
                                setConfirmationModalType('');
                                HandleDisabled()
                                setToBeRemovedIds([])
                            }}
                        />

                    </div>
                </div>
            </section>

            {isDrawerOpen &&
                <Drawer
                    isOpen={isDrawerOpen}
                    setIsOpen={setIsDrawerOpen}
                    title="Add Sub Topic"
                    size="lg"
                >
                    {data && !isLoading &&
                        <AddSubTopic
                            topicId={topicId}
                            setIsDrawerOpen={setIsDrawerOpen}
                            existingSubTopics={data}
                        />}
                </Drawer>}


        </>
    );
}



export const EditButton: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
    return (
        <button
            className={`relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
            onClick={handleClick}
        >
            <div
                className={`relative flex items-center space-x-3 text-gray-600`}
            >
                <EditIcon />
                <span className=" text-base font-semibold">Edit</span>
            </div>
        </button>
    )
}

export const SaveButton: React.FC<{ HandleDisabled: () => void, SaveChanges: () => void }> = ({ HandleDisabled, SaveChanges }) => {
    return (
        <button
            className={`relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-800 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
            onClick={() => {
                HandleDisabled()
                SaveChanges()
            }}
        >
            <div
                className={`relative flex items-center space-x-3 text-white`}
            >
                <DeleteIcon />
                <span className=" text-base font-semibold">Delete</span>
            </div>
        </button>
    )
}

export const AddNewDeckButton: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
    return (
        <button
            className={`relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-primary-500 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
            onClick={handleClick}
        >
            <div
                className={`relative flex items-center space-x-3 text-white`}
            >
                <AddIcon />
                <span className=" text-base font-semibold">Add New Subtopic</span>
            </div>
        </button>
    )
}

export const TableView: React.FC<{
    currentSubTopics: {
        subtopicId: string;
        subtopicName: string;
        subtopicDescription: string;
        isActive: boolean;
    }[];
    disabled: boolean;
    HandleDelete: (deckId: string) => void;
    startIndex: number;
    endIndex: number;
    filteredData: {
        subtopicId: string;
        subtopicName: string;
        subtopicDescription: string;
        isActive: boolean;
    }[];
    currentPage: number;
    handlePageChange: (newPage: number) => void;
    subTopicsPerPage: number;
    toBeRemovedIds: string[];
    settoBeRemovedIds: React.Dispatch<React.SetStateAction<string[]>>;
}> = (
    {
        currentSubTopics,
        disabled,
        startIndex,
        endIndex,
        filteredData,
        currentPage,
        handlePageChange,
        subTopicsPerPage,
        toBeRemovedIds,
        settoBeRemovedIds
    }) => {

        const [viewCrudOptions, setViewCrudOptions] = useState(false);
        const [activeRow, setActiveRow] = useState('');

        const handleSettingClick = (id: string) => {
            setViewCrudOptions((prev) => !prev);
            setActiveRow(id);
        };


        return (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 mb-20">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-4">
                                    Select
                                </th>
                                <th scope="col" className="px-4 py-4">
                                    Name
                                </th>
                                <th scope="col" className="px-4 py-4">
                                    Description
                                </th>
                                <th scope="col" className="px-4 py-4 text-center">
                                    IsActive
                                </th>
                                <th scope="col" className="px-4 py-3 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSubTopics.map((subtopic) => (
                                <tr className="border-b" key={subtopic.subtopicId}>
                                    <td
                                        scope="row"
                                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        <Checkbox
                                            for={subtopic.subtopicId}
                                            showLabel={false}
                                            checked={
                                                toBeRemovedIds.includes(subtopic.subtopicId)

                                            }
                                            disabled={disabled}
                                            onChange={(checked) => {
                                                settoBeRemovedIds((prev) =>
                                                    checked
                                                        ? [...prev, subtopic.subtopicId]
                                                        : prev.filter(
                                                            (id) => id !== subtopic.subtopicId
                                                        )
                                                )
                                            }
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-3">{subtopic.subtopicName}</td>
                                    <td className="px-4 py-3 max-w-[12rem] truncate">
                                        {subtopic.subtopicDescription}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="mx-auto w-fit">
                                            {/*
                                            <Switcher
                                                for={deck.deckId}
                                                onChange={() => { ChangeDeckStatus(deck.deckId, !deck.isPublished, deck.isPremium) }}
                                                disabled={disabled}
                                                togglevalue={deck.isPublished}
                                                size="small"
                            />*/}
                                            <Badge type={subtopic.isActive ?
                                                "success" :
                                                "error"}
                                                label={subtopic.isActive ?
                                                    "Active" :
                                                    "Not Active"} />

                                        </div>
                                    </td>
                                    <td className="px-4 py-3 flex items-center justify-center relative">
                                        <button
                                            id={`${subtopic.subtopicName}-dropdown-button`}
                                            data-dropdown-toggle={`${subtopic.subtopicName}-dropdown`}
                                            className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                                            type="button"
                                            onClick={() => {
                                                handleSettingClick(subtopic.subtopicId);
                                            }}
                                        >
                                            <SettingDotsIcon />
                                        </button>
                                        <div
                                            id={`${subtopic.subtopicName}-dropdown`}
                                            className={`${viewCrudOptions &&
                                                activeRow === subtopic.subtopicId
                                                ? ''
                                                : 'hidden'
                                                }  w-44 bg-white rounded divide-y divide-gray-100 shadow absolute top-0 right-0 z-[100]`}
                                        >
                                            <ul
                                                className="py-1 text-sm"
                                                aria-labelledby={`${subtopic.subtopicName
                                                    }-dropdown-button`}
                                            >
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                        onClick={() => {
                                                            handleSettingClick('');
                                                            window.open(
                                                                `/subtopic`,
                                                                '_blank'
                                                            )
                                                        }}
                                                    >
                                                        <EyeIcon />
                                                        <span> Preview</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                        onClick={() => {
                                                            if (!disabled) {
                                                                settoBeRemovedIds((prev) =>
                                                                    [...prev, subtopic.subtopicId]
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                        <span>Remove</span>
                                                    </button>
                                                </li>

                                                <li>
                                                    <button
                                                        type="button"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-red-500 "
                                                        onClick={() => {
                                                            handleSettingClick('');
                                                        }}
                                                    >
                                                        <span>Close</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <nav
                    className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                    aria-label="Table navigation"
                >
                    <span className="text-sm font-normal text-gray-500 space-x-2">
                        <span> Showing</span>
                        <span className="font-semibold text-gray-900 ">
                            {startIndex < 10 ?
                                `${startIndex} - ${currentSubTopics.length}`
                                :
                                `${startIndex} - ${endIndex}`
                            }
                        </span>
                        <span> of</span>
                        <span className="font-semibold text-gray-900">{currentSubTopics.length}</span>
                    </span>
                    <ul className="inline-flex items-stretch -space-x-px">
                        <li>
                            <a
                                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover-text-gray-700"
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <span className="sr-only">Previous</span>
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </li>
                        {Array.from({ length: Math.ceil(filteredData.length / subTopicsPerPage) }).map((_, index) => (
                            <li key={index}>
                                <a
                                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover-bg-gray-100 ${currentPage === index + 1 ? 'font-semibold text-primary-600 bg-primary-50' : ''}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a
                                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover-bg-gray-100"
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <span className="sr-only">Next</span>
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010-1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </>
        )
    }

interface FilteredSubTopics {
    _id: string;
    subtopicName: string;
    subtopicDescription: string;
    isActive: boolean;
}

export const TableTop: React.FC<{
    searchQuery: string;
    disabled: boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    HandleDisabled: () => void;
    SaveChanges: () => void;
    unsavedChanges: boolean;
    setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
    confirmationModal: boolean;
    setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
    confirmationModalType: string;
    setConfirmationModalType: React.Dispatch<React.SetStateAction<string>>;
}> = (
    {
        searchQuery,
        disabled,
        setIsDrawerOpen,
        handleSearchQueryChange,
        HandleDisabled,
        SaveChanges,
        unsavedChanges,
        setConfirmationModal,
        setConfirmationModalType
    }
) => {
        return (
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                        <label htmlFor="simple-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon color="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                                placeholder="Search"
                                required={true}
                                value={searchQuery}
                                disabled={!disabled}
                                onChange={handleSearchQueryChange}
                            />
                        </div>
                    </form>
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    {disabled ? <EditButton handleClick={HandleDisabled} /> :
                        <>
                            <div className="flex items-center space-x-4">
                                <CancelButton
                                    setDisabled={HandleDisabled}
                                    disabled={disabled}
                                    callBack={() => {
                                        setConfirmationModal(true)
                                        setConfirmationModalType('Save Changes')
                                    }}
                                />
                                <SaveButton2
                                    setDisabled={HandleDisabled}
                                    disabled={disabled}
                                    callBack={() => {
                                        HandleDisabled()
                                        SaveChanges()
                                    }}
                                />
                            </div>

                        </>}
                    <AddNewDeckButton handleClick={() => {
                        if (unsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                            return
                        }
                        setIsDrawerOpen(true)
                    }} />
                </div>
            </div>
        )
    }


interface AddSubtopicProps {
    topicId: string;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    existingSubTopics: {
        subtopicId: string;
        subtopicName: string;
        subtopicDescription: string;
        isActive: boolean;
    }[];
}

export const AddSubTopic = (props: AddSubtopicProps) => {
    const { data, isLoading } = useFetchAllSubTopics();
    const [subtopics, setSubtopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [toBeAdded, setToBeAdded] = useState<string[]>([]);
    const [confirmationModal, setConfirmationModal] = useState(false)


    useEffect(() => {
        if (data && !isLoading) {
            const filteredSubtopics = data.body.subtopics.filter((subtopic: ISubTopics) => {
                if (props.existingSubTopics.some((existingSubtopic) => existingSubtopic.subtopicId === subtopic._id)) {
                    return false
                }
                return true
            })
            setSubtopics(filteredSubtopics)
        }
    }, [data, isLoading]);

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    let filteredSubtopics: ISubTopics[] = [];
    if (data && !isLoading) {
        filteredSubtopics = subtopics.filter((subtopic: ISubTopics) => {
            if (subtopic.subtopicName) {
                return subtopic.subtopicName.toLowerCase().includes(searchQuery.toLowerCase())
            }
        }
        );
    }

    const addSubTopicsToTopicMutation = useAddSubtopicsToTopics()
    const addSelectedSubtopics = async () => {
        const response = await addSubTopicsToTopicMutation.mutateAsync({ id: props.topicId, body: toBeAdded })
        if (response) {
            showToast(
                "Subtopics Added Successfully",
                "success",
                <SuccessIcon />
            )
            setTimeout((
            ) => {
                props.setIsDrawerOpen(false)
            }, 1000)

        }
        else {
            showToast(

                "Subtopics Added Failed",
                "error",
                <SuccessIcon />
            )
        }
    }


    return (
        <>
            <div>
                <form className="flex items-center">
                    <label htmlFor="simple-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon color="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="simple-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                            placeholder="Search"
                            required={true}
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                        />
                    </div>
                </form>
                <div className="overflow-x-auto">
                    <h3 className="pt-4 pb-4">Search Results</h3>
                    <table className="w-full text-sm text-left text-gray-500 mb-20">
                        <tbody>
                            {filteredSubtopics.map((subtopic: ISubTopics) => (
                                <tr className="border-b" key={subtopic._id}>
                                    <td
                                        scope="row"
                                        className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        <Checkbox
                                            for={subtopic._id || ''}
                                            showLabel={false}
                                            checked={toBeAdded.includes(subtopic._id || '') ||
                                                props.existingSubTopics.some((existingSubtopic) => existingSubtopic.subtopicId === subtopic._id)
                                            }
                                            disabled={
                                                props.existingSubTopics.some((existingSubtopic) => existingSubtopic.subtopicId === subtopic._id)
                                            }
                                            onChange={(checked) => {
                                                setToBeAdded((prev) =>
                                                    checked
                                                        ? [...prev, subtopic._id || '']
                                                        : prev.filter((id) => id !== subtopic._id)
                                                );
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-3">{(subtopic as FilteredSubTopics).subtopicName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex flex-row gap-6 items-center justify-end mt-1">
                        <button
                            className="bg-white-500 bg-opacity-100 text-gray rounded p-2 pr-3  w-1/4 border border-gray-300
                    hover:bg-white hover:text-gray-500 hover:border hover:border-gray-500"
                            onClick={() => {
                                if (toBeAdded.length > 0) {
                                    setConfirmationModal(true)
                                }
                                else {
                                    props.setIsDrawerOpen(false)
                                }
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-primary-500 bg-opacity-100 text-white rounded p-2  w-1/4 border border-primary hover:bg-white hover:text-primary hover:border hover:border-primary"
                            onClick={() => {
                                addSelectedSubtopics();
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <MyToast />

                    <ConfirmationModal
                        active={confirmationModal}
                        message={
                            "Are you sure you want to discard the changes?"
                        }
                        onConfirm={() =>
                            props.setIsDrawerOpen(false)
                        }
                        onCancel={() => {
                            setConfirmationModal(false);
                        }}
                    />

                </div>
            </div>
        </>
    );
};

interface IActionButton {
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    disabled: boolean;
    callBack?: () => void;
}

export const CancelButton: React.FC<IActionButton> = (props) => {
    return (
        <button
            className={`relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
            onClick={() => {
                // props.setDisabled(!props.disabled);
                props.callBack && props.callBack();
            }}
        >
            <div
                className={`relative flex items-center space-x-3
   text-gray-600`}
            >
                <EditIcon />
                <span className=" text-base font-semibold">Cancel</span>
            </div>
        </button>
    );
};

export const SaveButton2: React.FC<IActionButton> = (props) => {
    return (
        <button
            className={`relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-800 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
            onClick={() => {
                props.callBack && props.callBack();
            }}
        >
            <div className="relative flex items-center space-x-3 text-white">
                <SaveIcon />
                <span className=" text-base font-semibold">Save</span>
            </div>
        </button>
    );
};

export default Table;
