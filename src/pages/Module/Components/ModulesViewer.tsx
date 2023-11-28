import { useState } from "react";
import { Switcher } from "../../../components/UiComponents";
import {
    AddIcon, ErrorIcon, SettingDotsIcon,
    EditIcon, EyeIcon,
} from "../../../components/UiComponents/Icons";
import { showToast } from "../../../components/UiComponents/MyToast";
import CreateModuleModal from "./CreateModuleModal";
import { ConfirmationModal } from "../../../components/UiComponents";
import { useUpdateModuleStatus, useDeleteModule } from "../../../hooks";
import ViewModal from "./ViewModuleModal";
import Image from "../../../components/UiComponents/Image";
import IModule from "./Module.interface";


export const TableView: React.FC<{
    currentModule: IModule[]
    setModule: React.Dispatch<React.SetStateAction<IModule[]>>
}> = (
    {
        currentModule,
        setModule
    }) => {

        const [viewCrudOptions, setViewCrudOptions] = useState(false);
        const [activeRow, setActiveRow] = useState('');
        const [openCreateModuleModal, setModuleModal] = useState(false)

        const handleSettingClick = (id: string) => {
            setViewCrudOptions((prev) => !prev);
            setActiveRow(id);
        };

        const [confirmationModal, setConfirmationModal] = useState(false);
        const [confirmationModalType, setConfirmationModalType] = useState('');
        const [openViewModal, setOpenViewModal] = useState(false)
        const [toBeViewModules, setToBeViewModule] = useState<IModule>(
            {
                _id: '',
                moduleName: '',
                moduleImage: '',
                moduleDescription: '',
                isActive: false,
                imageAltText: ''
            }
        )

        const [deleteId] = useState('');
        const deleteModuleMutation = useDeleteModule()
        const HandleDelete = async () => {
            const body = {
                id: deleteId
            }
            const response = await deleteModuleMutation.mutateAsync(body)
            if (response) {
                showToast(
                    `Module Deleted Successfully`,
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

        const updateStatusMutation = useUpdateModuleStatus()
        const UpdateStatus = async (id: string, isActive: boolean) => {

            const body = {
                isActive: !isActive
            }
            const response = await updateStatusMutation.mutateAsync({
                id: id,
                body: body
            })
            if (response) {
                showToast(
                    `Module Status Updated Successfully`,
                    `success`,
                    <AddIcon />
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

        const ModulesPerPage = 10;
        const [currentPage, setCurrentPage] = useState(1);

        const handlePageChange = (page: number) => {
            setCurrentPage(page);
        };



        return (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full mb-20 text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-4">
                                    Module Name
                                </th>
                                <th scope="col" className="px-4 py-4 text-left">
                                    Description
                                </th>
                                <th scope="col" className="px-4 py-4 text-left">
                                    Module Image
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
                            {currentModule.slice((currentPage - 1) * ModulesPerPage, currentPage * ModulesPerPage)
                                .map((module) => ((

                                    <tr className="border-b" key={module._id}>
                                        <td className="px-4 py-3">{module.moduleName}</td>
                                        <td className="px-4 py-3 text-left">
                                            {module.moduleDescription}
                                        </td>
                                        <td className="px-4 py-3 text-left">
                                            {module.moduleImage ? (
                                                <Image
                                                    src={module.moduleImage.startsWith('https://') ? module.moduleImage : `https://${module.moduleImage}`}
                                                    size='xs'
                                                    disabled
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="mx-auto w-fit">
                                                <Switcher
                                                    for={module._id}
                                                    onChange={() => {
                                                        UpdateStatus(module._id, module.isActive)
                                                    }}
                                                    togglevalue={module.isActive}
                                                    size="small"
                                                />
                                            </div>
                                        </td>
                                        <td className="relative flex items-center justify-center px-4 py-3">
                                            <button
                                                id={`${module.moduleName}-dropdown-button`}
                                                data-dropdown-toggle={`${module.moduleName}-dropdown`}
                                                className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                                                type="button"
                                                onClick={() => {
                                                    handleSettingClick(module._id);
                                                }}
                                            >
                                                <SettingDotsIcon />
                                            </button>

                                            <div
                                                id={`${module.moduleName}-dropdown`}
                                                className={`${viewCrudOptions &&
                                                    activeRow === module._id
                                                    ? ''
                                                    : 'hidden'
                                                    }  w-44 bg-white rounded divide-y divide-gray-100 shadow absolute top-0 right-0 z-[100]`}
                                            >
                                                <ul
                                                    className="py-1 text-sm"
                                                    aria-labelledby={`${module.moduleName
                                                        }-dropdown-button`}
                                                >
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full px-4 py-2 space-x-2 text-gray-700 hover:bg-gray-100"
                                                            onClick={() => {
                                                                setOpenViewModal(true)
                                                                setToBeViewModule(prevState => ({
                                                                    ...prevState,
                                                                    _id: module._id,
                                                                    moduleName: module.moduleName || '',
                                                                    moduleDescription: module.moduleDescription || '',
                                                                    isActive: module.isActive,
                                                                    moduleImage: module.moduleImage ? `https://${module.moduleImage}` : '',
                                                                    imageAltText: module.imageAltText || ''
                                                                }));
                                                            }}
                                                        >
                                                            <EyeIcon />
                                                            <span> Preview</span>
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full px-4 py-2 space-x-2 text-gray-700 hover:bg-gray-100"
                                                            onClick={() => {
                                                                setModuleModal(true)
                                                                setToBeViewModule(prevState => ({
                                                                    ...prevState,
                                                                    _id: module._id,
                                                                    moduleName: module.moduleName || '',
                                                                    moduleDescription: module.moduleDescription || '',
                                                                    isActive: module.isActive,
                                                                    moduleImage: prevState.moduleImage,
                                                                    imageAltText: module.imageAltText || ''
                                                                }));
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
                                                        className="flex items-center w-full px-4 py-2 space-x-2 text-gray-700 hover:bg-gray-100"
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
                                                            className="items-center w-full px-4 py-2 text-red-500 flPex hover:bg-gray-100 "
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
                                    ? 'Are you sure you want to delete this modules?'
                                    : 'Are you sure you want to delete all modules?'
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
                        <CreateModuleModal
                            mode="edit"
                            active={openCreateModuleModal}
                            setModal={setModuleModal}
                            onCancel={() => {
                                setModuleModal(false)
                            }}
                            onConfirm={() => {
                                setModuleModal(false)
                            }}
                            module={toBeViewModules}
                            setModule={setModule}
                        />
                        <ViewModal
                            isOpen={openViewModal}
                            setIsOpen={setOpenViewModal}
                            module={toBeViewModules}
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
                            {currentPage * ModulesPerPage - ModulesPerPage + 1}
                        </span>
                        <span> of</span>
                        <span className="font-semibold text-gray-900">{currentModule.length}</span>
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
                        {Array.from({ length: Math.ceil(currentModule.length / ModulesPerPage) }).map((_, index) => (
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