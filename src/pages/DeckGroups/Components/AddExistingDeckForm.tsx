import React, { useState } from "react";
import { Label } from "../../../components/UiComponents/Forms";
import {
    ErrorIcon,
    SuccessIcon
} from "../../../components/UiComponents/Icons";
import MyToast, { showToast } from "../../../components/UiComponents/MyToast";
import { useAddExistingDeckToGroup, useFindDeckById } from "../../../hooks";


interface ExistingFormInterface {
    ExistingForm: (value: boolean) => void;
    deckGroupId: string;
}

interface IDeckData {
    deckName: string;
    deckDescription: string;
    deckTime: number;
    isPublished: boolean;
    isPremium: boolean;
    createdAt: string;
}


export const ExistingForm: React.FC<ExistingFormInterface> = ({ ExistingForm, deckGroupId }) => {
    const [deckId, setDeckId] = useState("");
    const [deckData, setDeckData] = useState<IDeckData>();

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
        setDeckId(e.target.value);
    };


    const FindDeckByIdMutation = useFindDeckById()
    const FindDeck = async () => {
        const data = await FindDeckByIdMutation.mutateAsync(deckId)
        setDeckData(data.data);
        if (!data.success) {
            showToast(
                "No deck found with this ID",
                "error",
                <ErrorIcon />
            )
        }
    }

    const AddExistingDeckToGroupMutation = useAddExistingDeckToGroup()
    const AddDeckToGroupById = async () => {
        if (deckId === "") {
            showToast(
                "Please enter deck id",
                "error",
                <ErrorIcon />
            )
            return
        }

        const bodyObject = {
            body: {
                groupId: deckGroupId,
                deckId: deckId
            }
        }
        const data = await AddExistingDeckToGroupMutation.mutateAsync(bodyObject)
        showToast(
            data.message,
            "success",
            <SuccessIcon />
        )

    }

    const formatTimeInHours = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} hours ${remainingMinutes} mins`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <>
            <div className="flex flex-row gap-6 items-center justify-center">
                <div className="w-full xl:w-3/4">
                    <Label>Deck ID:</Label>
                    <input
                        className="w-full border border-gray-300 p-3 rounded-md"
                        type="text"
                        placeholder="Enter Deck ID"
                        value={deckId}
                        onChange={handleInputChange}
                    />
                </div>
                <button
                    className="bg-primary-500 bg-opacity-100 text-white rounded p-2 mt-8 w-1/4 border border-primary hover:bg-white hover:text-primary hover:border hover:border-primary"
                    disabled={!deckId || deckId === "" ? true : false}
                    onClick={FindDeck}
                >
                    Find
                </button>
            </div>

            <div className="flex flex-row gap-6 items-center justify-start mt-8 p-2">
                <div className="w-full xl:w-3/4">
                    <Label>Result</Label>
                </div>
            </div>


            <div className="flex flex-row gap-6 items-center justify-start bg-gray-100 rounded p-5">
                <div className="w-full 
                flex flex-col gap-2
                ">
                    {deckData ? (
                        <>
                            <h2><b>Deck Name:</b> {deckData.deckName}</h2>
                            <h6><b>Deck Description:</b>  {deckData.deckDescription}</h6>
                            <h6><b>Deck Time:</b>  {formatTimeInHours(deckData.deckTime)}</h6>
                            <h6><b>Deck Published:</b>  {deckData.isPublished ? "Published" : "Unpublished"}</h6>
                            <h6><b>Deck Premium:</b>  {deckData.isPremium ? "Premium" : "Non-Premium"}`</h6>
                            <h6><b>Deck Created At:</b>  {formatDate(deckData.createdAt)}</h6>
                        </>
                    ) : (
                        <p>No deck found with this ID</p>
                    )}
                </div>
            </div>

            <div className="flex flex-row gap-6 items-center 
            justify-end
             mt-3">
                <button
                    className="bg-white-500 bg-opacity-100 text-gray rounded p-2 mt-8 w-1/4 border border-gray-300 hover:bg-white hover:text-gray-500 hover:border hover:border-gray-500"
                    onClick={() => {
                        setDeckId("");
                        setDeckData(
                            {
                                deckName: "",
                                deckDescription: "",
                                deckTime: 0,
                                isPublished: false,
                                isPremium: false,
                                createdAt: ""
                            }
                        );
                        ExistingForm(false);
                    }}
                >
                    Cancel
                </button>
                <button
                    className="bg-primary-500 bg-opacity-100 text-white rounded p-2 mt-8 w-1/4 border border-primary hover:bg-white hover:text-primary hover:border hover:border-primary"
                    onClick={() => {
                        AddDeckToGroupById();
                    }}
                >
                    Add
                </button>
                <MyToast />

            </div>

        </>
    );
}

export default ExistingForm