import { ButtonFill } from "../../../components/UiComponents";
import Image from "../../../components/UiComponents/Image";
import { IDiscipline } from "../../../interfaces/Discipline/discipline.interface";

interface ViewModalProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    discipline: IDiscipline,
    active: boolean;
}

const ViewModal: React.FC<ViewModalProps> = (props) => {
    return (
        <div
            id="readProductModal"
            tabIndex={-1}
            aria-hidden="true"
            className={`${props.active ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
        >
            <div className="relative p-4 w-full max-w-xl max-h-full">
                <div className="relative p-4 bg-white rounded-lg shadow ddark:bg-gray-800 sm:p-5">
                    {/* Modal header */}
                    <div className="flex justify-between mb-4 rounded-t sm:mb-5">
                        <div className="text-sm text-gray-900 md:text-xl ddark:text-white">
                            <span className="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                                Discipline
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-row gap-3 items-center pb-4">
                            {props.discipline.disciplineImage ? (
                                <Image
                                    src={props.discipline.disciplineImage.startsWith('https://') ? props.discipline.disciplineImage : `https://${props.discipline.disciplineImage}`}
                                    size='xs'
                                    disabled
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            )}
                            <dd className="font-bold text-gray-900 sm:mb-2 ddark:text-gray-400 text-xl">
                                {props.discipline.disciplineName}DASSD
                            </dd>
                        </div>
                        <div>
                            <dd className="mb-4 font-light text-gray-900 sm:mb-5 ddark:text-gray-400">
                                {props.discipline.disciplineDescription}
                            </dd>
                            <dt className={`inline-block py-1 px-2 rounded ${props.discipline.isActive ?
                                'bg-green-500' :
                                'bg-rose-500'
                                }  text-white text-xs font-medium tracking-widest`}>
                                {props.discipline.isActive ? 'Active' : 'InActive'}
                            </dt>
                        </div>
                    </div>
                    <div className="flex justify-end items-center space-x-3">
                        <ButtonFill handleClick={() => {
                            props.setIsOpen(false)
                        }}>Close</ButtonFill>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ViewModal;
