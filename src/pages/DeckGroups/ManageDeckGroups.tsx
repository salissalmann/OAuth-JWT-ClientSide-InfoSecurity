import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchGroupDecks } from "../../hooks";
import Form from "./Components/EditGroupForm";
import Banner from "./Components/GroupBanner";
import DecksTable from "./Components/DecksTable";
import { LoadingIconFilled } from "../../components/UiComponents";


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


const ManageDeckGroups = () => {

  const { deckGroupId } = useParams();
  const { data, isLoading, isError, error } = useFetchGroupDecks(deckGroupId ? deckGroupId : "");

  const [disabled, setDisabled] = useState(true)
  const [formData, setFormData] = useState<IDeckGroupData>({
    id: "",
    deckName: "",
    deckSource: "",
    deckDescription: "",
    published: false,
    decksInformation: []
  });
  const [originalDeckGroupInfo, setOriginalDeckGroupInfo] = useState<IDeckGroupData>(formData)
  useEffect(() => {
    if (!isLoading && !isError && data) {
      setFormData({
        id: data.data.data._id,
        deckName: data.data.data.groupName,
        deckSource: data.data.data.groupSource,
        deckDescription: data.data.data.groupDescription,
        published: data.data.data.published,
        decksInformation: data.data.data.deckInformation
      });
      setOriginalDeckGroupInfo({
        id: data.data.data._id,
        deckName: data.data.data.groupName,
        deckSource: data.data.data.groupSource,
        deckDescription: data.data.data.groupDescription,
        published: data.data.data.published,
        decksInformation: data.data.data.deckInformation
      })
    }
  }, [isLoading, isError, data]);
  const HandleDisabled = () => { setDisabled(!disabled) }

  const ErrorsInitialState = {
    deckGroupNameError: {
      error: false,
      message: '',
    },
    deckGroupDescriptionError: {
      error: false,
      message: '',
    },
    deckGroupSourceError: {
      error: false,
      message: '',
    },
  }

  const [errors, setErrors] = useState(ErrorsInitialState);
  const validateForm = () => {
    const newErrors = { ...errors };
    let isError = false;

    if (!formData.deckName) {
      newErrors.deckGroupNameError = {
        error: true,
        message: 'Deck Group Name is required',
      };
      isError = true;
    } else {
      newErrors.deckGroupNameError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckDescription) {
      newErrors.deckGroupDescriptionError = {
        error: true,
        message: 'Deck Group Description is required',
      };
      isError = true;
    } else {
      newErrors.deckGroupDescriptionError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckSource) {
      newErrors.deckGroupSourceError = {
        error: true,
        message: 'Deck Group Source is required',
      };
      isError = true;
    }
    else {
      newErrors.deckGroupSourceError = {
        error: false,
        message: '',
      };
    }
    setErrors(newErrors);
    return isError;
  }
  if (!isLoading && isError) {
    return (
      <div className="w-screen mt-52 flex items-center justify-center rela">
        <h1 className="text-gray-800 text-3xl">Sorry!, We are unavailable right now</h1>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-screen mt-52 flex items-center justify-center">
        <div role="status" className="flex items-center space-x-2">
          <span className="relative text-3xl font-semibold text-gray-700 flex items-center space-x-3">
            Loading
          </span>
          <LoadingIconFilled />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full pb-20">
        <Banner
          category="Deck Groups"
          heading="Deck Groups"
          formData={formData}
          setFormData={setFormData}
          disabled={disabled}
          handleDisabled={HandleDisabled}
          originalDeckGroupInfo={originalDeckGroupInfo}
          validateForm={validateForm}
        />
        <Form
          formData={formData}
          setFormData={setFormData}
          disabled={disabled}
          errors={errors}
        />
        <DecksTable data={formData.decksInformation ? formData.decksInformation : []} isLoading={isLoading} isError={isError} error={error} deckGroupId={deckGroupId ? deckGroupId : ""} />
      </div>
    </>
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
        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
        value={text}
        onChange={handleChange}
        disabled={disabled}
      ></textarea>
      {limit !== undefined && (
        <div className="text-gray-500 mt-2">
          {charCount}/{limit} characters
        </div>
      )}
      {isError && <div className="text-red-500 mt-2">{errorMessage}</div>}
    </div>
  );
};

export default ManageDeckGroups;