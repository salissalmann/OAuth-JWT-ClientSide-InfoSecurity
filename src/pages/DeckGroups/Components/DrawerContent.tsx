import React, { useState } from "react";
import AddingForm from "./AddDeckForm";
import ExistingForm from "./AddExistingDeckForm";

interface DrawerContentInterface {
    deckGroupId: string
}

export const DrawerContent: React.FC<DrawerContentInterface> = (deckGroupId) => {

    const [OpenExistingForm, SetExistingForm] = useState(false)
    const [OpenAddingForm, SetAddingForm] = useState(false)


    const CloseExisting = (value: boolean) => {
        SetExistingForm(value);
    }



    return (
        <>
            {OpenExistingForm ? <div>
                <ExistingForm
                    ExistingForm={CloseExisting}
                    deckGroupId={deckGroupId.deckGroupId}
                />
            </div> :
                OpenAddingForm ? <div>
                    <AddingForm
                        AddingForm={SetAddingForm}
                        deckGroupId={deckGroupId.deckGroupId}
                    />
                </div> :
                    <div className="flex flex-row gap-3">
                        <button
                            className=" text-primary p-7 cursor-pointer hover:bg-primary hover:text-white transition-all ease-in-out border border-gray-200 rounded shadow-xs"
                            onClick={() => {
                                SetAddingForm(true);
                            }}
                        >
                            Create New Deck
                        </button>
                        <button
                            className=" text-primary p-7 cursor-pointer hover:bg-primary hover:text-white transition-all ease-in-out border border-gray-200 rounded shadow-xs"
                            onClick={() => {
                                SetExistingForm(true);
                            }}
                        >
                            Add Existing Deck
                        </button>
                    </div>
            }
        </>
    );
}

export default DrawerContent