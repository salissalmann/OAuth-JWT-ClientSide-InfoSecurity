import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MyToast, { showToast } from '../../components/UiComponents/MyToast'
import apiClient from '../../services/api/apiClient'
import useAuth from '../../hooks/useAuth'
import { isAxiosError } from 'axios'

export default function SignUp() {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", phoneNumber: "" });
    const navigate = useNavigate()

    const handleInputChange = (name: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const authHook = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const CheckValidity = () => {
        //No mongodb injection could be done here as we are using mongoose
        //all email and password are validated to avoid any kind of injection
        if (formData.email === "") {
            showToast("Please enter email", "error");
            return false;
        }
        if (formData.password === "") {
            showToast("Please enter password", "error");
            return false;
        }

        //all email and password are validated to avoid any kind of injection
        if (formData.email.length < 5) {
            showToast("Email is invalid", "error");
            return false;
        }
        if (formData.password.length < 5) {
            showToast("Password is invalid", "error");
            return false;
        }
        //regex for email validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(formData.email)) {
            showToast("Email is invalid", "error");
            return false;
        }
        return true;
    }

    const Submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!CheckValidity()) {
            return;
        }
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const body = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
            };
            const res = await apiClient.post("/users/register", body);
            if (res.data.message==="Account Created Successfully") {
                showToast("User Created Successfully", "success");
                const accessToken = res.data.data?.AccessToken;
                const refreshToken = res.data.data?.RefreshToken;
                if (!accessToken) {
                  throw new Error('An Error Occurred');
                }
                document.cookie = `accessToken=${accessToken}; path=/;`;
                document.cookie = `refreshToken=${refreshToken}; path=/;`;
                setTimeout(() => {
                    navigate("/users");
                }, 2000);
            } else {
                showToast(res.data.message, "error");
            }
            setIsSubmitting(false);
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(error.response?.data.header.errorMessage, "error");
            } else {
                showToast("An error occured", "error");
            }
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="bg-gray-50 ">
                <section className=" font-poppins">
                    <div className="relative z-10 flex items-center h-screen py-16 overflow-hidden lg:bg-blue-900 lg:dark:bg-gray-800 2xl:py-44">
                        <div
                            className="absolute top-0 left-0 w-full h-full lg:bg-blue-900 dark:bg-bg-gray-700 lg:bottom-0 lg:h-auto lg:w-4/12">
                            <img src="https://i.postimg.cc/XJBZvxHp/first.jpg" alt=""
                                className="hidden object-cover w-full h-full lg:block" />
                        </div>
                        <div className="relative max-w-6xl px-4 mx-auto">
                            <div className="justify-center max-w-xl mx-auto lg:max-w-5xl">
                                <div className="flex flex-wrap items-center -mx-4">
                                    <div className="w-full px-4 lg:w-3/5">
                                        <div className="z-10 w-full p-10 shadow-md bg-gray-50 dark:bg-gray-900 rounded-lg ">
                                            <h2 className="text-xl font-bold leading-tight mb-7 md:text-2xl dark:text-gray-300">
                                                Create your account</h2>
                                            <div className='flex justify-between gap-2 mb-2'>
                                                <div>
                                                    <label htmlFor="" className="block text-gray-700 dark:text-gray-300">First Name:</label>
                                                    <input type="text" className="w-full px-4 py-3 mt-2 bg-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-800"
                                                        name="firstName" placeholder="Enter First Name"
                                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="" className="block text-gray-700 dark:text-gray-300">Last Name:</label>
                                                    <input type="text" className="w-full px-4 py-3 mt-2 bg-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-800"
                                                        name="lastName" placeholder="Enter Last Name"
                                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                    />
                                                </div>

                                            </div>
                                            <div>
                                                <label htmlFor="" className="block text-gray-700 dark:text-gray-300">Email:</label>
                                                <input type="email" className="w-full px-4 py-3 mt-2 bg-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-800"
                                                    name="email" placeholder="Enter your Email"
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="" className="text-gray-700 dark:text-gray-300 ">Password:</label>
                                                    <div className="relative flex items-center mt-2">
                                                        <input type="password"
                                                            className="w-full px-4 py-3 bg-gray-200 rounded-lg dark:text-gray-400 dark:bg-gray-800 "
                                                            placeholder="Enter your password"
                                                            name="password"
                                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="" className="text-gray-700 dark:text-gray-300 ">Phone Number:</label>
                                                    <div className="relative flex items-center mt-2">
                                                        <input type="text"
                                                            className="w-full px-4 py-3 bg-gray-200 rounded-lg dark:text-gray-400 dark:bg-gray-800 "
                                                            placeholder="Enter your phone number"
                                                            name="phoneNumber"
                                                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <button
                                                    className="px-4 py-2 mt-3 font-semibold text-white bg-yellow-500 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                                                    onClick={Submit}
                                                    disabled={isSubmitting}
                                                >
                                                    Sign Up
                                                </button>
                                            </div>
                                            <div className="mt-4 text-gray-700  dark:text-gray-300">
                                                Already have an account?
                                                <a href="#" className="font-semibold text-blue-700 hover:underline ml-2"
                                                    onClick={() => navigate('/login')}
                                                >
                                                    Login </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden w-full px-6 mb-16 lg:w-2/5 lg:mb-0 lg:block">
                                        <span
                                            className="flex items-center justify-center w-20 h-20 mx-auto text-gray-900 bg-yellow-400 rounded-lg dark:bg-yellow-300 mb-9">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                                                className="bi bi-person-circle" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                <path fillRule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                            </svg>
                                        </span>
                                        <h2
                                            className="text-4xl font-bold text-center text-gray-100 dark:text-gray-400 mb-9 lg:text-6xl ">
                                            Are you ready to create your account?</h2>
                                        <p className="text-xl font-semibold text-center text-gray-200 dark:text-gray-500 ">You are welcome here!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <MyToast />
                </section>
            </section>


        </>
    )
}
