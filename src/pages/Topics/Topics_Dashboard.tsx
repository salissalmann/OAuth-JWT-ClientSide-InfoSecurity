import { useEffect, useState } from "react";
import { DropDown } from "../../components/UiComponents";
import {
    LoadingIconFilled
} from "../../components/UiComponents/Icons";
import { useFetchAllTopics } from "../../hooks";
import { ITopics } from "../../interfaces/Topics/topics.interface";
import CreateTopicModal from "./Components/CreateTopicModal";
import TableTop from "./Components/ManageTopic/ManageTableHeader";
import TableView from "./Components/ManageTopic/ManageTableView";


const ManageDashboard = () => {
    const { data, isLoading, isError } = useFetchAllTopics()
    const [OpenModal, setOpenModal] = useState(false)
    const HandleModal = () => { setOpenModal(!OpenModal) }

    const [topics, setTopics] =
        useState<ITopics[]>([
            {
                _id: '',
                topicName: '',
                topicImage: '',
                topicDescription: '',
                subtopicIds: [],
                isActive: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);

    useEffect(() => {
        if (!isLoading && !isError && data) {
            setTopics(data.body.topics);
        }
    }, [isLoading, isError, data]);


    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectStatus, setSelectStatus] = useState<string>('All');
    const [unsavedChanges] = useState<boolean>(false);


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
        if (data && !isLoading) {
            const filteredData = data.body.topics.filter((topic: ITopics) => {
                const matchesSearch =
                    topic.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    topic.topicDescription.toLowerCase().includes(searchQuery.toLowerCase());

                if (selectStatus === 'All') {
                    return matchesSearch;
                } else if (selectStatus === 'Active') {
                    return matchesSearch && topic.isActive;
                } else if (selectStatus === 'Not Active') {
                    return matchesSearch && !topic.isActive;
                }

                return false;
            });
            setTopics(filteredData)
        }
    }, [searchQuery, selectStatus, data, isLoading])

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

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
                <h3 className="
                text-2xl font-bold text-gray-900
                ">Topics</h3>
                <section className="antialiased my-10">
                    <div className="mx-auto">
                        <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                            <TableTop

                                searchQuery={searchQuery}
                                handleSearchQueryChange={handleSearchQueryChange}
                                unsavedChanges={unsavedChanges}
                                onClick={HandleModal}
                            />

                            <div className="flex items-center space-x-3 p-4">
                                <DropDown
                                    label="Active Status"
                                    options={["All", "Active", "Not Active"]}
                                    onSelect={(selectedStatus: string | number) => handleSelectStatusChange(selectedStatus.toString())}
                                    width="min-w-[12rem]"
                                    value={selectStatus}
                                />
                            </div>

                            <TableView
                                currentTopics={topics}
                            />

                        </div>
                    </div>
                </section>
            </div>

            <CreateTopicModal
                active={OpenModal}
                setModal={() => {
                    if (unsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                        return
                    }
                    HandleModal()
                }}
                onCancel={() => {
                    if (unsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave this page?")) {
                        return
                    }
                    HandleModal()
                }}
                onConfirm={HandleModal}
                setTopics={setTopics}
            />
        </>
    )
}


export default ManageDashboard