import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Checkbox } from "../../../components/UiComponents";
import {
    SearchIcon
} from "../../../components/UiComponents/Icons";
import { ConfirmationModal } from "../../../components/UiComponents/Modals";
import MyToast, { showToast } from "../../../components/UiComponents/MyToast";
import { useFetchAllDiscipline, useFetchAllModules, useFetchAllSubTopics, useFetchAllTopics } from "../../../hooks";
import { AddCurriculum, fetchCurriculumById } from "../../../services/api/curriculumApi";
import { ITopic } from "../../Decks/Interfaces";




interface SubTopic {
    _id: string;
    subtopicName: string;
    subtopicDescription: string;
}

interface Topic {
    topicId: {
        _id: string;
        topicName: string;
        topicDescription: string;
    };
    subTopics: SubTopic[];
}

interface Discipline {
    disciplineId: {
        _id: string;
        disciplineName: string;
        disciplineDescription: string;
    };
    topics: Topic[];
}

interface Module {
    moduleId: {
        _id: string;
        moduleName: string;
        moduleDescription: string;
    };
    disciplines: Discipline[];
}

interface AcademicYear {
    academicYear: string;
    curriculum: Module[];
}


interface IModules {
    _id: string;
    moduleName: string;
}

interface IDiscipline {
    _id: string;
    disciplineName: string;
}

interface ITopics {
    _id: string;
    topicName: string;
}

interface ISubTopics {
    _id: string;
    subtopicName: string;
}

//////////////////////////////////////////////////

interface TTransformedTopic {
    topicId: string;
    subTopics: string[];
}

interface TransformedDiscipline {
    disciplineId: string;
    topics: TTransformedTopic[];
}

interface TransformedModule {
    moduleId: string;
    disciplines: TransformedDiscipline[];
}

interface TransformedObject {
    curriculum: TransformedModule[];
}



interface DrawerProps {
    type: string;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    Curriculum?: Module[]
    selectedTab: string
    moduleId?: string,
    disciplineId?: string,
    topicId?: string,
    setCurriculum: React.Dispatch<React.SetStateAction<AcademicYear[] | undefined>>
}

export const AddChild = (props: DrawerProps) => {
    const { id } = useParams()
    const [Modules, setModules] = useState<string[]>()
    const [AlreadyDiscipline, setDiscipline] = useState<string[]>()
    const [AlreadyTopic, setTopic] = useState<string[]>()
    const [AlreadySubTopic, setSubTopic] = useState<string[]>()

    useEffect(() => {
        if (props.Curriculum) {
            if (props.type === 'module') {
                for (const item of props.Curriculum) {
                    setModules(
                        Modules => [...Modules || [], item.moduleId._id]
                    )
                }
            }
            if (props.type === 'discipline') {
                const newDisciplines = props.Curriculum
                    .filter(item => item.moduleId._id === props.moduleId)
                    .flatMap(item => item.disciplines.map(dis => dis.disciplineId._id));

                setDiscipline(newDisciplines);
            }
            if (props.type === 'topic') {
                const newTopics = props.Curriculum
                    .filter(item => item.moduleId._id === props.moduleId)
                    .flatMap(item => item.disciplines
                        .filter(dis => dis.disciplineId._id === props.disciplineId)
                        .flatMap(dis => dis.topics.map(topic => topic.topicId._id)));

                setTopic(newTopics);
            }
            if (props.type === 'subtopic') {
                const newSubTopics = props.Curriculum
                    .filter(item => item.moduleId._id === props.moduleId)
                    .flatMap(item => item.disciplines
                        .filter(dis => dis.disciplineId._id === props.disciplineId)
                        .flatMap(dis => dis.topics
                            .filter(topic => topic.topicId._id === props.topicId)
                            .flatMap(topic => topic.subTopics.map(subTopic => subTopic._id))));

                setSubTopic(newSubTopics);
            }

        }
    }
        , [props.type, props.moduleId, props.Curriculum])




    const fetchData = (type: string) => {
        switch (type) {
            case 'module':
                return useFetchAllModules();
            case 'discipline':
                return useFetchAllDiscipline();
            case 'topic':
                return useFetchAllTopics()
            case 'subtopic':
                return useFetchAllSubTopics();
            default:
                return { data: null, isLoading: false };
        }
    };

    const { data, isLoading } = fetchData(props.type);
    const [tableData, setTableData] = useState<IModules[] | IDiscipline[] | ITopics[] | ISubTopics[]>([]);


    useEffect(() => {
        if (data && !isLoading) {
            if (props.type === 'module') {
                const filteredData = data.body.modules.filter((module: IModules) => {
                    if (Modules?.some((existingModule) => existingModule === module._id)) {
                        return false
                    }
                    return true
                })
                setTableData(filteredData)
            }
            else if (props.type === 'discipline') {
                const filteredData = data.body.disciplines.filter((dis: IDiscipline) => {
                    if (AlreadyDiscipline?.some((existingDis) => existingDis === dis._id)) {
                        return false
                    }
                    return true
                })
                setTableData(filteredData)
            }
            else if (props.type === 'topic') {
                console.log("sdmaoidoisdmaodadsomd", data.body.topics)
                const filteredData = data.body.topics.filter((topic: ITopics) => {
                    if (AlreadyTopic?.some((existingTopic) => existingTopic === topic._id)) {
                        return false
                    }
                    return true
                })
                setTableData(filteredData)
            }
            else {
                const filteredData = data.body.subtopics.filter((subtopic: ISubTopics) => {
                    if (AlreadySubTopic?.some((existingSubTopic) => existingSubTopic === subtopic._id)) {
                        return false
                    }
                    return true
                })
                setTableData(filteredData)
            }

        }
    }, [data, isLoading, props.type, AlreadyDiscipline, Modules, AlreadyTopic])



    const [searchQuery, setSearchQuery] = useState('');
    const [toBeAdded, setToBeAdded] = useState<string[]>([]);
    const [confirmationModal, setConfirmationModal] = useState(false)

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            if (props.type === 'module') {
                setTableData(data.body.modules);
            }
            else if (props.type === 'discipline') {
                setTableData(data.body.disciplines);
            }
            else if (props.type === 'topic') {
                setTableData(data.body.topics);
            }
            else {
                setTableData(data.body.subtopics);
            }
        }
        else {
            const filteredData = tableData.filter((item: IModules | IDiscipline | ITopics | ISubTopics) => {
                if (props.type === 'module' && 'moduleName' in item) {
                    return item.moduleName.toLowerCase().includes(e.target.value.toLowerCase())
                } else if (props.type === 'discipline' && 'disciplineName' in item) {
                    return item.disciplineName.toLowerCase().includes(e.target.value.toLowerCase())
                } else if (props.type === 'topic' && 'topicName' in item) {
                    return item.topicName.toLowerCase().includes(e.target.value.toLowerCase())
                } else if (props.type === 'subtopic' && 'subtopicName' in item) {
                    return item.subtopicName.toLowerCase().includes(e.target.value.toLowerCase())
                }
                return false;
            })
            setTableData(filteredData ? filteredData :
                props.type === 'module' ? data.body.modules :
                    props.type === 'discipline' ? data.body.disciplines :
                        props.type === 'topic' ? data.body.topics :
                            data.body.subtopics
            )
        }

    };

    function transformObject(inputObject: Module[]): TransformedObject {
        const transformedObject: TransformedObject = {
            curriculum: [],
        };

        inputObject.forEach((module) => {
            const moduleEntry: TransformedModule = {
                moduleId: module.moduleId._id,
                disciplines: [],
            };

            module.disciplines.forEach((discipline) => {
                const disciplineEntry: TransformedDiscipline = {
                    disciplineId: discipline.disciplineId._id,
                    topics: [],
                };

                discipline.topics.forEach((topic) => {
                    const topicEntry: TTransformedTopic = {
                        topicId: topic.topicId._id,
                        subTopics: topic.subTopics.map((subTopic) => subTopic._id),
                    };

                    disciplineEntry.topics.push(topicEntry);
                });

                moduleEntry.disciplines.push(disciplineEntry);
            });

            transformedObject.curriculum.push(moduleEntry);
        });

        return transformedObject;
    }
    const ModifyCurriculum = async () => {
        if (props.Curriculum) {
            const transformedObject = transformObject(props.Curriculum)
            if (props.type === 'module' && data.body.modules) {
                for (let i = 0; i < toBeAdded.length; i++) {
                    transformedObject.curriculum.push({
                        moduleId: toBeAdded[i],
                        disciplines: []
                    })
                }
            }
            else if (props.type === 'discipline' && props.moduleId && data.body.disciplines) {
                const ItemIndexForModule = transformedObject.curriculum.findIndex((module) => module.moduleId === props.moduleId)
                for (let i = 0; i < toBeAdded.length; i++) {
                    transformedObject.curriculum[ItemIndexForModule].disciplines.push({
                        disciplineId: toBeAdded[i],
                        topics: []
                    })
                }
            }
            else if (props.type === 'topic' && props.moduleId && props.disciplineId && data.body.topics) {
                const ItemIndexForModule = transformedObject.curriculum.findIndex((module) => module.moduleId === props.moduleId)
                const ItemIndexForDiscipline = transformedObject.curriculum[ItemIndexForModule].disciplines.findIndex((discipline) => discipline.disciplineId === props.disciplineId)
                for (let i = 0; i < toBeAdded.length; i++) {
                    const topic = data.body.topics.find((topic: ITopic) => topic._id === toBeAdded[i])
                    transformedObject.curriculum[ItemIndexForModule].disciplines[ItemIndexForDiscipline].topics.push({
                        topicId: toBeAdded[i],
                        subTopics: topic.subtopicIds
                    })
                }
            }
            else if (props.type === 'subtopic' && props.moduleId && props.disciplineId && props.topicId && data.body.subtopics) {
                const ItemIndexForModule = transformedObject.curriculum.findIndex((module) => module.moduleId === props.moduleId)
                const ItemIndexForDiscipline = transformedObject.curriculum[ItemIndexForModule].disciplines.findIndex((discipline) => discipline.disciplineId === props.disciplineId)
                const ItemIndexForTopic = transformedObject.curriculum[ItemIndexForModule].disciplines[ItemIndexForDiscipline].topics.findIndex((topic) => topic.topicId === props.topicId)
                for (let i = 0; i < toBeAdded.length; i++) {
                    transformedObject.curriculum[ItemIndexForModule].disciplines[ItemIndexForDiscipline].topics[ItemIndexForTopic].subTopics.push(toBeAdded[i])
                }
            }
            if (id) {
                const Response = await AddCurriculum(
                    id,
                    {
                        "academicYear": props.selectedTab.split(" ").map((word) => word.toUpperCase()).join("_"),
                        "curriculum": transformedObject.curriculum
                    }
                )
                if (Response.status) {
                    showToast('Curriculum Updated!', 'success');
                    props.setIsDrawerOpen(false)
                    if (id) {
                        const newresponse = await fetchCurriculumById(id)
                        if (newresponse.status === 'success') {
                            props.setCurriculum(newresponse.body.academicYears)
                        }
                    }
                }
            }
            else {
                showToast('Error Updating Curriculum!', 'error')
            }
        }
        else if (!props.Curriculum && data.body.modules) {
            const transformedObject = transformObject([])
            for (let i = 0; i < toBeAdded.length; i++) {
                transformedObject.curriculum.push({
                    moduleId: toBeAdded[i],
                    disciplines: []
                })
            }
            if (id) {
                const Response = await AddCurriculum(
                    id,
                    {
                        "academicYear": props.selectedTab.split(" ").map((word) => word.toUpperCase()).join("_"),
                        "curriculum": transformedObject.curriculum
                    }
                )
                if (Response.status) {
                    showToast('Curriculum Updated!', 'success');
                    props.setIsDrawerOpen(false)
                    if (id) {
                        const newresponse = await fetchCurriculumById(id)
                        if (newresponse.status === 'success') {
                            props.setCurriculum(newresponse.body.academicYears)
                        }
                    }
                }
            }
            else {
                showToast('Error Updating Curriculum!', 'error')
            }
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
                            {tableData.map((item: any) => (
                                <tr className="border-b" key={item._id}>
                                    <td
                                        scope="row"
                                        className=" py-3 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        <Checkbox
                                            for={item._id || ''}
                                            showLabel={false}
                                            checked={toBeAdded.includes(item._id || '')}
                                            onChange={(checked) => {
                                                if (checked) {
                                                    setToBeAdded(
                                                        toBeAdded => [...toBeAdded || [], item._id]
                                                    )
                                                }
                                                else {
                                                    setToBeAdded(
                                                        toBeAdded => toBeAdded.filter((id) => id !== item._id)
                                                    )
                                                }
                                            }}
                                        />
                                    </td>

                                    <td className="px-2 py-3">
                                        {props.type === 'module'
                                            ? item.moduleName
                                            : props.type === 'discipline'
                                                ? item.disciplineName
                                                : props.type === 'topic'
                                                    ? item.topicName
                                                    : item.subtopicName
                                        }
                                    </td>
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
                                ModifyCurriculum()
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
