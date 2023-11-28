import {
    AddIcon,
    SearchIcon
} from "../../../../components/UiComponents/Icons";


export const TableTop: React.FC<{
    searchQuery: string;
    handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unsavedChanges: boolean;
    onClick: () => void;
}> = (
    {
        searchQuery,
        handleSearchQueryChange,
        onClick,
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
                                onChange={handleSearchQueryChange}
                            />
                        </div>
                    </form>
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <AddTopicButton handleClick={() => {
                        onClick()
                    }} />
                </div>
            </div>
        )
    }



export const AddTopicButton: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
    return (
        <button
            className={`relative flex h-10 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-primary-500 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
            onClick={handleClick}
        >
            <div
                className={`relative flex items-center space-x-3 text-white`}
            >
                <AddIcon />
                <span className=" text-base font-semibold">Add Topic</span>
            </div>
        </button>
    )
}

export default TableTop
