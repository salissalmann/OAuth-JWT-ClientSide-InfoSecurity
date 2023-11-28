import { useEffect, useState } from "react";
import {
    Input,
    Label,
} from "../../../components/UiComponents/Forms";
import { UniversityDropDown } from "../../Decks/components";
import { IUniversity } from "../../Decks/Interfaces";


interface IDeckGroupData {
    id: string;
    deckName: string;
    deckSource: string;
    deckDescription?: string;
    published: boolean,
    decksInformation:
    {
        deckId: string,
        deckName: string,
        deckDescription: string,
        deckTime: number,
        isPremium: boolean,
        isPublished: boolean,
    }[]
}
export interface IErrorObject {
    error: boolean;
    message: string;
}

interface FormProps {
    formData: IDeckGroupData,
    setFormData: (data: IDeckGroupData) => void,
    disabled: boolean,
    errors: {
        deckGroupNameError: IErrorObject,
        deckGroupDescriptionError: IErrorObject
    }
}

export const Form: React.FC<FormProps> = ({
    formData,
    setFormData,
    disabled = false,
    errors
}) => {

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const getDropDownValue = (val: string) => {
        setFormData({ ...formData, deckSource: val });
    };



    return (
        <div className="rounded-sm  bg-white shadow-default ">
            <form className="my-8">
                <div className="space-y-8">
                    <div className=" flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-3/4">
                            <Label>Deck Group Name</Label>
                            <Input
                                type="text"
                                placeholder="Enter your group name"
                                name="deckName"
                                onChange={handleInputChange}
                                disabled={disabled}
                                value={formData.deckName}
                                isError={errors?.deckGroupNameError.error}
                                errorMessage={errors?.deckGroupNameError.message}
                            />
                        </div>

                        <div className="w-full xl:w-1/4">
                            <UniversityDropDown
                                value={formData.deckSource === "" ? undefined : formData.deckSource}
                                onSelect={
                                    (selectedValue: IUniversity) => {
                                        getDropDownValue(selectedValue._id);
                                    }
                                }
                                disabled={disabled}
                                reset={true}
                            />
                        </div>
                    </div>
                    <Label>Deck Description</Label>
                    <TextArea limit={300}
                        setTextArea={(text) => {
                            setFormData({ ...formData, deckDescription: text });
                        }}
                        disabled={disabled}
                        value={formData.deckDescription}
                        isError={errors?.deckGroupDescriptionError.error}
                        errorMessage={errors?.deckGroupDescriptionError.message}
                    />
                </div>
            </form>
        </div>
    );
};


interface TextAreaProps {
    limit?: number;
    setTextArea: (text: string) => void;
    disabled?: boolean;
    value?: string;
    isError?: boolean;
    errorMessage: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
    limit,
    setTextArea,
    disabled = false,
    value = "",
    isError = false,
    errorMessage = ""
}) => {

    const [text, setText] = useState("");
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        setText(value);
    }, [value]);


    useEffect(() => {
        if (limit !== undefined) {
            setCharCount(text.length);
        }
    }, [text, limit]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        if (limit === undefined || newText.length <= limit) {
            setText(newText);
            setTextArea(newText);
        }
    };

    return (
        <div className="">
            <textarea
                rows={6}
                placeholder="Type your description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter
                disabled:text-gray-400 disabled:font-light"
                value={text}
                onChange={handleChange}
                disabled={disabled}
            ></textarea>
            {limit !== undefined && (
                <div className="text-gray-500 mt-2">
                    {charCount}/{limit} characters
                </div>
            )}

            {isError && (
                <div className="text-red-500 mt-2">
                    {errorMessage}
                </div>
            )}
        </div>

    );
};

export default Form