import React, { useEffect, useState } from 'react';
import { ConfirmationModal, Switcher } from '../../../components/UiComponents';
import { Input, Label } from '../../../components/UiComponents/Forms';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import { useFetchRoles } from '../../../services/query';
import DropDown from '../../../components/UiComponents/DropDown';
import { CreateAdminUser } from '../../../services/api/userApi';
import { isAxiosError } from 'axios';
import { UserInterface } from '../../../interfaces/User/user.interface';

interface AddFormInterface {
    AddingForm: (value: boolean) => void;
}
interface IRoles {
    _id: string;
    roleName: string;
}

export const AddingForm: React.FC<AddFormInterface> = ({
    AddingForm,
}) => {

    const [roles, setRoles] = useState<IRoles[]>()
    const [roleNames, setRoleName] = useState<string[]>([])

    const { data, isLoading } = useFetchRoles()

    useEffect(() => {
        if (data && !isLoading) {
            setRoles(data.data.data)
            data.data.data.map((role: IRoles) => {
                setRoleName(prev => [...prev, role.roleName])
            })
        }
    }, [data, isLoading])


    const [user, setUser] = useState<UserInterface>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: '',
        testUser: false
    })

    const handleInputChange = (name: string, value: string) => {
        setUser({
            ...user,
            [name]: value
        })
    };


    const initialErrorState = {
        firstNameError: {
            error: false,
            message: '',
        },
        lastNameError: {
            error: false,
            message: '',
        },
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
        roleError: {
            error: false,
            message: '',
        },
    }

    const [error, setError] = useState(initialErrorState);
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    }

    const validateField = async () => {
        let isError = false;
        const errors = {
            firstNameError: {
                error: false,
                message: '',
            },
            lastNameError: {
                error: false,
                message: '',
            },
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
            roleError: {
                error: false,
                message: '',
            },
        };
        if (user.firstName === '') {
            isError = true;
            errors.firstNameError.error = true;
            errors.firstNameError.message = 'First Name is required';
        }
        if (user.lastName === '') {
            isError = true;
            errors.lastNameError.error = true;
            errors.lastNameError.message = 'Last Name is required';
        }
        if (!user.email) {
            isError = true;
            errors.emailError.error = true;
            errors.emailError.message = 'Email is required';
        } else if (!isValidEmail(user.email)) {
            isError = true;
            errors.emailError.error = true;
            errors.emailError.message = 'Please enter a valid email';
        }

        if (user.password === '') {
            isError = true;
            errors.passwordError.error = true;
            errors.passwordError.message = 'Password is required';
        }
        if (user.phoneNumber === '') {
            isError = true;
            errors.phoneNumberError.error = true;
            errors.phoneNumberError.message = 'Phone Number is required';
        }
        if (user.role === '') {
            isError = true;
            errors.roleError.error = true;
            errors.roleError.message = 'Role is required';
        }
        setError(errors);
        return isError;
    }



    const OnSubmit = async () => {
        const error = await validateField();
        if (error) return;

        let Roles: string[] = []
        roles && roles.map((role: IRoles) => {
            if (role.roleName === user.role) {
                Roles.push(role._id)
            }
        })

        try {
            const Response = await CreateAdminUser(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    phoneNumber: user.phoneNumber,
                    roles: Roles[0],
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
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        phoneNumber: '',
                        role: '',
                        testUser: false
                    }
                )
            }
        }
        catch (error) {
            if (isAxiosError(error)) {
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
            <div>
                <Label>First Name</Label>
                <Input
                    type="text"
                    name="firstName"
                    onChange={handleInputChange}
                    value={user.firstName}
                    isError={error.firstNameError.error ? error.firstNameError.error : false}
                    errorMessage={error.firstNameError.error ? error.firstNameError.message : ''}
                />
            </div>
            <div className="mt-4">
                <Label>Last Name</Label>
                <Input
                    type="text"
                    name="lastName"
                    onChange={handleInputChange}
                    value={user.lastName}
                    isError={error.lastNameError.error ? error.lastNameError.error : false}
                    errorMessage={error.lastNameError.error ? error.lastNameError.message : ''}
                />
            </div>
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
            <div className="mt-4">
                <Label>Role</Label>
                <DropDown
                    options={roleNames}
                    onSelect={(value: string | number) => {
                        setUser({
                            ...user,
                            role: value.toString()
                        })
                    }}
                    label={''}
                    value={user.role}
                />
            </div>

            <div className="mt-4">
                <Label>Test User</Label>
                <Switcher
                    for={"20-1029"}
                    togglevalue={user.testUser ? true : false}
                    onChange={(value) => {
                        setUser({
                            ...user,
                            testUser: value
                        })
                    }}
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
                                firstName: '',
                                lastName: '',
                                email: '',
                                password: '',
                                phoneNumber: '',
                                role: '',
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
