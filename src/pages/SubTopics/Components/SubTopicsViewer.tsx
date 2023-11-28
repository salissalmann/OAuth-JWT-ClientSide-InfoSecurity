import { useState } from "react";
import { Switcher } from "../../../components/UiComponents";
import {
    AddIcon, ErrorIcon, SettingDotsIcon,
    EditIcon, EyeIcon,
} from "../../../components/UiComponents/Icons";
import { showToast } from "../../../components/UiComponents/MyToast";
import { CreateSubTopicModal } from "./CreateSubTopicModal";
import { ConfirmationModal } from "../../../components/UiComponents";
import { useDeleteSubTopic, useUpdateStatus } from "../../../hooks";
import ViewModal from "./ViewSubTopicModal";
import { ISubTopic } from "../../../interfaces/SubTopics/subtopics.interface";

export const TableView: React.FC<{ currentSubTopics: ISubTopic[]; setSubTopics: React.Dispatch<React.SetStateAction<ISubTopic[]>> }> = ({ currentSubTopics, setSubTopics }) => {

    const TopicsPerPage = 10;
    const [viewCrudOptions, setViewCrudOptions] = useState(false);
    const [activeRow, setActiveRow] = useState('');
    const [openCreateSubTopicModal, setSubTopicModal] = useState(false)

    const handleSettingClick = (id: string) => {
        setViewCrudOptions((prev) => !prev);
        setActiveRow(id);
    };

    const [confirmationModal, setConfirmationModal] = useState(false);
    const [confirmationModalType, setConfirmationModalType] = useState('');
    const [openViewModal, setOpenViewModal] = useState(false)
    const [toBeViewSubTopics, setToBeViewSubTopic] = useState<ISubTopic>(
        {
            _id: '',
            subtopicName: '',
            subtopicDescription: '',
            isActive: false
        }
    )

    const [deleteId] = useState('');
    const deleteSubTopicMutation = useDeleteSubTopic()
    const HandleDelete = async () => {
        const body = {
            id: deleteId
        }
        const response = await deleteSubTopicMutation.mutateAsync(body)
        if (response) {
            showToast(
                `SubTopic Deleted Successfully`,
                `success`,
                <AddIcon />
            )
            setTimeout(
                () => {
                    window.location.reload()
                }, 1000
            )
        }
        else {
            showToast(
                `Something went wrong`,
                `error`,
                <ErrorIcon />
            )
        }
    }

    const updateStatusMutation = useUpdateStatus()
    const UpdateStatus = async (id: string, isActive: boolean) => {
        const body = {
            isActive: !isActive
        }
        const response = await updateStatusMutation.mutateAsync({
            id: id,
            body: body
        })
        console.log(response)
        if (response) {
            showToast(
                `SubTopic Status Updated Successfully`,
                `success`,
                <AddIcon />
            )
            setTimeout(
                () => {
                    window.location.reload()
                }, 1000
            )
        }
        else {
            showToast(
                `Something went wrong`,
                `error`,
                <ErrorIcon />
            )
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };




    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 mb-20">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-4">
                                SubTopic Name
                            </th>
                            <th scope="col" className="px-4 py-4 text-left">
                                Description
                            </th>
                            <th></th>
                            <th scope="col" className="px-4 py-4 text-center">
                                IsActive
                            </th>
                            <th scope="col" className="px-4 py-3 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSubTopics
                            .slice((currentPage - 1) * TopicsPerPage, currentPage * TopicsPerPage)
                            .map((subtopic: ISubTopic) => ((
                                <tr className="border-b" key={subtopic._id}>
                                    <td className="px-4 py-3">{subtopic.subtopicName}</td>
                                    <td className="px-4 py-3 text-left">
                                        {subtopic.subtopicDescription}
                                    </td>
                                    <td className="px-20"></td>
                                    <td className="px-4 py-3">
                                        <div className="mx-auto w-fit">
                                            <Switcher
                                                for={subtopic._id}
                                                onChange={() => {
                                                    UpdateStatus(subtopic._id, subtopic.isActive)
                                                }}
                                                togglevalue={subtopic.isActive}
                                                size="small"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 flex items-center justify-center relative">
                                        <button
                                            id={`${subtopic.subtopicName}-dropdown-button`}
                                            data-dropdown-toggle={`${subtopic.subtopicName}-dropdown`}
                                            className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                                            type="button"
                                            onClick={() => {
                                                handleSettingClick(subtopic._id);
                                            }}
                                        >
                                            <SettingDotsIcon />
                                        </button>
                                        <div
                                            id={`${subtopic.subtopicName}-dropdown`}
                                            className={`${viewCrudOptions &&
                                                activeRow === subtopic._id
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
                                                            setOpenViewModal(true)
                                                            setToBeViewSubTopic({
                                                                _id: subtopic._id,
                                                                subtopicName: subtopic.subtopicName,
                                                                subtopicDescription: subtopic.subtopicDescription,
                                                                isActive: subtopic.isActive
                                                            })
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
                                                            setSubTopicModal(true)
                                                            setToBeViewSubTopic({
                                                                _id: subtopic._id,
                                                                subtopicName: subtopic.subtopicName,
                                                                subtopicDescription: subtopic.subtopicDescription,
                                                                isActive: subtopic.isActive
                                                            })
                                                        }}
                                                    >
                                                        <EditIcon />
                                                        <span>Edit</span>
                                                    </button>
                                                </li>
                                                {/*
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                        onClick={() => {
                                                            setConfirmationModalType('delete');
                                                            setConfirmationModal(true);
                                                            setDeleteId(subtopic._id);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                        <span>Delete</span>
                                                    </button>
                                                </li>
                                                */}
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="flPex w-full items-center py-2 px-4 hover:bg-gray-100  text-red-500 "
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
                            ))
                            )}
                    </tbody>
                    <ConfirmationModal
                        active={confirmationModal}
                        message={
                            confirmationModalType === 'delete'
                                ? 'Are you sure you want to delete this subtopic?'
                                : 'Are you sure you want to delete all subtopics?'
                        }
                        onConfirm={() => {
                            setConfirmationModal(false);
                            setConfirmationModalType('');
                            HandleDelete()
                        }}
                        onCancel={() => {
                            setConfirmationModal(false);
                            setConfirmationModalType('');
                        }}
                    />
                    <CreateSubTopicModal
                        mode="edit"
                        active={openCreateSubTopicModal}
                        setModal={setSubTopicModal}
                        onCancel={() => {
                            setSubTopicModal(false)
                        }}
                        onConfirm={() => {
                            setSubTopicModal(false)
                        }}
                        subtopic={toBeViewSubTopics}
                        setSubTopics={setSubTopics}
                    />
                    <ViewModal
                        isOpen={openViewModal}
                        setIsOpen={setOpenViewModal}
                        subTopic={toBeViewSubTopics}
                        active={openViewModal}
                    />

                </table>
            </div>
            <nav
                className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                aria-label="Table navigation"
            >
                <span className="text-sm font-normal text-gray-500 space-x-2">
                    <span> Showing</span>
                    <span className="font-semibold text-gray-900 ">
                        {currentPage * TopicsPerPage - TopicsPerPage + 1}
                    </span>
                    <span> of</span>
                    <span className="font-semibold text-gray-900">{currentSubTopics.length}</span>
                </span>
                <ul className="inline-flex items-stretch -space-x-px">
                    <li>
                        <a
                            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover-text-gray-700"
                            onClick={() => handlePageChange(currentPage - 1)}                            >
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
                    {Array.from({ length: Math.ceil(currentSubTopics.length / TopicsPerPage) }).map((_, index) => (
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
                            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover-text-gray-700"
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
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
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

export default TableView