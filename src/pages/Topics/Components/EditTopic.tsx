import { useEffect, useState } from "react";
import {
    Input,
    Label,
} from "../../../components/UiComponents/Forms";
import { ITopic } from "../../../interfaces/Topics/topics.interface";


export interface IErrorObject {
    error: boolean;
    message: string;
}

interface FormProps {
    topic: ITopic,
    setTopic: (data: ITopic) => void,
    disabled: boolean,
    errors: {
        topicNameError: IErrorObject,
        topicDescriptionError: IErrorObject
    }
}

export const Form: React.FC<FormProps> = ({
    topic,
    setTopic,
    disabled = false,
    errors
}) => {

    const handleInputChange = (name: string, value: string) => {
        setTopic({ ...topic, [name]: value });
    };

    return (
        <div className="rounded-sm  bg-white shadow-default ">
            <form className="my-4">
                <div className="space-y-2">
                    <Label>Topic Name</Label>
                    <Input
                        type="text"
                        name="topicName"
                        placeholder="Type your topic name"
                        onChange={handleInputChange}
                        disabled={disabled}
                        value={topic.topicName}
                        isError={errors?.topicNameError.error}
                        errorMessage={errors?.topicNameError.message}
                    />

                    <Label>Topic Description</Label>
                    <TextArea limit={300}
                        setTextArea={(text) => {
                            setTopic({ ...topic, topicDescription: text });
                        }}
                        disabled={disabled}
                        value={topic.topicDescription}
                        isError={errors?.topicDescriptionError.error}
                        errorMessage={errors?.topicDescriptionError.message}
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
                <span className="text-red-700">
                    {errorMessage ? errorMessage : "Required Field."}
                </span>
            )}
        </div>
    );
};

export default Form