import React, { useEffect, useState } from "react";
import {
  AddIcon,
  ButtonFill,
  ButtonOutlined,
  ConfirmationModal,
  DeleteIcon,
  DropDown,
  Input,
  Label,
  TextArea,
} from "../../../components/UiComponents";
import {
  Divider,
  SecondaryHeading,
} from "../../../components/UiComponents/Headings";

import {
  IDiscipline,
  IMcqQuestion,
  IModule,
  IModulesPopulated,
  ISubTopic,
  ITopic,
  IUniDetails,
  IUniversity,
} from "../../Decks/Interfaces";
import {
  DisciplineDropDown,
  ModuleDropDown,
  SubTopicsDropDown,
  TopicsDropDown,
  UniversityDropDown,
} from "../../Decks/components";
import MyToast, { showToast } from "../../../components/UiComponents/MyToast";
import { IQuestionFormErrorState } from "../interface";
import { useFetchDeckTypes } from "../../../hooks";

interface QuestionProps {
  question: IMcqQuestion;
  setQuestion: (question: IMcqQuestion) => void;
  errors: IQuestionFormErrorState;
  disabledQuestionEdit: boolean;
  populatedData: {
    uniDetails: IUniDetails[] | [];
    modules: IModulesPopulated;
  };

  setPopulatedData: (populatedData: {
    modules: IModulesPopulated;
    uniDetails: IUniDetails[] | [];
  }) => void;
}

const QuestionDetailsScreen: React.FC<QuestionProps> = ({
  question,
  setQuestion,
  disabledQuestionEdit,
  populatedData,
  setPopulatedData,
  errors,
}) => {
  useEffect(() => {
    const uniDetailsLength = question.questionSource?.uniDetails?.length || 1;
    const sourceSectionsUniversities: string[] = Array.from(
      { length: uniDetailsLength },
      () => "University"
    );

    setSourceSections(sourceSectionsUniversities);
  }, [question.questionSource?.uniDetails]);
  const [sourceSections, setSourceSections] = useState<string[]>([]);

  const [activeSubTopicIds, setActiveSubTopicIds] = useState<string[]>([]);

  const updateModuleProperty = (property: string, id: string) => {
    if (id === undefined || id === "") {
      setQuestion({
        ...question,
        modules: {
          ...question.modules,
          [property]: "",
        },
      });
    } else {
      setQuestion({
        ...question,
        modules: {
          ...question.modules,
          [property]: id,
        },
      });
    }
  };

  interface CommonModuleProperties {
    _id: string;
    disciplineName?: string;
    moduleName?: string;
    topicName?: string;
    subtopicName?: string;
  }

  type Property = "disciplineId" | "moduleId" | "topicId" | "subtopicId";
  type fieldNames =
    | "disciplineName"
    | "moduleName"
    | "topicName"
    | "subtopicName";

  const updatePopulatedData = (
    property: Property,
    selectedValue: CommonModuleProperties,
    valueKey: fieldNames
  ) => {
    const updatedData = {
      ...populatedData,
      ...populatedData.uniDetails,
      modules: {
        ...populatedData.modules,
        [property]: {
          _id: selectedValue._id,
          [valueKey]: selectedValue[valueKey],
        },
      },
    };
    setPopulatedData(updatedData);
    updateModuleProperty(property, selectedValue._id);
  };
  const updatePopulatedUniversities = (
    university: IUniversity,
    index: number
  ) => {
    console.log("university: ", university, index);
    const updatedData = { ...populatedData }; // Create a copy of populatedData

    // Ensure that updatedData.uniDetails[index] is defined
    if (!updatedData.uniDetails[index]) {
      updatedData.uniDetails[index] = {
        uniId: {
          _id: "",
          universityName: "",
        },
        year: "",
        examType: "",
      };
    }

    updatedData.uniDetails[index].uniId = {
      _id: university._id,
      universityName: university.universityName,
    };

    console.log(updatedData.uniDetails[index]);
    console.log("updatedData: ", updatedData);
    setPopulatedData(updatedData);
  };

  const getSelectedDisciplineValue = (selectedValue: IDiscipline) => {
    updateModuleProperty("disciplineId", selectedValue._id);
    updatePopulatedData("disciplineId", selectedValue, "disciplineName");
  };
  const getSelectedModuleValue = (selectedValue: IModule) => {
    updateModuleProperty("moduleId", selectedValue._id);
    updatePopulatedData("moduleId", selectedValue, "moduleName");
  };
  const getSelectedTopicValue = (selectedValue: ITopic) => {
    console.log("Itopics: ", selectedValue);
    if (selectedValue.subtopicIds) {
      setActiveSubTopicIds(selectedValue.subtopicIds);
    } else {
      setActiveSubTopicIds([]);
    }
    updateModuleProperty("topicId", selectedValue._id);
    updatePopulatedData("topicId", selectedValue, "topicName");
  };
  const getSelectedSubTopicValue = (selectedValue: ISubTopic) => {
    updateModuleProperty("subtopicId", selectedValue._id);
    updatePopulatedData("subtopicId", selectedValue, "subtopicName");
  };

  const addNewSourceSection = (sourceType: string) => {
    if (
      sourceType === "Practice Tags" &&
      sourceSections.includes("Practice Tags")
    ) {
      // Handle "Practice Tags" uniqueness here
      showToast("Practice Tags already added", "error");
      return;
    }

    // Make a copy of the current source sections
    const updatedSections = [...sourceSections];
    updatedSections.push(sourceType);
    setSourceSections(updatedSections);

    // Update the question state with the new source section
    const updatedQuestion = { ...question };

    if (updatedQuestion.questionSource) {
      if (!updatedQuestion.questionSource.uniDetails) {
        updatedQuestion.questionSource.uniDetails = [];
      }
      if (sourceType === "University") {
        updatedQuestion.questionSource.uniDetails.push({
          uniId: "",
          year: "",
          examType: "Select",
        });
        const updatedpPopulatedData = { ...populatedData } as {
          modules: IModulesPopulated;
          uniDetails: IUniDetails[];
        };

        updatedpPopulatedData.uniDetails.push({
          uniId: {
            _id: "",
            universityName: "",
          },
          year: "",
          examType: "",
        });

        setPopulatedData(updatedpPopulatedData);
      }
    }
    setQuestion(updatedQuestion);
  };

  const updatePopulatedUniversitiesState = (
    key: "year" | "examType",
    value: string,
    index: number
  ) => {
    if (value.toLowerCase() === "select") {
      value = "";
    }
    const updatedpPopulatedData = { ...populatedData } as {
      modules: IModulesPopulated;
      uniDetails: IUniDetails[];
    };
    updatedpPopulatedData.uniDetails[index][key] = value;
  };
  const [activeIndex, setActiveIndex] = useState(-1);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalType, setConfirmationModalType] =
    useState("sourceSection"); //

  const handleSourceRemove = () => {
    console.log("Index: ", activeIndex);

    const updatedSections = [...sourceSections];
    updatedSections.splice(activeIndex, 1);
    setSourceSections(updatedSections);

    // Update the question state when a section is removed
    const updatedQuestion = { ...question };
    const updatedPopulatedData = { ...populatedData };

    if (updatedQuestion.questionSource) {
      if (updatedQuestion.questionSource.uniDetails) {
        updatedQuestion.questionSource.uniDetails.splice(activeIndex, 1);
        setQuestion(updatedQuestion);
      }
    }

    // Remove the university from the populatedData state
    if (updatedPopulatedData.uniDetails) {
      updatedPopulatedData.uniDetails.splice(activeIndex, 1);
    }
    setPopulatedData(updatedPopulatedData);

    setConfirmationModal(false);
    setActiveIndex(-1);
  };

  const [decktypes, setDeckTypes] = useState([]);
  const { data, isLoading, isError } = useFetchDeckTypes();

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setDeckTypes(data.data);
    }
  }, [isLoading, isError, data]);

  return (
    <div className="space-y-10">
      <MyToast />
      <ConfirmationModal
        active={confirmationModal}
        message={"Are you sure you want to Remove? "}
        onConfirm={() =>
          confirmationModalType === "sourceSection"
            ? handleSourceRemove()
            : () => {}
        }
        onCancel={() => setConfirmationModal(false)}
      />

      <div className=" space-y-4">
        <SecondaryHeading>Question Modules</SecondaryHeading>
        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <DisciplineDropDown
            onSelect={getSelectedDisciplineValue}
            reset={false}
            value={question.modules.disciplineId}
            disabled={disabledQuestionEdit}
            isError={errors.disciplineError.error}
            errorMessage={errors.disciplineError.message}
          />
          <ModuleDropDown
            onSelect={getSelectedModuleValue}
            reset={false}
            value={question.modules.moduleId}
            disabled={disabledQuestionEdit}
            isError={errors.moduleError.error}
            errorMessage={errors.moduleError.message}
          />
          <TopicsDropDown
            onSelect={getSelectedTopicValue}
            reset={false}
            value={question.modules.topicId}
            disabled={disabledQuestionEdit}
            isError={errors.topicError.error}
            errorMessage={errors.topicError.message}
          />
          <SubTopicsDropDown
            onSelect={getSelectedSubTopicValue}
            reset={false}
            activeSubTopicIds={activeSubTopicIds}
            value={question.modules.subtopicId}
            disabled={disabledQuestionEdit}
            isError={errors.subTopicError.error}
            errorMessage={errors.subTopicError.message}
          />
        </div>
      </div>
      <div className=" space-y-4">
        <SecondaryHeading>Question Source</SecondaryHeading>
        {errors.sourceError.error && (
          <span className="text-red-700">
            {errors.sourceError.message
              ? errors.sourceError.message
              : "Required Field."}
          </span>
        )}

        <Divider />

        {sourceSections?.map((sectionType, index) => (
          <div className="space-y-4" key={index}>
            <div className="flex items-center justify-between flex-wrap">
              <SecondaryHeading darkColor={true}>
                {"Source " + (index + 1)}
              </SecondaryHeading>

              <ButtonOutlined
                handleClick={() => {
                  setActiveIndex(index);
                  setConfirmationModal(true);
                  setConfirmationModalType("sourceSection");
                }}
                icon={<DeleteIcon />}
                disabled={disabledQuestionEdit || sourceSections.length == 1}
              >
                Remove
              </ButtonOutlined>
            </div>
            <div className="w-full">
              <DropDown
                label="Source"
                value={sectionType}
                options={["University"]}
                // options={["University", "Book Source", "Practice Tags"]}
                onSelect={(value) => {
                  const updatedSections = [...sourceSections];
                  updatedSections[index] = value as string;
                  setSourceSections(updatedSections);

                  const updatedQuestion = { ...question };
                  if (
                    value === "University" &&
                    updatedQuestion.questionSource
                  ) {
                    if (!updatedQuestion.questionSource.uniDetails) {
                      updatedQuestion.questionSource.uniDetails = [];
                    }
                    updatedQuestion.questionSource.uniDetails[index] = {
                      uniId: "",
                      year: "",
                      examType: "Select",
                    };
                  }
                  setQuestion(updatedQuestion);
                }}
                width="w-56"
                disabled={disabledQuestionEdit}
              />
            </div>
            {sectionType === "University" &&
              question.questionSource &&
              question.questionSource.uniDetails && (
                <div className="grid md:grid-cols-4 gap-4">
                  <UniversityDropDown
                    onSelect={(selectedValue) => {
                      const updatedQuestion = { ...question };
                      if (
                        updatedQuestion.questionSource &&
                        updatedQuestion.questionSource.uniDetails
                      ) {
                        updatedQuestion.questionSource.uniDetails[index].uniId =
                          selectedValue._id;

                        updatePopulatedUniversities(selectedValue, index);
                      }

                      setQuestion(updatedQuestion);

                      if (
                        selectedValue._id === undefined ||
                        selectedValue._id === ""
                      ) {
                        console.log("nothing..");
                      } else if (typeof selectedValue === "object") {
                        console.log(selectedValue);
                      }
                    }}
                    reset={false}
                    value={
                      question.questionSource.uniDetails[index] &&
                      typeof question.questionSource.uniDetails[index].uniId !==
                        "undefined"
                        ? question.questionSource.uniDetails[index].uniId
                        : ""
                    }
                    disabled={disabledQuestionEdit}
                  />

                  <div className="">
                    <Label>Year</Label>
                    <Input
                      type="text"
                      placeholder="Year"
                      value={question.questionSource.uniDetails[index]?.year}
                      name="year"
                      onChange={(_, value) => {
                        if (value.length <= 4) {
                          // Check if the length is 4 or less
                          const updatedQuestion = { ...question };

                          if (
                            updatedQuestion.questionSource &&
                            updatedQuestion.questionSource.uniDetails
                          ) {
                            updatedQuestion.questionSource.uniDetails[
                              index
                            ].year = value;
                          }

                          updatePopulatedUniversitiesState(
                            "year",
                            value,
                            index
                          );
                          setQuestion(updatedQuestion);
                        }
                      }}
                      isError={false}
                      disabled={disabledQuestionEdit}
                    />
                  </div>

                  <DropDown
                    name="deckType"
                    label="Deck Type"
                    // value="SELECT"
                    options={decktypes}
                    // options={['QUIZ', 'ANNUAL_EXAM', 'MODULE_EXAM']}

                    value={question.questionSource.uniDetails[index]?.examType}
                    onSelect={(value) => {
                      // Handle exam type value change here
                      const updatedQuestion = { ...question };
                      if (
                        updatedQuestion.questionSource &&
                        updatedQuestion.questionSource.uniDetails
                      ) {
                        updatePopulatedUniversitiesState(
                          "examType",
                          value as string,
                          index
                        );

                        updatedQuestion.questionSource.uniDetails[
                          index
                        ].examType = value as string;
                      }
                      setQuestion(updatedQuestion);
                    }}
                    disabled={disabledQuestionEdit}
                    width="w-full"
                  />
                </div>
              )}

            {sectionType === "Practice Tags" && (
              <div className="w-full ">
                <Label>Deck Description</Label>
                <TextArea
                  limit={300}
                  for="deckDescription"
                  value={""}
                  setValue={() => {}}
                  disabled={false}
                  isError={false}
                  errorMessage={""}
                />
              </div>
            )}
          </div>
        ))}

        {/* Additional code for "Practice Tags" */}
        {/* {sourceSections.includes("Practice Tags") && (
          <div className="w-full ">
            <Label>Deck Description</Label>
            <TextArea
              limit={300}
              for="deckDescription"
              value={""}
              setValue={() => {}}
              disabled={false}
              isError={false}
              errorMessage={""}
            />
          </div>
        )} */}

        {!disabledQuestionEdit && (
          <ButtonFill
            handleClick={() => addNewSourceSection("University")}
            icon={<AddIcon />}
            disabled={disabledQuestionEdit}
          >
            Add Another Source
          </ButtonFill>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailsScreen;
