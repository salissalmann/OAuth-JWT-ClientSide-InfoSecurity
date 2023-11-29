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
                <div className="flex flex-row w-1/2 pb-20">
                    <div className="grid grid-cols-2 w-full gap-4">
                    </div>
                </div>
                <section className="px-6 ">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="flex items-center p-4 rounded-md shadow bg-gray-50">
                            <div className="mr-4">
                                <span
                                    className="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="w-6 h-6 bi bi-currency-dollar" viewBox="0 0 16 16">
                                        <path
                                            d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                            <div>
                                <p className="mb-2 text-gray-700 ">Earnings Annual</p>
                                <h2 className="text-2xl font-bold text-gray-700 ">
                                    $1,25,220</h2>
                            </div>
                        </div>
                        <div className="flex items-center p-4 rounded-md shadow  bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={()=>{
                            setOpenNewUserDrawer(true)
                        }}>
                            <div className="mr-4">
                                <span
                                    className="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full ">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="w-6 h-6 bi bi-bag-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z">
                                        </path>
                                        <path
                                            d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                            <div>
                            <h2 className="text-2xl font-bold text-gray-700 ">
                                Register Normal User </h2>
                            </div>
                        </div>
                        <div className="flex items-center p-4 rounded-md shadow bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={()=>{
                            setOpenNewAdminDrawer(true)
                        }}>
                            <div className="mr-4">
                                <span
                                    className="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full ">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="w-6 h-6 bi bi-chat-text" viewBox="0 0 16 16">
                                        <path
                                            d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z">
                                        </path>
                                        <path
                                            d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-700 ">
                                Register Administerator</h2>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="px-6 py-6">
                    <div className="grid lg:grid-cols-[60%,1fr]  grid-cols-1 gap-6 ">
                        <div className="pt-4 bg-white rounded shadow ">
                            <div className="flex px-6 pb-4 border-b ">
                                <h2 className="text-xl font-bold ">Transaction</h2>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="text-xs text-left text-gray-500 dark:text-gray-400">
                                            <th className="px-6 pb-3 font-medium">Transaction ID</th>
                                            <th className="px-6 pb-3 font-medium ">Date </th>
                                            <th className="px-6 pb-3 font-medium">Email </th>
                                            <th className="px-6 pb-3 font-medium">Status </th>
                                            <th className="px-6 pb-3 font-medium"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-xs bg-gray-100 dark:text-gray-400 dark:bg-transparent">
                                            <td className="px-6 py-5 font-medium">018276td45</td>
                                            <td className="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td className="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    className="inline-block px-2 py-1 text-center text-green-600 bg-green-100 rounded-full dark:text-green-700 dark:bg-green-200">Completed</span>
                                            </td>
                                            <td className="px-6 py-5 ">
                                                <a href="#"
                                                    className="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                        <tr className="text-xs dark:text-gray-400">
                                            <td className="px-6 py-5 font-medium">018276td45</td>
                                            <td className="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td className="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    className="inline-block px-2 py-1 text-center text-yellow-600 bg-yellow-100 rounded-full dark:text-yellow-700 dark:bg-yellow-200">Pending</span>
                                            </td>
                                            <td className="px-6 py-5 ">
                                                <a href="#"
                                                    className="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                        <tr className="text-xs bg-gray-100 dark:bg-transparent dark:text-gray-400">
                                            <td className="px-6 py-5 font-medium">018276td45</td>
                                            <td className="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td className="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    className="inline-block px-2 py-1 text-center text-green-600 bg-green-100 rounded-full dark:text-green-700 dark:bg-green-200">Completed</span>
                                            </td>
                                            <td className="px-6 py-5 ">
                                                <a href="#"
                                                    className="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                        <tr className="text-xs dark:text-gray-400">
                                            <td className="px-6 py-5 font-medium">018276td45</td>
                                            <td className="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td className="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    className="inline-block px-2 py-1 text-center text-red-600 bg-red-100 rounded-full dark:text-red-700 dark:bg-red-200">
                                                    Cancelled</span>
                                            </td>
                                            <td className="px-6 py-5 ">
                                                <a href="#"
                                                    className="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-6 mb-2 bg-white rounded shadow dark:text-gray-100 card dark:bg-gray-900">
                            <h2 className="mb-6 text-xl font-semibold dark:text-gray-400"> New Updates </h2>
                            <div className="flex items-center mb-4 ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="w-6 h-6 mr-4 text-gray-500 dark:text-gray-400 bi bi-gift"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z">
                                    </path>
                                </svg>
                                <div>
                                    <p className="font-semibold dark:text-gray-400">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-400"> Due 23 days ago </p>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="w-6 h-6 mr-4 text-gray-500 dark:text-gray-400" viewBox="0 0 16 16">
                                    <path
                                        d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z">
                                    </path>
                                    <path
                                        d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z">
                                    </path>
                                </svg>
                                <div>
                                    <p className="font-semibold dark:text-gray-400">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-400"> Due 23 days ago </p>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="w-6 h-6 mr-4 text-gray-500 dark:text-gray-400 bi bi-building"
                                    viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694 1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z">
                                    </path>
                                    <path
                                        d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z">
                                    </path>
                                </svg>
                                <div>
                                    <p className="font-semibold dark:text-gray-400">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-400"> Due 23 days ago </p>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="w-6 h-6 mr-4 text-gray-500 dark:text-gray-400 bi bi-calendar"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z">
                                    </path>
                                </svg>
                                <div>
                                    <p className="font-semibold dark:text-gray-400">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-400"> Due 23 days ago </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

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
