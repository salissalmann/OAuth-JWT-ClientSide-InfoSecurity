
import { useState } from "react";
import Badge from "../../../../components/UiComponents/Badges";
import {
    EyeIcon,
    ManageIcon,
    SettingDotsIcon
} from "../../../../components/UiComponents/Icons";
import Image from "../../../../components/UiComponents/Image";
import { ConfirmationModal } from "../../../../components/UiComponents/Modals";
import MyToast from "../../../../components/UiComponents/MyToast";
import { ITopics } from "../../../../interfaces/Topics/topics.interface";



export const TableView: React.FC<{
    currentTopics: ITopics[];
}> = (
    {
        currentTopics,
    }) => {


        const TopicsPerPage = 10;
        const [viewCrudOptions, setViewCrudOptions] = useState(false);
        const [activeRow, setActiveRow] = useState('');
        const [confirmationModal, setConfirmationModal] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);

        const handleSettingClick = (id: string) => {
            setViewCrudOptions((prev) => !prev);
            setActiveRow(id);
        };

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
                                    Topic Name
                                </th>
                                <th scope="col" className="px-4 py-4">
                                    Topic Description
                                </th>
                                <th scope="col" className="px-4 py-3 text-center">
                                    SubTopics
                                </th>
                                <th scope="col" className="px-4 py-4 text-center">
                                    Image
                                </th>
                                <th scope="col" className="px-4 py-4 text-center">
                                    IsActive
                                </th>
                                <th scope="col" className="px-4 py-4 text-center">
                                    Manage
                                </th>
                                <th scope="col" className="px-4 py-3 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <MyToast />
                        <tbody>
                            {currentTopics
                                .slice((currentPage - 1) * TopicsPerPage, currentPage * TopicsPerPage)
                                .map((topic) => ((
                                    <tr className="border-b" key={topic._id}>
                                        <td className="px-4 py-3">{topic.topicName}</td>
                                        <td className="px-4 py-3 max-w-[12rem] truncate">
                                            {topic.topicDescription}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {topic.subtopicIds.length}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center">
                                                {topic.topicImage ? (
                                                    <Image
                                                        src={topic.topicImage.startsWith('https://') ? topic.topicImage : `https://${topic.topicImage}`}
                                                        size='xs'
                                                        disabled
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="mx-auto w-fit">
                                                <Badge type={topic.isActive ?
                                                    "success" :
                                                    "error"}
                                                    label={topic.isActive ?
                                                        "Active" :
                                                        "Not Active"} />

                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center">
                                                <ManageIcon
                                                    onClick={() => {
                                                        window.open(`/topic/${topic._id}`, '_blank');
                                                    }}
                                                    color="#007CFF"
                                                    size="w-6 h-6"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 flex items-center justify-center relative">
                                            <button
                                                id={`${topic.topicImage}-dropdown-button`}
                                                data-dropdown-toggle={`${topic.topicName}-dropdown`}
                                                className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                                                type="button"
                                                onClick={() => {
                                                    handleSettingClick(topic._id);
                                                }}
                                            >
                                                <SettingDotsIcon />
                                            </button>
                                            <div
                                                id={`${topic.topicName}-dropdown`}
                                                className={`${viewCrudOptions &&
                                                    activeRow === topic._id
                                                    ? ''
                                                    : 'hidden'
                                                    }  w-44 bg-white rounded divide-y divide-gray-100 shadow absolute top-0 right-0 z-[100]`}
                                            >
                                                <ul
                                                    className="py-1 text-sm"
                                                    aria-labelledby={`${topic.topicName
                                                        }-dropdown-button`}
                                                >
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                            onClick={() => {
                                                                window.open(`/topic/${topic._id}`, '_blank');
                                                            }}
                                                        >
                                                            <EyeIcon />
                                                            <span> Preview</span>
                                                        </button>
                                                    </li>
                                                    {/*
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                        onClick={() => {
                                                            setConfirmationModal(true);
                                                            setConfirmationModalType('Delete');
                                                            setdeleteId(topic._id)
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                        <span>Remove</span>
                                                    </button>
                                                </li>
                                                */}
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-red-500 "
                                                            onClick={() => {
                                                                handleSettingClick("");
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
                            message="Are you sure you want to delete this topic?"
                            onCancel={() => {
                                setConfirmationModal(false);
                            }}
                            onConfirm={() => {
                                setConfirmationModal(false);
                                //                                HandleDelete(deleteId);
                            }}
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
                        <span className="font-semibold text-gray-900">{currentTopics.length}</span>
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
                        {Array.from({ length: Math.ceil(currentTopics.length / TopicsPerPage) }).map((_, index) => (
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

export default TableView;
