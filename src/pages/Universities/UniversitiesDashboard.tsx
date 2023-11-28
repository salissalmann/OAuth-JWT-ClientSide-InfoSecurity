import { useState, useEffect } from 'react';
import { useFetchAllUniversities } from '../../services/query';
import { IUniversity } from './Components/Universities.interface';
import UniversitiesTopBar from './Components/UniversitiesTopBar';
import { useNavigate } from 'react-router-dom';
import MyToast from '../../components/UiComponents/MyToast';

export default function UniversitiesDashboard() {
    const { data, isLoading, isError } = useFetchAllUniversities();
    const [universities, setUniversities] = useState<IUniversity[] | undefined>([]);

    useEffect(() => {
        if (!isLoading && !isError && data) {
            setUniversities(data.body.universities);
        }
    }, [isLoading, isError, data]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const updateFilteredData = () => {
        if (!data) return;
        const newData = data.body.universities.filter((uni: IUniversity) => {
            if (!uni.universityName || !uni.universityDescription) return false;

            const matchesSearch =
                uni.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                uni.universityDescription.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
        setUniversities(newData);
    };

    useEffect(updateFilteredData, [searchQuery, data]);

    const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            if (data) {
                setUniversities(data.body.universities);
            }
        }
    };

    return (
        <>
            <div className="w-full pb-20">
                <div className="flex items-center justify-between mt-5 pb-1">
                    <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
                </div>
                <section className="antialiased my-5">
                    <div className="mx-auto">
                        <div className="bg-white shadow-md sm:rounded-lg overflow-hidden">
                            <UniversitiesTopBar
                                searchQuery={searchQuery}
                                handleSearchQueryChange={handleSearchQueryChange}
                                setUniversities={setUniversities}
                            />
                        </div>
                    </div>
                </section>
                <CardsContainer universities={universities || []} />
                <MyToast />
            </div>
        </>
    );
}

interface CardsContainerProps {
    universities: IUniversity[];
}

const CardsContainer: React.FC<CardsContainerProps> = ({ universities }) => {

    return (
        <section>
            <div className="relative items-center w-full py-10 mx-auto ">
                <div className="grid w-full grid-cols-1 gap-12 mx-auto lg:grid-cols-3">
                    {universities.map((uni: IUniversity, index: number) => {
                        return (
                            <CustomCard
                                key={index}
                                title={uni.universityName}
                                description={uni.universityDescription}
                                buttonText="Manage"
                                icon={uni.universityLogo}
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
    id: string;
    key: string | number;
    title: string;
    description: string;
    buttonText: string;
    icon?: React.ReactNode;
}

export const CustomCard: React.FC<CustomCardProps> = ({ title, description, buttonText, icon, id }) => {
    const navigate = useNavigate();
    return (
        <div className="p-6 shadow-md">
            <div className="flex items-center mb-3">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mr-3 text-primary rounded-full bg-blue-50">
                    {icon && <img src={icon && typeof icon === 'string' && icon.startsWith('https://') ? icon :
                        `http://${icon}`} className="w-10 h-10 rounded-full" alt="logo" />}
                </div>
                <h1 className="text-xl font-semibold leading-none tracking-tighter text-neutral-600">{title}</h1>
            </div>
            <p className="leading-relaxed mb-3 line-clamp-2  text-gray-500 font-sm">{description}</p>
            <div className="mt-4 cursor-pointer">
                <a
                    onClick={
                        () => {
                            navigate(`/university/${id}`);
                        }
                    }
                    className="inline-flex items-center mt-4 font-semibold text-primary lg:mb-0 hover:text-neutral-600"
                    title="read more"
                >
                    {buttonText}
                </a>
            </div>
        </div>
    );
};
