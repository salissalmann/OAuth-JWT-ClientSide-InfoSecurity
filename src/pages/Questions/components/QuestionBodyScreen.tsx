import { SetStateAction, useState } from "react";
import Editor from "../../../components/Editor/Editor";
import {
  AddIcon,
  ButtonFill,
  ButtonOutlined,
  ConfirmationModal,
  DeleteIcon,
  PreviewIcon,
  SnapShotModal,
  Switcher,
} from "../../../components/UiComponents";
import {
  Divider,
  SecondaryHeading,
} from "../../../components/UiComponents/Headings";
import { IMcqQuestion, IOption } from "../../Decks/Interfaces";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { IQuestionFormErrorState } from "../interface";
import { copyTextToClipboard } from "./helperFunctions";
import MyToast, { showToast } from "../../../components/UiComponents/MyToast";
import { IPlainTextFromResponse } from "../QuestionScreen";
import { EMPTY_CONTENT } from "../constants";

interface QuestionProps {
  question: IMcqQuestion;
  setQuestion: (question: IMcqQuestion) => void;
  disabledQuestionEdit: boolean;
  errors: IQuestionFormErrorState;
  questionType: string;
  plainTextFromResponse: IPlainTextFromResponse[] | [];
}

const QuestionBodyScreen: React.FC<QuestionProps> = ({
  question,
  setQuestion,
  disabledQuestionEdit,
  errors,
  questionType,
  plainTextFromResponse,
}) => {
  const handleOptionChange = (
    index: number,
    field: string,
    value: object,
    plainText: string
  ) => {
    if (field === "body") {
      setQuestion({ ...question, body: value, questionText: plainText });
    } else if (field === "optionText") {
      const updatedOptions = [...question.options];
      updatedOptions[index].optionText = value;
      updatedOptions[index].plainOptionText = plainText;
      setQuestion({
        ...question,
        options: updatedOptions,
      });
    } else if (field === "explanationText") {
      const updatedOptions = [...question.options];
      updatedOptions[index].explanationText = value;
      updatedOptions[index].plainExplanationText = plainText;
      setQuestion({
        ...question,
        options: updatedOptions,
      });
    }
  };

  const handleCorrectOption = (
    index: number,
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: boolean
  ) => {
    if (field === "isCorrect") {
      const updatedOptions = question.options.map((option, i) => {
        if (i === index) {
          return { ...option, isCorrect: true };
        } else {
          return { ...option, isCorrect: false }; // Set other options as incorrect
        }
      });

      setQuestion({
        ...question,
        options: updatedOptions,
      });

      return;
    }
  };

  const addOption = () => {
    const updatedOptions = [...question.options];
    updatedOptions.push({
      optionText: EMPTY_CONTENT,
      isCorrect: false,
      explanationText: EMPTY_CONTENT,
    });
    setQuestion({
      ...question,
      options: updatedOptions,
    });
  };

  const removeOption = (index: number) => {
    setResetEditors(false);
    console.log("Prev: ", question.options);
    const updatedOptions = question.options.filter((_, i) => i !== index);
    console.log("Updated Option Befor: ", updatedOptions);
    if (updatedOptions.length === 1) {
      updatedOptions[0].isCorrect = true;
    }
    console.log("Updated Option After: ", updatedOptions);
    setQuestion({
      ...question,
      options: updatedOptions,
    });

    setConfirmationModal(false);
    setTimeout(() => {
      setResetEditors(true);
    }, 500);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  const showSnapshotModal = (text: string) => {
    if (text.trim().length === 0) return;
    setModalText(text);
    setIsModalVisible(true);
  };

  const hideSnapshotModal = () => {
    setIsModalVisible(false);
  };

  const handleCopyText = (text: string) => {
    copyTextToClipboard(text).then((isSuccessful) => {
      if (isSuccessful) {
        showToast("Text copied to clipboard!", "success");
      } else {
        showToast("Failed to copy text to clipboard.", "error");
      }
      setIsModalVisible(false);
    });
  };

  const [resetEditors, setResetEditors] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);

  return (
    <div className="space-y-10">
      <MyToast />
      <ConfirmationModal
        active={confirmationModal}
        message={"Are you sure you want to Remove? "}
        onConfirm={() => removeOption(activeOptionIndex)}
        onCancel={() => setConfirmationModal(false)}
      />

      <div className="space-y-4">
        <SecondaryHeading>Question Details</SecondaryHeading>
        {errors.questionTextError.error && (
          <span className="text-red-700 animate-pulse">
            {errors.questionTextError.message
              ? errors.questionTextError.message
              : "Required"}
          </span>
        )}
        <Divider />
        <div className="">
          <div className="flex items-center space-x-2">
            <SecondaryHeading darkColor={true}>Question Text</SecondaryHeading>

            <button onClick={() => showSnapshotModal(question.questionText)}>
              <PreviewIcon size="w-5 h-5" />
            </button>
          </div>

          {question.questionText.length > 0 &&
            (!question.body || question.body === EMPTY_CONTENT) && (
              <span className="text-emerald-600 inline-block mb-2 font-medium text-sm">
                Editor is empty but we have plain text. Click on preview icon
                above
              </span>
            )}

          {isModalVisible && (
            <SnapShotModal
              active={true}
              onCancel={hideSnapshotModal}
              onConfirm={hideSnapshotModal}
              isActionButton={true}
              actionButtonText="Copy Text"
              actionButtonCallBack={() => handleCopyText(modalText)}
            >
              {modalText}
            </SnapShotModal>
          )}
          <Editor
            reset={false}
            editorState={
              question.body as SerializedEditorState<SerializedLexicalNode>
            }
            setEditorState={(
              newState: SetStateAction<
                SerializedEditorState<SerializedLexicalNode>
              >,
              plainText
            ) => handleOptionChange(-1, "body", newState, plainText)}
            disabled={disabledQuestionEdit}
            getPlainText={true}
          />
        </div>
      </div>

      <div className="space-y-4">
        {questionType?.toLocaleLowerCase() === "mcq" ? (
          <SecondaryHeading>Question Options</SecondaryHeading>
        ) : (
          <SecondaryHeading>Answer</SecondaryHeading>
        )}
        {errors.optionErrors.error && (
          <span className="text-red-700 animate-pulse">
            {errors.optionErrors.message
              ? errors.optionErrors.message
              : "Please Fill All Fields."}
          </span>
        )}

        <Divider />
        {question.options.map((option: IOption, index: number) => (
          <div className="space-y-2" key={index}>
            {questionType?.toLowerCase() === "mcq" && (
              <>
                <div className="flex items-center justify-between flex-wrap">
                  <div className="flex items-center space-x-3">
                    <SecondaryHeading darkColor={true}>{`Option ${
                      index + 1
                    }`}</SecondaryHeading>
                    <Switcher
                      togglevalue={option.isCorrect}
                      for={`correctOption-${index}`}
                      onChange={(val: boolean) =>
                        handleCorrectOption(index, "isCorrect", val)
                      }
                      size="small"
                    />
                    <span className="">Correct Option</span>
                  </div>
                  {!disabledQuestionEdit && (
                    <ButtonOutlined
                      handleClick={() => {
                        setActiveOptionIndex(index);
                        setConfirmationModal(true);
                      }}
                      icon={<DeleteIcon />}
                      disabled={question.options.length === 1}
                    >
                      Remove
                    </ButtonOutlined>
                  )}
                </div>
                <Divider />
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="">
                <div className="flex items-center space-x-2">
                  <SecondaryHeading darkColor={true}>
                    {questionType?.toLowerCase() === "saq"
                      ? "SAQ Answer"
                      : " Option Text"}
                  </SecondaryHeading>
                  <button
                    onClick={() =>
                      showSnapshotModal(
                        option.plainOptionText &&
                          option.plainOptionText.trim().length > 0
                          ? option.plainOptionText
                          : plainTextFromResponse[index].plainOptionText
                          ? (plainTextFromResponse[index]
                              .plainOptionText as string)
                          : ""
                      )
                    }
                  >
                    <PreviewIcon size="w-5 h-5" />
                  </button>
                </div>

                <Editor
                  getPlainText={true}
                  reset={resetEditors}
                  editorState={
                    option.optionText
                      ? (option.optionText as SerializedEditorState<SerializedLexicalNode>)
                      : (EMPTY_CONTENT as SerializedEditorState<SerializedLexicalNode>)
                  }
                  setEditorState={(
                    newState: SetStateAction<
                      SerializedEditorState<SerializedLexicalNode>
                    >,
                    plainText
                  ) =>
                    handleOptionChange(index, "optionText", newState, plainText)
                  }
                  disabled={disabledQuestionEdit}
                />
                {JSON.stringify(option.optionText) ===
                  JSON.stringify(EMPTY_CONTENT) &&
                  plainTextFromResponse.length > 0 &&
                  plainTextFromResponse[index] &&
                  plainTextFromResponse[index].plainOptionText && (
                    <span className="text-emerald-600 inline-block mt-2 font-medium text-sm">
                      Option is empty but we have plain text.
                    </span>
                  )}
              </div>
              <div className="">
                <div className="flex items-center space-x-2">
                  <SecondaryHeading darkColor={true}>
                    Explanation
                  </SecondaryHeading>
                  <button
                    onClick={() =>
                      showSnapshotModal(
                        option.plainExplanationText &&
                          option.plainExplanationText.trim().length > 0
                          ? option.plainExplanationText
                          : plainTextFromResponse[index]?.plainExplanationText
                          ? (plainTextFromResponse[index]
                              .plainExplanationText as string)
                          : ""
                      )
                    }
                  >
                    <PreviewIcon size="w-5 h-5" />
                  </button>
                </div>

                <Editor
                  reset={resetEditors}
                  editorState={
                    option.explanationText
                      ? (option.explanationText as SerializedEditorState<SerializedLexicalNode>)
                      : (EMPTY_CONTENT as SerializedEditorState<SerializedLexicalNode>)
                  }
                  setEditorState={(
                    newState: SetStateAction<
                      SerializedEditorState<SerializedLexicalNode>
                    >,
                    plainText
                  ) =>
                    handleOptionChange(
                      index,
                      "explanationText",
                      newState,
                      plainText
                    )
                  }
                  disabled={disabledQuestionEdit}
                  getPlainText={true}
                />

                {JSON.stringify(
                  option.explanationText ? option.explanationText : {}
                ) === JSON.stringify(EMPTY_CONTENT) &&
                  plainTextFromResponse.length > 0 &&
                  plainTextFromResponse[index] &&
                  plainTextFromResponse[index].plainExplanationText && (
                    <span className="text-emerald-600 inline-block mt-2 font-medium text-sm">
                      Explanation is empty but we have plain text.
                    </span>
                  )}
              </div>
            </div>
          </div>
        ))}

        {!disabledQuestionEdit && questionType?.toLowerCase() !== "saq" && (
          <ButtonFill handleClick={addOption} icon={<AddIcon />}>
            Add Another Option
          </ButtonFill>
        )}
      </div>
    </div>
  );
};

export default QuestionBodyScreen;
