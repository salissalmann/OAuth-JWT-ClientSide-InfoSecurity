import { isAxiosError } from 'axios';
import React, { useState } from 'react';
import { ConfirmationModal, Switcher } from '../../../components/UiComponents';
import { Input, Label } from '../../../components/UiComponents/Forms';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import { CreateNewUser } from '../../../services/api/userApi';
import { UserInterface } from '../../../interfaces/User/user.interface';
interface AddFormInterface {
    AddingForm: (value: boolean) => void;
}

export const AddingForm: React.FC<AddFormInterface> = ({
    AddingForm,
}) => {



    const [user, setUser] = useState<UserInterface>({
        email: '',
        password: '',
        phoneNumber: '',
        testUser: false
    })

    const handleInputChange = (name: string, value: string) => {
        setUser({
            ...user,
            [name]: value
        })
    };


    const initialErrorState = {
        emailError: {
            error: false,
            message: '',
        },
        passwordError: {
            error: false,
            message: '',
        },
        phoneNumberError: {
            error: false,
            message: '',
        },
    }

    const [error, setError] = useState(initialErrorState);
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    }

    const validateField = async (): Promise<boolean> => {
        let isError = false;
        const errors = {
            emailError: {
                error: false,
                message: '',
            },
            passwordError: {
                error: false,
                message: '',
            },
            phoneNumberError: {
                error: false,
                message: '',
            },
        };

        if (!user.email) {
            isError = true;
            errors.emailError.error = true;
            errors.emailError.message = 'Email is required';
        } else if (!isValidEmail(user.email)) {
            isError = true;
            errors.emailError.error = true;
            errors.emailError.message = 'Please enter a valid email';
        }

        if (!user.password) {
            isError = true;
            errors.passwordError.error = true;
            errors.passwordError.message = 'Password is required';
        }

        if (!user.phoneNumber) {
            isError = true;
            errors.phoneNumberError.error = true;
            errors.phoneNumberError.message = 'Phone Number is required';
        }

        setError(errors);
        return isError;
    }


    const OnSubmit = async () => {
        const error = await validateField();
        if (error) return;
        try {
            const Response = await CreateNewUser(
                {
                    email: user.email,
                    password: user.password,
                    phoneNumber: user.phoneNumber,
                    testUser: user.testUser
                }
            )
            if (Response.status === 201) {
                showToast(
                    'User Added Successfully',
                    'success'
                )
                AddingForm(false)
                setUser(
                    {
                        email: '',
                        password: '',
                        phoneNumber: '',
                        testUser: false
                    }
                )
            }
        }
        catch (error) {
            if (isAxiosError(error)) {
                if(error.response?.data.header.errorMessage === 'Invalid Access Token'){
                    window.location.href = "/login";
                    return
                }
                if(error.response?.data.header.errorMessage === 'Access Token not found'){
                    window.location.href = "/login";
                    return
                }

                showToast(
                    error.response?.data.header.errorMessage,
                    'error'
                )
            }
            else {
                showToast(
                    'Something went wrong',
                    'error'
                )
            }
        }
    }


    const [confirmationModal, setConfirmationModal] = useState(false)

    return (
        <div>
            <div className="mt-4">
                <Label>Email
                </Label>
                <Input
                    type="text"
                    name="email"
                    onChange={handleInputChange}
                    value={user.email}
                    isError={error.emailError.error ? error.emailError.error : false}
                    errorMessage={error.emailError.error ? error.emailError.message : ''}
                />
            </div>
            <div className="mt-4">
                <Label>Password</Label>
                <Input
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    value={user.password}
                    isError={error.passwordError.error ? error.passwordError.error : false}
                    errorMessage={error.passwordError.error ? error.passwordError.message : ''}
                />
            </div>
            <div className="mt-4">
                <Label>Phone Number</Label>
                <Input
                    type="text"
                    name="phoneNumber"
                    onChange={handleInputChange}
                    value={user.phoneNumber}
                    isError={error.phoneNumberError.error ? error.phoneNumberError.error : false}
                    errorMessage={error.phoneNumberError.error ? error.phoneNumberError.message : ''}
                />
            </div>
            <MyToast />

            <div
                className="flex flex-row gap-6 items-center 
            justify-end mt-1"
            >
                <button
                    className="bg-white-500 bg-opacity-100 text-gray rounded p-2 mt-8 w-1/4 border border-gray-300
                    hover:bg-white hover:text-gray-500 hover:border hover:border-gray-500"
                    onClick={() => {
                        if (user.firstName !== '' || user.lastName !== '' ||
                            user.email !== '' || user.password !== '' ||
                            user.phoneNumber !== '' || user.role
                        ) {
                            setConfirmationModal(true)
                            return
                        }
                        AddingForm(false)
                    }}
                >
                    Cancel
                </button>
                <button
                    className="bg-primary-500 bg-opacity-100 text-white rounded p-2 mt-8 w-1/4 border border-primary hover:bg-white hover:text-primary hover:border hover:border-primary"
                    onClick={() => {
                        OnSubmit();
                    }}
                >
                    Add
                </button>
                <MyToast />

                <ConfirmationModal
                    active={confirmationModal}
                    message="You have unsaved changes"
                    onConfirm={() => {
                        setConfirmationModal(false)
                        AddingForm(false)
                        setUser(
                            {
                                email: '',
                                password: '',
                                phoneNumber: '',
                                testUser: false
                            }
                        )
                    }}
                    onCancel={() => setConfirmationModal(false)}
                />
            </div>
        </div >
    );

}



export default AddingForm;
