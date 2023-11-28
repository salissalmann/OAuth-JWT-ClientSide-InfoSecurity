import { useEffect, useState } from "react";
import { DropDown } from "../../components/UiComponents";
import MyToast from "../../components/UiComponents/MyToast";
import TableTop from "./Components/DisciplineHeader";
import TableView from "./Components/DisciplineViewer";
import { useFetchAllDiscipline } from "../../services/query";
import { LoadingIconFilled } from "../../components/UiComponents/Icons";
import { IDiscipline } from "../../interfaces/Discipline/discipline.interface";


const ManageDiscipline = () => {
    const { data, isLoading, isError } = useFetchAllDiscipline();
    const [discipline, setDiscipline] = useState<IDiscipline[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectStatus, setSelectStatus] = useState('All');
    const [unsavedChanges] = useState(false);

    useEffect(() => {
        if (data && !isLoading) {
            setDiscipline(data.body.disciplines)
        }
    }, [data])


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


    const updateFilteredData = () => {
        if (!data) return
        const NewData = data.body.disciplines.filter((discipline: IDiscipline) => {
            if (!discipline.disciplineName || !discipline.disciplineDescription)
                return false

            const matchesSearch =
                discipline.disciplineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                discipline.disciplineDescription.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
        })
        setDiscipline(NewData)
    };

    useEffect(updateFilteredData, [searchQuery, data]);


    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            setDiscipline(data.body.disciplines)
            return
        }
    };



    useEffect(() => {
        if (selectStatus === "Active" && data) {
            const filteredSubTopics = data.body.disciplines.filter((subtopic: IDiscipline) => {
                return subtopic.isActive;
            });
            setDiscipline(filteredSubTopics);
        } else if (selectStatus === "InActive" && data) {
            const filteredSubTopics = data.body.disciplines.filter((subtopic: IDiscipline) => {
                return !subtopic.isActive;
            });
            setDiscipline(filteredSubTopics);
        } else if (data) {
            setDiscipline(data.body.disciplines);
        }
    }, [selectStatus])

    const handleSelectStatusChange = (selectedStatus: string) => {
        setSelectStatus(selectedStatus);
    };


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
                <MyToast />
                <div className="flex items-center justify-between mt-5 pb-1">
                    <h2 className="text-lg font-bold text-gray-900">Discipline</h2>
                </div>
                <section className="antialiased my-5">
                    <div className="mx-auto">
                        <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                            <TableTop
                                searchQuery={searchQuery}
                                handleSearchQueryChange={handleSearchQueryChange}
                                setDiscipline={setDiscipline}
                            />
                            <div className="flex items-center space-x-3 p-4">
                                <DropDown
                                    label="Active Status"
                                    options={["All", "Active", "InActive"]}
                                    onSelect={(selectedStatus: string | number) => handleSelectStatusChange(selectedStatus.toString())}
                                    width="min-w-[12rem]"
                                    value={selectStatus}
                                />
                            </div>

                            <TableView
                                currentDiscipline={discipline}
                                setDiscipline={setDiscipline}

                            />

                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}








export default ManageDiscipline



