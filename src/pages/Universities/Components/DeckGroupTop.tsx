
import { useState } from "react";
import { ButtonFill } from "../../../components/UiComponents";
import { AddIcon, SearchIcon } from "../../../components/UiComponents/Icons";
import Drawer from "../../../components/UiComponents/Drawer";
import AddDeckGroup from './AddDeckGroup'
interface DeckGroups {
    _id: string;
    groupName: string;
    groupSource: string;
    groupDescription: string;
}

interface AcademicYear {
    academicYear: string;
    deckgroups: DeckGroups[];
}


export const DeckGroupTop: React.FC<{
    searchQuery: string;
    handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    currentTab: string
    universityName: string
    setDeckgroups: React.Dispatch<React.SetStateAction<AcademicYear[] | undefined>>
}> = (
    {
        searchQuery,
        handleSearchQueryChange,
        currentTab,
        universityName,
        setDeckgroups
    }
) => {
        const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
                                onChange={handleSearchQueryChange}
                            />
                        </div>
                    </form>
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <ButtonFill
                        icon={<AddIcon />}
                        handleClick={() => {
                            setIsDrawerOpen(true)
                        }}
                    >
                        Add New Deck Group
                    </ButtonFill>
                </div>
                {isDrawerOpen && (
                    <Drawer
                        isOpen={isDrawerOpen}
                        setIsOpen={setIsDrawerOpen}
                        title="Add Deck Group"
                        size="lg"
                    >
                        <AddDeckGroup
                            AddingForm={setIsDrawerOpen}
                            currentTab={currentTab}
                            universityName={universityName}
                            setDeckgroups={setDeckgroups}
                        />
                    </Drawer>
                )}
            </div>
        )
    }

export default DeckGroupTop
