
import { useState } from "react";
import { ButtonFill } from "../../../components/UiComponents";
import { AddIcon, SearchIcon } from "../../../components/UiComponents/Icons";
import CreateModuleModal from "./CreateModuleModal";
import IModule from "./Module.interface";

export const TableTop: React.FC<{
    searchQuery: string;
    handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setModule: React.Dispatch<React.SetStateAction<IModule[]>>
}> = (
    {
        searchQuery,
        handleSearchQueryChange,
        setModule
    }
) => {

        const [openCreateModuleModal, setModuleModal] = useState(false)


        return (
            <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
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
                                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Search"
                                required={true}
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                            />
                        </div>
                    </form>
                </div>
                <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                    <ButtonFill
                        icon={<AddIcon />}
                        handleClick={() => {
                            setModuleModal(true)
                        }}
                    >
                        Add Module
                    </ButtonFill>
                </div>
                <CreateModuleModal
                    mode="add"
                    active={openCreateModuleModal}
                    setModal={setModuleModal}
                    onCancel={() => {
                        setModuleModal(false)
                    }}
                    onConfirm={() => {
                        setModuleModal(false)
                    }}
                    setModule={setModule}
                />

            </div>
        )
    }

export default TableTop
