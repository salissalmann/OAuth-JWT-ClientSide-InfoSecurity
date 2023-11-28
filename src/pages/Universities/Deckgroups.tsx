import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchDeckGroupOfUniversity } from '../../services/query';
import DeckGroupTop from './Components/DeckGroupTop';
import Tab from './Components/Tabs';

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

interface UniversityDashboardProps {
    universityName: string;
}

export default function UniversityDashboard({ universityName }: UniversityDashboardProps) {


    const { id } = useParams()
    const FetchUniversityMutation = useFetchDeckGroupOfUniversity();
    const [deckgroups, setDeckgroups] = useState<AcademicYear[]>();
    const [yearData, setYearData] = useState<DeckGroups[]>();
    const [currentTab, setCurrentTab] = useState<string>('First Year');

    useEffect(() => {
        const FetchDeckGroups = async () => {
            if (id) {
                const Response = await FetchUniversityMutation.mutateAsync(id)
                setDeckgroups(Response.body.academicYears)
                if (deckgroups) {
                    const FIRST_YEAR = deckgroups[0]?.deckgroups;
                    setYearData(FIRST_YEAR);
                }
            };
        };
        FetchDeckGroups()
    }, [id])


    useEffect(() => {
        if (deckgroups) {
            switch (currentTab) {
                case 'First Year':
                    //FirstYearIndex
                    const FirstYearIndex = deckgroups.findIndex((year: AcademicYear) => year.academicYear === 'FIRST_YEAR');
                    setYearData(deckgroups[FirstYearIndex]?.deckgroups);
                    break;
                case 'Second Year':
                    //SecondYearIndex
                    const SecondYearIndex = deckgroups.findIndex((year: AcademicYear) => year.academicYear === 'SECOND_YEAR');
                    setYearData(deckgroups[SecondYearIndex]?.deckgroups);
                    break;
                case 'Third Year':
                    //ThirdYearIndex
                    const ThirdYearIndex = deckgroups.findIndex((year: AcademicYear) => year.academicYear === 'THIRD_YEAR');
                    setYearData(deckgroups[ThirdYearIndex]?.deckgroups);
                    break;
                case 'Fourth Year':
                    //FourthYearIndex
                    const FourthYearIndex = deckgroups.findIndex((year: AcademicYear) => year.academicYear === 'FOURTH_YEAR');
                    setYearData(deckgroups[FourthYearIndex]?.deckgroups);
                    break;
                default:
                    break;
            }
        }
    });


    const [searchQuery, setSearchQuery] = useState<string>('');
    const TabList = [
        'First Year',
        'Second Year',
        'Third Year',
        'Fourth Year',
    ];


    const updateFilteredData = () => {
        if (!yearData) return;

        const newData = yearData.filter((uni: DeckGroups) => {
            if (!uni.groupName || !uni.groupDescription) return false;
            const matchesSearch = uni.groupName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
        setYearData(newData);
        return newData;
    };

    useEffect(() => {
        updateFilteredData();
    }, [searchQuery, deckgroups, currentTab]);

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            if (deckgroups) {
                const FIRST_YEAR = deckgroups[0]?.deckgroups;
                const SECOND_YEAR = deckgroups[1]?.deckgroups;
                const THIRD_YEAR = deckgroups[2]?.deckgroups;
                const FOURTH_YEAR = deckgroups[3]?.deckgroups;
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
        }
    };

    return (
        <>
            <div className="w-full border shadow rounded-lg p-2">
                <Tab
                    currentTab={currentTab ?? TabList[0]}
                    setCurrentTab={setCurrentTab}
                    tabList={TabList}
                />

                <div className="w-full">
                    <section className="antialiased">
                        <div className="mx-auto">
                            <div className="bg-white overflow-hidden">
                                <DeckGroupTop
                                    searchQuery={searchQuery}
                                    handleSearchQueryChange={handleSearchQueryChange}
                                    currentTab={currentTab ?? TabList[0]}
                                    universityName={universityName}
                                    setDeckgroups={setDeckgroups}
                                />
                                {yearData &&
                                    <CardsContainer universities={yearData} />}
                            </div>
                        </div>
                    </section>

                </div>
            </div>

        </>
    );
}

interface CardsContainerProps {
    universities: DeckGroups[];
}

const CardsContainer: React.FC<CardsContainerProps> = ({ universities }) => {
    return (
        <section>
            <div className="relative items-center w-full py-10 mx-auto ">
                <div className="grid w-full grid-cols-1 gap-12 mx-auto lg:grid-cols-3">
                    {universities.map((uni: DeckGroups, index: number) => {
                        return (
                            <CustomCard
                                key={index}
                                title={uni.groupName}
                                description={uni.groupDescription}
                                buttonText="Manage"
                                id={uni._id}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

interface CustomCardProps {
    key: string | number;
    title: string;
    description: string;
    buttonText: string;
    id: string;
}

export const CustomCard: React.FC<CustomCardProps> = ({ title, description, buttonText, id }) => {
    return (
        <div className="p-6 shadow-md">
            <div className="flex items-center mb-3">
                <h1 className="text-xl font-semibold leading-none tracking-tighter text-neutral-600">{title}</h1>
            </div>
            <p className="leading-relaxed mb-3 line-clamp-2  text-gray-500 font-sm">{description}</p>
            <div className="mt-4 cursor-pointer">
                <a
                    onClick={() => {
                        window.open(`/deckgroups/${id}`, '_blank')
                    }}
                    className="inline-flex items-center mt-4 font-semibold text-primary lg:mb-0 hover:text-neutral-600"
                    title="read more"
                >
                    {buttonText}
                </a>
            </div>
        </div>
    );
};
