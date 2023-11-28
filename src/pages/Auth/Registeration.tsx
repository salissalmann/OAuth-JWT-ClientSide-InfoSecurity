import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { ButtonOutlined, Drawer } from '../../components/UiComponents';
import MyToast from '../../components/UiComponents/MyToast';
import CreateAdminUser from './Components/CreateAdminUser';
import CreateNewUser from './Components/CreateNewUser';

export default function Registeration() {
    const [openNewUserDrawer, setOpenNewUserDrawer] = useState(false)
    const [openNewAdminDrawer, setOpenNewAdminDrawer] = useState(false)
    const [searchParams] = useSearchParams();
    const register = searchParams.get("register") as string;

    useEffect(() => {
        if (register === "admin") {
            setOpenNewAdminDrawer(true)
        }
        else if (register === "new") {
            setOpenNewUserDrawer(true)
        }
    }
        , [])


    return (
        <>
            <div className='flex flex-col w-full p-2'>
                <h1 className='text-lg p-4'>User Manager</h1>
                <h6 className='text-md text-gray-800 p-2 pl-4 border-b-2 mb-2'>Create</h6>
                <div className="flex flex-row w-1/2 pb-20">
                    <div className="grid grid-cols-2 w-full gap-4">
                        <ButtonOutlined
                            handleClick={() => {
                                setOpenNewUserDrawer(true)
                            }}
                            height="h-24"
                            width="w-full"
                            onHoverBgFilled={true}
                        >
                            Register New User
                        </ButtonOutlined>
                        <ButtonOutlined
                            handleClick={() => {
                                setOpenNewAdminDrawer(true)
                            }}
                            height="h-24"
                            width="w-full"
                            onHoverBgFilled={true}
                        >
                            Register Admin User
                        </ButtonOutlined>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={openNewAdminDrawer}
                setIsOpen={setOpenNewAdminDrawer}
                title="Register New User"
                size="md"
            >
                <CreateAdminUser
                    AddingForm={setOpenNewAdminDrawer}
                />
            </Drawer>
            <Drawer
                isOpen={openNewUserDrawer}
                setIsOpen={setOpenNewUserDrawer}
                title="Register New User"
                size="md"
            >
                <CreateNewUser
                    AddingForm={setOpenNewUserDrawer}
                />
            </Drawer>
            <MyToast />
        </>
    );
}
