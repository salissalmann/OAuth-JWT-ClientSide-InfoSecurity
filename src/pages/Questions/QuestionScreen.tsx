import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Divider, SubTitle } from "../../components/UiComponents/Headings";
import { useState, useEffect, useRef } from "react";
import TabHeader from "./components/TabHeader";
import {
  ButtonFill,
  ButtonOutlined,
  ConfirmationModal,
  CopyIcon,
  DarkButton,
  EmptyModal,
  Loader,
  LoadingIconFilled,
  RightArrowIcon,
  SnapShotModal,
  Switcher,
} from "../../components/UiComponents";
import QuestionDetailsScreen from "./components/QuestionDetailsScreen";
import {
  IMcqQuestion,
  IMcqQuestionPopulated,
  IModulesPopulated,
  IOption,
  IUniDetails,
} from "../Decks/Interfaces";
import QuestionBodyScreen from "./components/QuestionBodyScreen";
import { IQuestionFormErrorState } from "./interface";
import QuestionExtraInfo from "./components/QuestionExtraInfo";

import {
  useCreateMcqQuestion,
  useFetchMcqQuestionDetailById,
  useUpdateMcqQuestion,
} from "../../hooks";
import MyToast, { showToast } from "../../components/UiComponents/MyToast";
import { CancelButton, EditButton, SaveButton } from "../Decks/CreateDeck";
import Badge from "../../components/UiComponents/Badges";
import QuestionPreviewScreen from "./components/QuestionPreviewScreen";
import { isAxiosError } from "axios";
import ErrorsDialog from "./components/ErrorsDialog";
import {
  EMPTY_CONTENT,
  initialErrorState,
  initialPopulatedData,
  initialQuestionState,
  initialTabsOptions,
  tabsType,
} from "./constants";
import storage from "../../utils/useStorage";

export interface IPlainTextFromResponse {
  plainOptionText?: string;
  plainExplanationText?: string;
}

const QuestionScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questionMode, setQuestionMode] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [tabOptions, setTabOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [question, setQuestion] = useState<IMcqQuestion>(initialQuestionState);
  const [disabledQuestionEdit, setDisabledQuestionEdit] = useState(true);
  const [errors, setErrors] =
    useState<IQuestionFormErrorState>(initialErrorState);
  const [isAnyError, setIsAnyError] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isInvalidPath, setIsInvalidPath] = useState<boolean>(false);
  const [showLastActionModal, setShowLastActionModal] =
    useState<boolean>(false);
  const [newQuestionEditUrl, setNewQuestionEditUrl] = useState<string>("");
  const [populatedData, setPopulatedData] = useState<{
    modules: IModulesPopulated;
    uniDetails: IUniDetails[] | [];
  }>(initialPopulatedData);

  const [questionIdsForBulkEdit, setQuestionIdsForBulkEdit] = useState<
    string[]
  >([""]);
  const [activeQuestionIdForBulkEdit, setActiveQuestionIdForBulkEdit] =
    useState<number>(0);

  const questionMutation = useCreateMcqQuestion();
  const questionUpdateMutation = useUpdateMcqQuestion();

  useEffect(() => {
    setActiveTab(initialTabsOptions[activeTabIndex]);
  }, [activeTabIndex]);

  const { questionId } = useParams();

  useEffect(() => {
    setShowLastActionModal(false);
  }, []);

  useEffect(() => {
    const mode = searchParams.get("mode") as string;
    const type = searchParams.get("type") as string;

    setQuestionMode(mode);
    setQuestionType(type);

    if (questionId && mode === "bulkEdit") {
      const questionIds: string[] | null = storage.getItem(
        "questions",
        "session"
      );
      if (questionIds && questionIds.length > 0) {
        const indexOfCurrentIdInUrl = questionIds.findIndex(
          (id) => id === questionId
        );
        setActiveQuestionIdForBulkEdit(indexOfCurrentIdInUrl);
        setQuestionIdsForBulkEdit(questionIds);
      }
    }

    console.log(window.location.pathname, mode, type);

    if (!questionId && !window.location.pathname.includes("editor/") && !mode) {
      // Redirect to /editor?mode=add&type=mcq
      console.log("UsEffect: line 127");
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set("mode", "add");
      newSearchParams.set("type", "mcq");
      // Update the URL
      window.history.pushState({}, "", `?${newSearchParams.toString()}`);
      setQuestionMode("add");
      setQuestionType("mcq");
    }

    if (questionId && !mode) {
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set("mode", "edit");
      // Update the URL
      window.history.pushState({}, "", `?${newSearchParams.toString()}`);
      setQuestionMode("edit");
    } else if (mode === "edit" && !questionId) {
      setIsInvalidPath(true);
      showToast("Please Provide a Question ID", "error");
      return;
    } else if (questionId && mode === "add") {
      setIsInvalidPath(true);
      showToast("Mode must be Edit", "error");
      return;
    }

    if (mode === "add") {
      setDisabledQuestionEdit(false);
    } else {
      setDisabledQuestionEdit(true);
    }
    setActiveTabIndex(0);

    setTabOptions(initialTabsOptions);
    setActiveTab(initialTabsOptions[activeTabIndex]);
  }, [searchParams]);

  const {
    data: questionData,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    error: questionError,
    refetch: reFetchQuestion,
  } = useFetchMcqQuestionDetailById(questionId ? questionId : "");

  useEffect(() => {
    if (!isQuestionLoading && isQuestionError) {
      console.log("questionError: ", questionError);
      showToast(
        "Question Not Found or Invalid Id",
        "error",
        <LoadingIconFilled />
      );
    }

    if (!isQuestionLoading && !isQuestionError && questionData) {
      setQuestionState(questionData.body);
      console.log(questionData.body);
    }
  }, [questionData, isQuestionLoading, questionError, isQuestionError]);

  useEffect(() => {
    questionId && reFetchQuestion();
  }, [questionId]);

  // Function to check if an object is empty
  const isEmptyObject = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  // Function to set the value to EMPTY_CONTENT if the object is empty or undefined
  const handleEmptyObject = (value: object | undefined) => {
    return value === undefined || isEmptyObject(value) ? EMPTY_CONTENT : value;
  };

  // Function to handle undefined values and return the appropriate default value
  const handleUndefined = (value: string, defaultValue: string) => {
    return typeof value !== "undefined" ? value : defaultValue;
  };

  const [plainTextFromResponse, setPlainTextFromResponse] = useState<
    IPlainTextFromResponse[] | []
  >([]);
  // Function to manually set the question state
  const setQuestionState = (response: IMcqQuestionPopulated) => {
    setPopulatedData({
      modules: response?.modules,
      uniDetails: response?.questionSource?.uniDetails
        ? response?.questionSource?.uniDetails
        : [],
    });

    console.log("response.options: ", response.options);
    setQuestion({
      questionText: handleUndefined(response.questionText, ""),
      body: handleEmptyObject(response.body),
      tip: handleEmptyObject(response.tip),
      plainTipText: handleUndefined(
        response.plainTipText ? response.plainTipText : "",
        ""
      ),
      isActive:
        typeof response.isActive === "undefined" ? true : response.isActive,
      degrees: response.degrees || [],
      questionType: response.questionType || initialQuestionState.questionType,
      referencePdfLink:
        response.referencePdfLink || initialQuestionState.referencePdfLink,
      options: response.options
        ? response.options.map((option) => ({
            isCorrect: option.isCorrect || false,
            optionText: option.optionText || EMPTY_CONTENT,
            explanationText: option.explanationText || EMPTY_CONTENT,
            plainOptionText: option.plainOptionText || "",
            plainExplanationText: option.plainExplanationText || "",
          }))
        : initialQuestionState.options,
      questionSource: {
        uniDetails: (
          response?.questionSource?.uniDetails ||
          initialQuestionState.questionSource.uniDetails
        ).map((detail) => {
          let uniId = "";
          if (typeof detail?.uniId === "object") {
            uniId = detail?.uniId?._id || "";
          } else if (typeof detail?.uniId === "string") {
            uniId = detail?.uniId;
          }

          return {
            uniId,
            year: detail?.year?.toString() || "",
            examType: detail?.examType || "",
          };
        }),

        practiceQuestionDetails:
          response?.questionSource?.practiceQuestionDetails ||
          initialQuestionState.questionSource.practiceQuestionDetails,
      },
      modules: {
        moduleId: response?.modules?.moduleId?._id
          ? response?.modules?.moduleId._id
          : "",
        subtopicId: response?.modules?.subtopicId?._id
          ? response?.modules?.subtopicId._id
          : "",
        topicId: response?.modules?.topicId?._id
          ? response?.modules?.topicId?._id
          : "",
        disciplineId: response?.modules?.disciplineId._id
          ? response?.modules?.disciplineId._id
          : "",
      },
      metaData: response.metaData || initialQuestionState.metaData,
    });

    const filteredOptions: IPlainTextFromResponse[] | [] = (
      response.options || []
    ).reduce((filtered: IPlainTextFromResponse[], option: IOption) => {
      if (
        (option.optionText === undefined ||
          option.optionText === null ||
          JSON.stringify(option.optionText) ===
            JSON.stringify(EMPTY_CONTENT)) &&
        option.plainOptionText
      ) {
        // OptionText is undefined, null, or equals EMPTY_CONTENT, and plainOptionText is available
        filtered.push({
          plainOptionText: option.plainOptionText,
          plainExplanationText: option.plainExplanationText || "",
        });
      } else if (
        (option.explanationText === undefined ||
          option.explanationText === null ||
          JSON.stringify(option.explanationText) ===
            JSON.stringify(EMPTY_CONTENT)) &&
        option.plainExplanationText
      ) {
        // ExplanationText is undefined, null, or equals EMPTY_CONTENT, and plainExplanationText is available
        filtered.push({
          plainOptionText: option.plainOptionText,
          plainExplanationText: option.plainExplanationText,
        });
      }
      return filtered;
    }, []);

    setPlainTextFromResponse(filteredOptions);

    if (response.questionType) {
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set("type", response.questionType.toLowerCase());
      window.history.pushState({}, "", `?${newSearchParams.toString()}`);
      setQuestionType(response.questionType.toLocaleLowerCase());
    }
  };

  // Validation function for the entire form
  const validateForm = () => {
    const newErrors = { ...errors };
    let isError = false;

    // Validate 'modules'
    if (!question.modules.moduleId) {
      newErrors.moduleError = {
        error: true,
        message: "Module is required",
      };
      isError = true;
    } else {
      newErrors.moduleError = {
        error: false,
        message: "",
      };
    }
    // Validate 'Discipline'
    if (!question.modules.disciplineId) {
      newErrors.disciplineError = {
        error: true,
        message: "Discipline is required",
      };
      isError = true;
    } else {
      newErrors.disciplineError = {
        error: false,
        message: "",
      };
    }
    // Validate 'Topic'
    if (!question.modules.topicId) {
      newErrors.topicError = {
        error: true,
        message: "Topic is required",
      };
      isError = true;
    } else {
      newErrors.topicError = {
        error: false,
        message: "",
      };
    }

    // Validate 'uniDetails' within 'questionSource'
    if (
      question.questionSource &&
      question.questionSource.uniDetails &&
      question.questionSource.uniDetails.length > 0
    ) {
      const isUniDetailsValid = validateUniDetails(
        question.questionSource.uniDetails
      );
      if (!isUniDetailsValid) {
        newErrors.sourceError = {
          error: true,
          message: "Please fill all fields in University details",
        };
        isError = true;
      } else {
        newErrors.sourceError = {
          error: false,
          message: "",
        };
      }
    }

    // Validate question text length
    if (!question.questionText || question.questionText.trim().length === 0) {
      newErrors.questionTextError = {
        error: true,
        message: "Question text is required",
      };
      isError = true;
    } else {
      newErrors.questionTextError = {
        error: false,
        message: "",
      };
    }

    // Validate options
    if (
      questionType.toLocaleLowerCase() === "mcq" &&
      question.options.length < 2
    ) {
      newErrors.optionErrors = {
        error: true,
        message: "Atleast 2 options are required",
      };
      isError = true;
    } else {
      const optionErrors = question.options.map(
        // (option) => !option.plainOptionText || !option.plainExplanationText
        (option) =>
          !option.plainOptionText ||
          JSON.stringify(option.optionText) === JSON.stringify(EMPTY_CONTENT)
      );

      if (optionErrors.some((hasError) => hasError)) {
        newErrors.optionErrors = {
          error: true,
          message: "Please Fill All Options and Explanations",
        };
        isError = true;
      } else {
        newErrors.optionErrors = {
          error: false,
          message: "",
        };
      }
    }

    // Validate 'options' for MCQ
    if (questionType.toLowerCase() === "mcq" && question.options.length > 0) {
      const hasCorrectOption = question.options.some(
        (option) => option.isCorrect
      );

      if (!hasCorrectOption) {
        newErrors.optionErrors = {
          error: true,
          message: "At least one option must be marked as correct",
        };
        isError = true;
      }
    }

    if (!question.degrees) {
      newErrors.degreesError = {
        error: true,
        message: "Atleast 1 degree is required",
      };
      isError = true;
    } else if (
      (question.degrees.length > 0 && question.degrees[0].trim() === "") ||
      question.degrees.length === 0
    ) {
      newErrors.degreesError = {
        error: true,
        message: "Atleast 1 degree is required",
      };
      isError = true;
    } else {
      newErrors.degreesError = {
        error: false,
        message: "",
      };
    }

    console.log("Errors: ", newErrors);

    // Update the error state
    setErrors(newErrors);
    setIsAnyError(isError);
    return isError;
  };

  // Validation function for uniDetails
  const validateUniDetails = (uniDetails: IUniDetails[]) => {
    if (uniDetails.some(isEmptyUniDetail)) {
      return false;
    } else {
      return true;
    }
  };

  const isEmptyUniDetail = (uniDetail: IUniDetails) => {
    return (
      uniDetail.uniId === "" ||
      uniDetail.year === "" ||
      uniDetail.examType === "Select" ||
      uniDetail.examType === ""
    );
  };

  console.log("🔰 Question: ", question);

  const handleQuestionUpdate = (updatedQuestion: IMcqQuestion) => {
    setQuestion(updatedQuestion);
  };

  const handleActionButton = () => {
    if (isSubmitScreen) {
      setIsQuestionSnapShotModal(true);
      return;
    }

    activeTabIndex < initialTabsOptions.length - 1 &&
      setActiveTabIndex((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleRevertQuestionConfirmationModal = () => {
    setConfirmationModal(true);
  };

  const revertChanges = () => {
    if (
      questionData &&
      typeof questionData.body !== "undefined" &&
      questionData.body
    ) {
      setQuestionState(questionData.body);
    }

    setConfirmationModal(false);
    setDisabledQuestionEdit(true);
  };
  const isSubmitScreen = activeTabIndex === initialTabsOptions.length - 1;
  const handleQuestionSubmit = async () => {
    // Create the updated question object
    const isError = validateForm();
    setIsQuestionSnapShotModal(false);
    if (isError) {
      showToast("Errors.. Can't Create Question", "error");
      window.scrollTo(0, 0);
      setShowErrorsDialog(true);
      return;
    }

    const updatedQuestion = {
      ...question,
      questionType: questionType.toUpperCase(),
    };

    try {
      // Update the question state with the new question object
      setQuestion(updatedQuestion);

      let questionDataCopy = { ...updatedQuestion };

      if (questionDataCopy.modules.subtopicId === "") {
        questionDataCopy = {
          ...questionDataCopy,
          modules: { ...questionDataCopy.modules, subtopicId: undefined },
        };
      }

      // Call the API mutation
      const response = await questionMutation.mutateAsync(questionDataCopy);

      if (response.status === "success") {
        showToast(
          "Question successfully added 🚀. Redirecting to edit page...",
          "success"
        );

        const _id = response.body.mcqQuestion._id;
        const questionType = response.body.mcqQuestion.questionType;

        setNewQuestionEditUrl(
          `/questions/editor/${_id}?mode=edit&type=${questionType}`
        );
        setShowLastActionModal(true);
      }
      // console.log('Response: ', response);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleQuestionUpdateSaveSubmit = async () => {
    if (validateForm()) {
      showToast("Errors", "error");
      setShowErrorsDialog(true);
      return;
    }
    if (!questionId) return;

    try {
      let questionDataCopy = { ...question };

      if (questionDataCopy.modules.subtopicId === "") {
        questionDataCopy = {
          ...questionDataCopy,
          modules: { ...questionDataCopy.modules, subtopicId: undefined },
        };
      }

      // Call the API mutation
      const response = await questionUpdateMutation.mutateAsync({
        mcqId: questionId,
        updatedMcqQuestionData: questionDataCopy,
      });
      if (response.status === "success") {
        showToast("Question Updated Successfully 🚀", "success");
        setDisabledQuestionEdit(true);
        setActiveTabIndex(0);
      }

      // console.log('Response: ', response);
    } catch (error) {
      if (isAxiosError(questionUpdateMutation.error)) {
        const message =
          questionUpdateMutation.error.response?.data?.header?.errorMessage ||
          "Internal Server Error";
        showToast(message, "error");
      } else {
        showToast("Internal Server Error", "error");
      }

      console.error("Error:", error);
    }
  };

  const getSwitcherValue = (enabled: boolean, name: string) => {
    console.log(enabled, name);
    if (name === "published") {
      setQuestion({ ...question, isActive: enabled });
    }
  };

  const textAreaRef = useRef(null);
  const [isQuestionSnapShotModal, setIsQuestionSnapShotModal] =
    useState<boolean>(false);

  const [showErrorsDialog, setShowErrorsDialog] = useState<boolean>(false);
  const copyToClipboard = async () => {
    if (!questionId) return;
    if (textAreaRef.current) {
      try {
        await navigator.clipboard.writeText(questionId);
        showToast("Question ID copied to clipboard", "success");
      } catch (err) {
        showToast("Unable to copy to clipboard", "error");
      }
    }
  };

  const [bulkQuestionActionButtonType, setBulkQuestionActionButtonType] =
    useState<string>("next");
  const handleBulkQuestionClick = (type: "prev" | "next") => {
    const index =
      type === "next"
        ? activeQuestionIdForBulkEdit + 1
        : activeQuestionIdForBulkEdit - 1;

    console.log("questionIdsForBulkEdit: ", questionIdsForBulkEdit);
    console.log(
      "Prev index: ",
      activeQuestionIdForBulkEdit,
      index,
      questionIdsForBulkEdit[index]
    );
    // return;
    navigate(
      `/questions/editor/${questionIdsForBulkEdit[index]}?mode=bulkEdit&type=mcq`
    );
    window.location.reload();
  };
  if (isInvalidPath) {
    return (
      <div className="w-screen mt-52 flex items-center justify-center">
        <MyToast />
        <h1 className="text-gray-800 text-3xl">Invalid Page Url 😓</h1>
      </div>
    );
  }

  if (!isQuestionLoading && isQuestionError) {
    return (
      <div className="w-screen mt-52 flex items-center justify-center">
        <MyToast />
        <h1 className="text-gray-800 text-3xl">Something went wrong 😓</h1>
      </div>
    );
  }
  return (
    <div className="w-full  pb-20">
      <EmptyModal isOpen={showLastActionModal}>
        <div className="grid grid-cols-2 gap-4">
          <ButtonOutlined
            handleClick={() => {
              window.location.reload();
              navigate("/questions/editor?mode=add&type=mcq");
            }}
            height="h-24"
            width="w-full"
            onHoverBgFilled={true}
          >
            Add MCQ
          </ButtonOutlined>
          <ButtonOutlined
            handleClick={() => {
              window.location.reload();
              navigate("/questions/editor?mode=add&type=saq");
            }}
            height="h-24"
            width="w-full"
            onHoverBgFilled={true}
          >
            Add SAQ
          </ButtonOutlined>

          <div className=" col-span-2">
            <ButtonOutlined
              handleClick={() => {
                // window.location.reload();
                navigate(newQuestionEditUrl);
              }}
              height="h-24"
              width="w-full"
              onHoverBgFilled={true}
            >
              Manage Added Question
            </ButtonOutlined>
          </div>
        </div>
      </EmptyModal>
      <ConfirmationModal
        active={confirmationModal}
        message={"Warning: All unsaved changes will be lost."}
        onConfirm={() =>
          questionIdsForBulkEdit.length > 1
            ? bulkQuestionActionButtonType === "next"
              ? handleBulkQuestionClick("next")
              : handleBulkQuestionClick("prev")
            : revertChanges()
        }
        onCancel={() => setConfirmationModal(false)}
      />

      {questionMutation.isLoading && (
        <div className="fixed w-screen h-screen flex items-center justify-center bg-gray-100/60 top-0 left-0 z-[10000]">
          <h1 className="text-2xl bg-white p-10 rounded shadow-sm flex items-center justify-center space-x-2">
            <span>Submitting</span>
            <Loader />
          </h1>
        </div>
      )}

      <MyToast />
      {/* ===== Header =====*/}

      <div className="space-y-5">
        <div className="">
          <div className="flex items-center justify-between flex-col md:flex-row">
            {questionMode === "edit" || questionMode === "bulkEdit" ? (
              <div className="flex items-center space-x-2 flex-wrap">
                <SubTitle>
                  Question id: {questionId ? questionId : "loading.."}
                </SubTitle>
                <textarea
                  ref={textAreaRef}
                  value={questionId}
                  style={{ position: "absolute", left: "-9999px" }}
                  readOnly
                />
                <button onClick={copyToClipboard}>
                  <CopyIcon color="text-gray-600" size="w-6 h-6" />
                </button>

                {question?.questionType ? (
                  question?.questionType === "MCQ" ? (
                    <Badge
                      type="success"
                      label="MCQ"
                      customTheme={true}
                      color="bg-blue-100 text-blue-700"
                      rounded="md"
                      fontWeight="semibold"
                    />
                  ) : (
                    <Badge
                      type="error"
                      label="SAQ"
                      customTheme={true}
                      color="bg-yellow-100 text-yellow-700"
                      fontWeight="semibold"
                    />
                  )
                ) : (
                  <Badge type="error" label="Unknown" />
                )}

                <Switcher
                  size="small"
                  for="published"
                  togglevalue={question.isActive}
                  onChange={getSwitcherValue}
                  disabled={disabledQuestionEdit}
                />
              </div>
            ) : (
              <SubTitle>
                {questionMode + " " + questionType?.toUpperCase()}
              </SubTitle>
            )}
            <div className="flex items-center md:space-x-4 flex-wrap">
              {questionMode === "edit" ||
                (questionMode === "bulkEdit" && (
                  <>
                    {disabledQuestionEdit ? (
                      <EditButton
                        setDisabled={setDisabledQuestionEdit}
                        disabled={disabledQuestionEdit}
                      />
                    ) : (
                      <>
                        <CancelButton
                          disabled={disabledQuestionEdit}
                          callBack={() => {
                            handleRevertQuestionConfirmationModal();
                          }}
                        />
                        <SaveButton
                          disabled={disabledQuestionEdit}
                          callBack={() => {
                            handleQuestionUpdateSaveSubmit();
                          }}
                        />
                      </>
                    )}
                  </>
                ))}
              {questionMode?.toLowerCase() !== "add" && (
                <ButtonFill
                  handleClick={() =>
                    setIsQuestionSnapShotModal(!isQuestionSnapShotModal)
                  }
                  margin={true}
                >
                  Preview
                </ButtonFill>
              )}
            </div>
          </div>

          {questionMode === "bulkEdit" && (
            <div className="flex items-center my-5">
              {activeQuestionIdForBulkEdit > 0 && (
                <ButtonOutlined
                  handleClick={() => {
                    // its mean user not in edit mode
                    if (disabledQuestionEdit) {
                      handleBulkQuestionClick("prev");
                    } else {
                      setBulkQuestionActionButtonType("prev");
                      setConfirmationModal(true);
                    }
                  }}
                  height="h-24"
                  width="w-60"
                  onHoverBgFilled={true}
                >
                  Previous Question
                </ButtonOutlined>
              )}

              {questionId &&
                questionId !==
                  questionIdsForBulkEdit[questionIdsForBulkEdit.length - 1] && (
                  <ButtonOutlined
                    handleClick={() => {
                      if (disabledQuestionEdit) {
                        handleBulkQuestionClick("next");
                      } else {
                        setBulkQuestionActionButtonType("next");
                        setConfirmationModal(true);
                      }
                    }}
                    height="h-24"
                    width="w-60"
                    onHoverBgFilled={true}
                  >
                    Next Question
                  </ButtonOutlined>
                )}
            </div>
          )}

          <Divider />
        </div>

        {showErrorsDialog && (
          <ErrorsDialog
            errors={errors}
            setShowErrorsDialog={setShowErrorsDialog}
            isError={isAnyError}
          />
        )}

        {/*===== Tabs Bar =====*/}
        <TabHeader
          tabOptions={tabOptions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setActiveTabIndex={setActiveTabIndex}
          disabled={questionMode === "add"}
        />

        {activeTab === tabsType.QuestionDetails && (
          <QuestionDetailsScreen
            question={question}
            setQuestion={handleQuestionUpdate}
            errors={errors}
            disabledQuestionEdit={disabledQuestionEdit}
            populatedData={populatedData}
            setPopulatedData={setPopulatedData}
          />
        )}
        {activeTab === tabsType.QuestionBody && (
          <QuestionBodyScreen
            question={question}
            errors={errors}
            setQuestion={handleQuestionUpdate}
            disabledQuestionEdit={disabledQuestionEdit}
            questionType={questionType}
            plainTextFromResponse={plainTextFromResponse}
          />
        )}
        {activeTab === tabsType.ExtraInfo && (
          <QuestionExtraInfo
            disabledQuestionEdit={disabledQuestionEdit}
            question={question}
            setQuestion={handleQuestionUpdate}
          />
        )}

        <SnapShotModal
          active={isQuestionSnapShotModal}
          onCancel={() => setIsQuestionSnapShotModal(false)}
          onConfirm={() => {}}
          isActionButton={questionMode?.toLowerCase() === "add"}
          actionButtonCallBack={() => handleQuestionSubmit()}
          actionButtonText="Submit"
        >
          <QuestionPreviewScreen
            uniDetails={populatedData.uniDetails}
            question={question}
            modules={populatedData.modules}
          />
        </SnapShotModal>

        <div className="flex items-center justify-end gap-4">
          {activeTab !== tabOptions[0] && (
            <ButtonOutlined
              handleClick={() => {
                activeTabIndex > 0 && setActiveTabIndex((prev) => prev - 1);
                window.scrollTo(0, 0);
              }}
            >
              Previous
            </ButtonOutlined>
          )}

          {questionMode?.toLowerCase() !== "add" && isSubmitScreen ? null : (
            <DarkButton
              handleClick={() => {
                handleActionButton();
              }}
              icon={<RightArrowIcon />}
              // disabled={activeTabIndex === initialTabsOptions.length - 1}
            >
              {isSubmitScreen ? "Preview" : "Next"}
            </DarkButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
