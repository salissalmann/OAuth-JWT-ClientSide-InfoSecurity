import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchUniversityById } from '../../services/query';
import Banner from './Components/Banner';
import EditUniversityForm from './Components/EditUniversityForm';
import Tabs from './Components/Tabs';
import Deckgroups from './Deckgroups';
import { IUniversity } from './Components/Universities.interface';
import CurriculumTree from './CurriculumTree';

export default function UniversityManager() {

    const FetchUniversityMutation = useFetchUniversityById()
    const { id } = useParams()
    const [university, setUniversity] = useState<IUniversity>()
    const [originaluniversity, setOriginalUniversity] = useState<IUniversity>()
    const [disabled, setDisabled] = useState<boolean>(true)
    const TabList = ["University Details", "Curriculum", "Deck Groups"]
    const [currentTab, setCurrentTab] = useState<string>("University Details")
    const [displayOriginalImage, setdisplayOriginalImage] = useState(true)



    useEffect(() => {
        const FetchUniversity = async () => {
            if (id) {
                const Response = await FetchUniversityMutation.mutateAsync(id)
                setUniversity(Response.body.university)
                setOriginalUniversity(Response.body.university)
            }
        }
        FetchUniversity()
    }, [id])

    const RevertUniversityLogo = () => {
        setdisplayOriginalImage(true)
    }


    return (
        <div className="w-full pb-20">
            <Banner
                category="University"
                heading={`University: ${university?.universityName ?? ''}`}
                description={university?.universityDescription ?? ''}
                image={university?.universityLogo ?? ''}
                isPicture={true}
                disabled={disabled}
                university={university}
                setUniversity={setUniversity}
                displayOriginalImage={displayOriginalImage}
                setDisplayOriginalImage={setdisplayOriginalImage}
            />

            <Tabs
                currentTab={currentTab ?? TabList[0]}
                setCurrentTab={setCurrentTab}
                tabList={TabList}
            />

            {currentTab === "University Details" &&
                <EditUniversityForm
                    originalUniversities={originaluniversity ?? {} as IUniversity}
                    university={university ?? {} as IUniversity}
                    setUniversity={setUniversity}
                    disabled={disabled}
                    handleDisabled={() => setDisabled(!disabled)}
                    RevertUniversityLogo={RevertUniversityLogo}
                />
            }

            {currentTab === "Curriculum" &&
                <div className="flex items-center justify-center">
                    <CurriculumTree
                        id={id ?? ""}
                    />
                </div>
            }

            {currentTab === "Deck Groups" &&
                <div className="flex items-center justify-center">
                    <Deckgroups
                        universityName={university?.universityName ?? ""}
                    />
                </div>
            }




        </div>
    )
}
