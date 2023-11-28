import React, { useEffect, useState } from 'react';
import { Drawer } from '../../components/UiComponents';
import {
    AddIcon,
    DeleteIcon,
    ManageIcon,
    SettingDotsIcon
} from '../../components/UiComponents/Icons';
import { useFetchCurriculumById } from '../../hooks';
import { AddChild } from './Components/AddChild';
import Tabs from './Components/Tabs';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { showToast } from '../../components/UiComponents/MyToast';
import { fetchCurriculumById } from '../../services/api/curriculumApi';


interface CurriculumTreeProps {
    id: string;
}

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

interface TreeData {
    id: string;
    name: string;
    children?: TreeData[];
}


export default function CurriculumTree({ id }: CurriculumTreeProps) {
    const { data, isLoading, isError } = useFetchCurriculumById(id);

    const [curriculum, setCurriculum] = useState<AcademicYear[] | undefined>();
    const [currentTab, setCurrentTab] = useState<string>('First Year');
    const [yearData, setYearData] = useState<Module[] | undefined>();

    const TabList = [
        'First Year',
        'Second Year',
        'Third Year',
        'Fourth Year',
    ];

    useEffect(() => {
        if (!isLoading && !isError && data) {
            setCurriculum(data.body.academicYears);
        }
    }, [isLoading, isError, data, setCurriculum]);

    useEffect(() => {
        if (curriculum) {
            const FIRST_YEAR = curriculum[0]?.curriculum;
            const SECOND_YEAR = curriculum[1]?.curriculum;
            const THIRD_YEAR = curriculum[2]?.curriculum;
            const FOURTH_YEAR = curriculum[3]?.curriculum;
            switch (currentTab) {
                case 'First Year':
                    setYearData(FIRST_YEAR);
                    break;
                case 'Second Year':
                    setYearData(SECOND_YEAR);
                    break;
                case 'Third Year':
                    setYearData(THIRD_YEAR);
                    break;
                case 'Fourth Year':
                    setYearData(FOURTH_YEAR);
                    break;
                default:
                    break;
            }
        }
    }, [currentTab, curriculum]);


    const TransformDataToTree = () => {
        if (!yearData) return;
        const treeData: TreeData[] = yearData.map((module) => {
            return {
                id: module.moduleId._id,
                name: module.moduleId.moduleName,
                children: module.disciplines.map((discipline) => {
                    return {
                        id: discipline.disciplineId._id,
                        name: discipline.disciplineId.disciplineName,
                        children: discipline.topics.map((topic) => {
                            return {
                                id: topic.topicId._id,
                                name: topic.topicId.topicName,
                                children: topic.subTopics.map((subtopic) => {
                                    return {
                                        id: subtopic._id,
                                        name: subtopic.subtopicName,
                                    };
                                }),
                            };
                        }),
                    };
                }),
            };
        })!;
        return treeData;
    };
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    return (
        <>
            <div className="w-full border shadow rounded-lg p-2">
                <Tabs
                    currentTab={currentTab ?? TabList[0]}
                    setCurrentTab={setCurrentTab}
                    tabList={TabList}
                />
                <div className="w-full">
                    <section className="relative z-20 overflow-hidden bg-white">
                        {yearData &&
                            <Treeview
                                data={TransformDataToTree()}
                                Curriculum={yearData}
                                selectedTab={currentTab}
                                setCurriculum={setCurriculum}
                                uniId={id}
                            />}
                        <div className='flex flex-row gap-3 justify-center items-center p-2  bg-secondary-100 cursor-pointer'
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5  text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <div className='text-sm text-gray-500'>
                                ADD NEW MODULE
                            </div>

                        </div>
                        {isDrawerOpen &&
                            <Drawer
                                isOpen={isDrawerOpen}
                                setIsOpen={setIsDrawerOpen}
                                title="Add Module"
                                size="md"
                            >
                                <AddChild
                                    type={"module"}
                                    setIsDrawerOpen={setIsDrawerOpen}
                                    Curriculum={yearData}
                                    selectedTab={currentTab}
                                    setCurriculum={setCurriculum}
                                />
                            </Drawer>}

                    </section>
                </div>
            </div>
        </>
    );
}

interface TreeviewItemProps {
    header: string;
    children: React.ReactNode;
    childname: string;
    moduleId?: string;
    disciplineId?: string;
    topicId?: string;
    id?: string;
    Curriculum?: Module[];
    selectedTab: string;
    setCurriculum: React.Dispatch<React.SetStateAction<AcademicYear[] | undefined>>
    uniId: string
}

const TreeviewItem = ({ header, children, childname,
    moduleId,
    disciplineId,
    topicId,
    id,
    Curriculum,
    selectedTab,
    setCurriculum,
    uniId
}: TreeviewItemProps) => {
    const [active, setActive] = useState(false);
    //module id is there if discipline is passed
    //discipline id is there if topic is passed
    //topic id is there if subtopic is passed


    const handleToggle = () => {
        setActive(!active);
    };

    const [viewCrudOptions, setViewCrudOptions] = useState(false);
    const [activeRow, setActiveRow] = useState<number | string | undefined>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSettingClick = (childname: string, id?: string) => {
        if (childname === '') {
            setViewCrudOptions(false);
            setActiveRow(undefined);
        } else {
            setViewCrudOptions(true);
            setActiveRow(id);
        }
    }

    const Delete = async () => {
        let body = {}
        if (childname === 'module') {
            body = {
                type: 'module',
                moduleId: id
            }
        }
        else if (childname === 'discipline') {
            body = {
                type: 'discipline',
                moduleId: moduleId,
                disciplineId: id
            }
        }
        else if (childname === 'topic') {
            body = {
                type: 'topic',
                moduleId: moduleId,
                disciplineId: disciplineId,
                topicId: id
            }
        }
        else if (childname === 'subtopic') {
            body = {
                type: 'subtopic',
                moduleId: moduleId,
                disciplineId: disciplineId,
                topicId: topicId,
                subtopicId: id
            }
        }
        const Response = await axios(`${API_BASE_URL}/curriculum/${uniId}/${selectedTab.split(" ").map((word) => word.toUpperCase()).join("_")}`
            , {
                method: 'PUT',
                data: body
            })
        if (Response) {
            showToast(
                'Removed Successfully',
                'success'
            );
            if (uniId) {
                const newresponse = await fetchCurriculumById(uniId)
                if (newresponse.status === 'success') {
                    setCurriculum(newresponse.body.academicYears)
                }
            }

        }
    }



    return (
        <div className='border'>
            <div className={`w-full ${active ? 'bg-secondary-100' : 'bg-white'}`}>
                <button className={`faq-btn flex w-full text-left`}>
                    <div className="w-full text-sm text-left text-gray-500">
                        <div className="flex flex-row justify-between items-center pl-8 pr-8">
                            <div className="flex flex-row justify-start gap-3 items-center">
                                {childname !== "subtopic" &&
                                    <div onClick={() => handleToggle()}>
                                        {active ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        }
                                    </div>}
                                <div className="flex flex-row gap-2 items-center justify-between" onClick={() => handleToggle()}>{header}
                                    <div
                                        className={`flex rounded-xl p-1 text-xs font-light items-center justify-center px-4 py-0.5  ${childname === 'module' ?
                                            'border border-blue-500 bg-blue-200 text-blue-500' :
                                            childname === 'discipline' ? 'border border-green-500 bg-green-200 text-green-500' :
                                                childname === 'topic' ? 'border border-yellow-500 bg-yellow-200 text-yellow-500' :
                                                    'border border-red-500 bg-red-200 text-red-500'
                                            }`}
                                    >
                                        {childname.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                {childname !== "subtopic" ?
                                    <button
                                        id={childname === 'module' ?
                                            `${moduleId}-dropdown-button` :
                                            childname === 'discipline' ?
                                                `${disciplineId}-dropdown-button` :
                                                childname === 'topic' ?
                                                    `${topicId}-dropdown-button` :
                                                    `${id}-dropdown-button`}
                                        data-dropdown-toggle={
                                            childname === 'module' ?
                                                `${moduleId}-dropdown` :
                                                childname === 'discipline' ?
                                                    `${disciplineId}-dropdown` :
                                                    childname === 'topic' ?
                                                        `${topicId}-dropdown` :
                                                        `${id}-dropdown`}
                                        className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none"
                                        type="button"
                                        onClick={() => {
                                            handleSettingClick(childname, id);
                                        }}
                                    >
                                        <SettingDotsIcon />
                                    </button> :
                                    <div className='p-4'></div>
                                }
                                <div
                                    id={childname === 'module' ?
                                        `${moduleId}-dropdown` :
                                        childname === 'discipline' ?
                                            `${disciplineId}-dropdown` :
                                            childname === 'topic' ?
                                                `${topicId}-dropdown` :
                                                `${id}-dropdown`}
                                    className={`${viewCrudOptions &&
                                        activeRow === id
                                        ? ''
                                        : 'hidden'
                                        }  w-44 bg-white rounded divide-y divide-gray-100 shadow top-0 right-0 z-[100]`}
                                >
                                    <ul
                                        className="py-1 text-sm"
                                        aria-labelledby={
                                            childname === 'module' ?
                                                `${moduleId}-dropdown-button` :
                                                childname === 'discipline' ?
                                                    `${disciplineId}-dropdown-button` :
                                                    childname === 'topic' ?
                                                        `${topicId}-dropdown-button` :
                                                        `${id}-dropdown-button`}

                                    >
                                        <li>
                                            {childname !== 'topic' &&
                                                <button
                                                    type="button"
                                                    className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                    onClick={() => {
                                                        setIsDrawerOpen(true);
                                                    }}
                                                >
                                                    <AddIcon />
                                                    <span>Add {
                                                        childname === 'module' ?
                                                            'Discipline' :
                                                            childname === 'discipline' ?
                                                                'Topic' :
                                                                childname === 'topic' ?
                                                                    'Subtopic' :
                                                                    'Subtopic'
                                                    }
                                                    </span>
                                                </button>}
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                onClick={() => {
                                                    if (childname === "module") {
                                                        window.open(
                                                            `${window.location.origin}/module`,
                                                            '_blank'
                                                        );
                                                    }
                                                    else if (childname === "discipline") {
                                                        window.open(
                                                            `${window.location.origin}/discipline`,
                                                            '_blank'
                                                        );
                                                    }
                                                    else if (childname === "topic") {
                                                        window.open(
                                                            `${window.location.origin}/topic/${id}`,
                                                            '_blank'
                                                        );
                                                    }
                                                    else if (childname === "subtopic") {
                                                        window.open(
                                                            `${window.location.origin}/subtopic`,
                                                            '_blank'
                                                        );
                                                    }
                                                }}
                                            >
                                                <ManageIcon />
                                                <span>Preview</span>
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                type="button"
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                onClick={() => {
                                                    Delete()
                                                }}
                                            >
                                                <DeleteIcon color='text-red-500' />
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
                            </div>
                        </div>
                    </div>
                </button>
            </div>
            <div className={`pl-[62px] transition-max-h ${active ? "max-h-full" : "max-h-0"} duration-200 ease-in-out overflow-hidden`}>
                {children}
            </div>
            {isDrawerOpen &&
                <Drawer
                    isOpen={isDrawerOpen}
                    setIsOpen={setIsDrawerOpen}
                    title="Add Sub Topic"
                    size="md"
                >
                    <AddChild
                        type={
                            childname === 'module' ?
                                'discipline' :
                                childname === 'discipline' ?
                                    'topic' :
                                    childname === 'topic' ?
                                        'subtopic' :
                                        'subtopic'
                        }
                        setIsDrawerOpen={setIsDrawerOpen}
                        Curriculum={Curriculum}
                        setCurriculum={setCurriculum}
                        selectedTab={selectedTab}
                        {...(childname === 'module' ? { moduleId: id?.toString() } : {})}
                        {...(childname === 'discipline' ? { moduleId: moduleId?.toString() } : {})}
                        {...(childname === 'discipline' ? { disciplineId: id?.toString() } : {})}
                        {...(childname === 'topic' ? { moduleId: moduleId?.toString() } : {})}
                        {...(childname === 'topic' ? { disciplineId: disciplineId?.toString() } : {})}
                        {...(childname === 'topic' ? { topicId: id?.toString() } : {})}
                    />
                </Drawer>}


        </div>
    );
};


const Treeview = ({ data,
    Curriculum,
    selectedTab,
    setCurriculum,
    uniId
}: {
    data?: TreeData[],
    Curriculum: Module[] | undefined,
    selectedTab: string,
    setCurriculum: React.Dispatch<React.SetStateAction<AcademicYear[] | undefined>>
    uniId: string
}) => {


    return (
        <div className="w-full">
            <section className="relative z-20 overflow-hidden bg-white">
                <div className="container mx-auto rounded shadow-md border">
                    <div className='flex flex-row items-center justify-between text-sm p-2 pr-4 pl-4 text-gray-500'>
                        <div>Curriculum</div>
                        <div>Actions</div>
                    </div>
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4 lg:w-full">
                            {data && data.map((module: {
                                id: string;
                                name: string;
                                children?: TreeData[];
                            }) => (
                                <TreeviewItem
                                    header={module.name}
                                    childname={'module'}
                                    id={module.id}
                                    Curriculum={Curriculum}
                                    selectedTab={selectedTab}
                                    setCurriculum={setCurriculum}
                                    uniId={uniId}
                                >
                                    {module.children && module.children.map((discipline: {
                                        id: string;
                                        name: string;
                                        children?: TreeData[];
                                    }) => (
                                        <TreeviewItem
                                            header={discipline.name}
                                            childname={'discipline'}
                                            moduleId={module.id}
                                            id={discipline.id}
                                            Curriculum={Curriculum}
                                            selectedTab={selectedTab}
                                            setCurriculum={setCurriculum}
                                            uniId={uniId}
                                        >
                                            {discipline.children && discipline.children.map((topic: {
                                                id: string;
                                                name: string;
                                                children?: TreeData[];
                                            }) => (
                                                <TreeviewItem
                                                    header={topic.name}
                                                    childname={'topic'}
                                                    moduleId={module.id}
                                                    disciplineId={discipline.id}
                                                    id={topic.id}
                                                    Curriculum={Curriculum}
                                                    selectedTab={selectedTab}
                                                    setCurriculum={setCurriculum}
                                                    uniId={uniId}
                                                >
                                                    {topic.children && topic.children.map((subtopic: {
                                                        id: string;
                                                        name: string;
                                                    }) => (
                                                        <TreeviewItem
                                                            header={subtopic.name}
                                                            children={undefined}
                                                            childname={'subtopic'}
                                                            moduleId={module.id}
                                                            disciplineId={discipline.id}
                                                            topicId={topic.id}
                                                            id={subtopic.id}
                                                            Curriculum={Curriculum}
                                                            selectedTab={selectedTab}
                                                            setCurriculum={setCurriculum}
                                                            uniId={uniId}
                                                        />
                                                    ))}
                                                </TreeviewItem>
                                            ))}
                                        </TreeviewItem>
                                    ))}
                                </TreeviewItem>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

