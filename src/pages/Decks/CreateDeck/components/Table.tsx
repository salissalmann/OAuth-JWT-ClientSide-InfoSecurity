import { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DropResult,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import {
  AddIcon,
  ButtonFill,
  ButtonOutlined,
  Checkbox,
  Drawer,
  DropDown,
  SearchIcon,
  SnapShotModal,
  BarsIcon,
  DeleteIcon,
  ConfirmationModal,
  LoadingIconFilled,
  EyeIcon,
  EditIcon,
  SettingDotsIcon,
} from "../../../../components/UiComponents";
import Badge from "../../../../components/UiComponents/Badges";

import {
  DisciplineDropDown,
  ModuleDropDown,
  SubTopicsDropDown,
  TopicsDropDown,
  UniversityDropDown,
} from "../../components";
import ExistingQuestionDeckForm from "../../components/ExistingQuestionDeckForm";
import QuestionViewSnapShot from "../../../DeckGroups/Components/QuestionViewSnapShot";
import { CancelButton, EditButton, SaveButton } from "../../CreateDeck";
import {
  useAddQuestionToDeck,
  useFetchAllMcqQuestionsByFilters,
  useFetchDeckTypes,
} from "../../../../hooks";
import TableSnapShot from "./TableSnapShot";
import MyToast, {
  showToast,
} from "../../../../components/UiComponents/MyToast";
import {
  IDiscipline,
  IDisciplineRelation,
  IDropDown,
  IMcqQuestionPopulated,
  IModule,
  IRelation,
  ISubTopic,
  ITopic,
  ITopicRelation,
  IUniversity,
  initialQuestionState,
} from "../../Interfaces";

import DropdownSelect from "../../components/DropdownSelect";
import { useParams } from "react-router-dom";

const Table = ({
  deckFetchedMcqsId,
  deckFetchedRelations = [],
  fetchedDeckQuestion,
  contentLoading = true,
}: {
  deckFetchedMcqsId: string[];
  deckFetchedRelations: IRelation[] | [];
  fetchedDeckQuestion: IMcqQuestionPopulated[];
  contentLoading: boolean;
}) => {
  // FIleration Purpose
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [fetchedMcqIds, setFetchedMcqIds] = useState<string[]>([]);
  // Initialize the 'relations' state as an empty array.
  const [relations, setRelations] = useState<IRelation[]>([]);
  // Questions which user added in deck
  const [deckQuestions, setDeckQuestions] = useState<IMcqQuestionPopulated[]>(
    []
  );
  const distinctStatus = ["Active", "InActive"];

  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState("OptionScreen"); // 1- OptionScreen  2- FilterScreen 3- ByQuestionIdScreen
  const [selectedQuestions, setSelectedQuestions] = useState<
    IMcqQuestionPopulated[]
  >([]);
  const [selectedQuestionsForDelete, setSelectedQuestionsForDelete] = useState<
    string[]
  >([]);

  useEffect(() => {
    setRelations(deckFetchedRelations);
    setFetchedMcqIds(deckFetchedMcqsId);
    setDeckQuestions(fetchedDeckQuestion);
  }, [deckFetchedRelations, deckFetchedMcqsId, fetchedDeckQuestion]);

  type IFilterValues = {
    [key: string]: {
      _id?: string;
      value?: string;
    };
  };

  const initialFilterValues: IFilterValues = {
    university: {},
    discipline: {},
    module: {},
    topic: {},
    subTopic: {},
  };

  const [filterValues, setFilterValues] =
    useState<IFilterValues>(initialFilterValues);

  const { deckId } = useParams();

  // Get Drop Down Values
  const getSelectedUniversityValue = (selectedValue: IUniversity) => {
    if (selectedValue._id === undefined || selectedValue._id === "") {
      setFilterValues({ ...filterValues, university: {} });
    } else if (typeof selectedValue === "object") {
      setClearFilters(false);
      setFilterValues({
        ...filterValues,
        university: {
          _id: selectedValue._id,
          value: selectedValue.universityName,
        },
      });
    }
  };
  const getSelectedModuleValue = (selectedValue: IModule) => {
    if (selectedValue._id === undefined || selectedValue._id === "") {
      setFilterValues({ ...filterValues, module: {} });
    } else if (typeof selectedValue === "object") {
      setClearFilters(false);
      setFilterValues({
        ...filterValues,
        module: {
          _id: selectedValue._id,
          value: selectedValue.moduleName,
        },
      });
    }
  };

  const getSelectedDisciplineValue = (selectedValue: IDiscipline) => {
    if (selectedValue._id === undefined || selectedValue._id === "") {
      setFilterValues({ ...filterValues, discipline: {} });
    } else if (typeof selectedValue === "object") {
      setClearFilters(false);
      setFilterValues({
        ...filterValues,
        discipline: {
          _id: selectedValue._id,
          value: selectedValue.disciplineName,
        },
      });
    }
  };
  const getSelectedTopicValue = (selectedValue: ITopic) => {
    if (selectedValue._id === undefined || selectedValue._id === "") {
      setFilterValues({ ...filterValues, topic: {} });
    } else if (typeof selectedValue === "object") {
      setClearFilters(false);
      setFilterValues({
        ...filterValues,
        topic: {
          _id: selectedValue._id,
          value: selectedValue.topicName,
        },
      });
    }
  };

  const getSelectedSubTopicValue = (selectedValue: ISubTopic) => {
    if (selectedValue._id === undefined || selectedValue._id === "") {
      setFilterValues({ ...filterValues, subTopic: {} });
    } else if (typeof selectedValue === "object") {
      setClearFilters(false);
      setFilterValues({
        ...filterValues,
        subTopic: {
          _id: selectedValue._id,
          value: selectedValue.subtopicName,
        },
      });
    }
  };

  // console.log('Selected Questions for Delete: ', selectedQuestionsForDelete);

  const handleCheckboxChangeForDelete = (item: string, isChecked: boolean) => {
    // console.log('Inside Delete: ', item, isChecked);
    if (isChecked) {
      // Add the item to the selectedselectedQuestionsForDelete  array if it's not already in the array
      if (
        !selectedQuestionsForDelete.some(
          (selectedItem) => selectedItem === item
        )
      ) {
        setSelectedQuestionsForDelete([...selectedQuestionsForDelete, item]);
      }
    } else {
      // Remove the item from the selectedQuestionsForDelete array
      setSelectedQuestionsForDelete(
        selectedQuestionsForDelete.filter(
          (selectedItem) => selectedItem !== item
        )
      );
    }
  };

  const handleButtonClick = () => {
    setIsOpen(false);
    setTimeout(() => {
      setScreen("FilterScreen");
    }, 200);

    setTimeout(() => {
      setIsOpen(true);
    }, 400);
  };

  const buildFilterParams = (filters: IFilterValues) => {
    const params = [];

    for (const key in filters) {
      const filterValue = filters[key]._id || filters[key].value;

      if (key === 'deckType') {
        // Assuming deckType is a string
        if (filterValue) {
          params.push(`${key}=${filterValue}`);
        }
      } else {
        if (filterValue) {
          params.push(`${key}Id=${filterValue}`);
        }
      }
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
  };

  const params = buildFilterParams(filterValues);
  const [questions, setQuestions] = useState([]);
  const {
    data: filteredMcqs,
    isLoading: isFilteredMcqsLoading,
    isError: isFilteredMcqsError,
    refetch,
  } = useFetchAllMcqQuestionsByFilters(params);

  useEffect(() => {
    if (!isFilteredMcqsLoading && !isFilteredMcqsError && filteredMcqs) {
      // console.log('Inside Filter Mcqs : ', filteredMcqs.body.mcqQuestions);
      setQuestions(filteredMcqs.body.mcqQuestions);
    }
  }, [filteredMcqs, isFilteredMcqsLoading, isFilteredMcqsError]);

  const handleFilterSubmit = () => {
    // console.log(params);
    // console.log('Inside Search Submit 🚀');
    refetch();
  };
  // console.log('QUestion from APi: ', questions);
  // Filtered Questions from API

  const updateDeckInfoMutation = useAddQuestionToDeck();

  const addQuestionToDeck = async (
    questionsTobeSave: IMcqQuestionPopulated[],
    type = "normalEdit"
  ) => {
    // console.log('🔴 questionsTobeSave: ', questionsTobeSave);
    const relation = type === "editFromTable" ? [] : relations;

    // Create a helper function to find an existing module by moduleId
    const findModule = (relations: IRelation[], moduleId: string) => {
      return relations.find((module) => module.moduleId === moduleId);
    };

    const questionIds = type === "editFromTable" ? [] : fetchedMcqIds;
    // Iterate through the questions to build the relationship
    // let pos = 1;
    const newQuestionsUserWantsToAdd: IMcqQuestionPopulated[] = [];
    questionsTobeSave.forEach((question: IMcqQuestionPopulated) => {
      // console.log('🔴 questionsTobeSave - question: ', question);
      // console.log("question ids: ", question._id);

      //If question is already in our deck then return
      if (questionIds.includes(question._id)) return;
      // else add question to array for track also append that question in relation
      newQuestionsUserWantsToAdd.push(question);
      questionIds.push(question._id);
      const module = {
        moduleId: question?.modules?.moduleId._id || "",
        moduleName: question?.modules?.moduleId.moduleName || "",
      };
      const discipline = {
        disciplineId: question?.modules?.disciplineId._id || "",
        disciplineName: question?.modules?.disciplineId.disciplineName || "",
      };
      const topic = {
        topicId: question?.modules?.topicId._id || "",
        topicName: question?.modules?.topicId.topicName || "",
      };

      // Find an existing module, if it exists
      const existingModule = findModule(relation, module.moduleId);

      if (existingModule) {
        // console.log(
        //   `🟢 ${pos}~Existing Module Found: ${existingModule.moduleName}`
        // );
        !existingModule.mcqsIds.includes(question._id) &&
          existingModule.mcqsIds.push(question._id);

        // Module exists, check if discipline exists
        const existingDiscipline = existingModule.disciplines.find(
          (item: IDisciplineRelation) =>
            item.disciplineId === discipline.disciplineId
        );

        if (existingDiscipline) {
          // console.log(
          //   `🟢 ${pos}~Existing Discipline Found: ${existingDiscipline.disciplineName}`
          // );
          // Discipline exists, check if topic exists

          const existingTopic = existingDiscipline.topics.find(
            (item: ITopicRelation) => item.topicId === topic.topicId
          );

          if (existingTopic) {
            // console.log(
            //   `🟢 ${pos}~Existing Topic Found: ${existingTopic.topicName}`
            // );
            // Topic exists, add the question to the topic
            existingTopic.mcqsIds.push(question._id);
            existingTopic.numMcqs++;
          } else {
            // console.log(
            //   `🔴 ${pos}~Existing Topic Not Found: ${topic.topicName}`
            // );
            // Topic doesn't exist, create a new topic
            existingDiscipline.topics.push({
              topicId: topic.topicId,
              topicName: topic.topicName,
              numMcqs: 1,
              mcqsIds: [question._id],
            });
          }
          existingDiscipline.numMcqs++;
          existingDiscipline.mcqsIds.push(question._id);
        } else {
          // Discipline doesn't exist, create a new discipline
          // console.log(
          //   `🔴 ${pos}~Existing Discipline Not Found: ${discipline.disciplineName}`
          // );
          existingModule.disciplines.push({
            disciplineId: discipline.disciplineId,
            disciplineName: discipline.disciplineName,
            numMcqs: 1,
            mcqsIds: [question._id],
            topics: [
              {
                topicId: topic.topicId,
                topicName: topic.topicName,
                numMcqs: 1,
                mcqsIds: [question._id],
              },
            ],
          });
        }

        existingModule.numMcqs++;
      } else {
        // console.log(
        //   `🔴 ${pos}~Existing Module Not Found: ${module.moduleName}`
        // );
        // Module doesn't exist, create a new module
        const newModule = {
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          numMcqs: 1,
          mcqsIds: [question._id],
          disciplines: [
            {
              disciplineId: discipline.disciplineId,
              disciplineName: discipline.disciplineName,
              numMcqs: 1,
              mcqsIds: [question._id],
              topics: [
                {
                  topicId: topic.topicId,
                  topicName: topic.topicName,
                  numMcqs: 1,
                  mcqsIds: [question._id],
                },
              ],
            },
          ],
        };
        relation.push(newModule);
      }
      // pos++;
    });

    setRelations(relations);
    //  console.log("🔰 Relations : ", relation);
    //  console.log("Question State: ", questionIds);
    if (deckId) {
      const updatedDeckData = await updateDeckInfoMutation.mutateAsync({
        deckId: deckId,
        body: {
          relations: relation,
          questionIds: questionIds,
        },
      });
      // console.log(updatedDeckData);

      // console.log('deckQuestions:', deckQuestions);
      // console.log(
      //   'newQuestionsUserWantsToAdd: Not in prev mcqs',
      //   newQuestionsUserWantsToAdd
      // );

      if (updatedDeckData.status === "success") {
        if (type === "editFromTable") {
          // console.log('inside editFromTable');
          setDeckQuestions(updatedQuestions);
        } else {
          setDeckQuestions([...deckQuestions, ...newQuestionsUserWantsToAdd]);
        }
        // console.log('questionIds saved: ', questionIds);
        setFetchedMcqIds(updatedDeckData.data.data.mcqsIds);

        setSelectedQuestions([]);

        setDisabledTableEdit(true);
        showToast("Questions Added to Deck Successfully 🚀", "success");
      }
      // console.log('🔰 Updated Deck Data : ', updatedDeckData);
    }
  };

  // console.log('🟡 Deck Questions: ', deckQuestions);

  const [QuestionSnapShotModal, setQuestionSnapShotModal] = useState(false);
  const [selectedQuestionForView, setSelectedQuestionForView] =
    useState<IMcqQuestionPopulated>(initialQuestionState);
  // console.log("Questions: ", questions);

  const initialTableFilterState = {
    module: "",
    discipline: "",
    topic: "",
  };
  const [filters, setFilters] = useState(initialTableFilterState);

  useEffect(() => {
    setFilters({
      module: "",
      discipline: "",
      topic: "",
    });
  }, []);

  // Function to filter the questions
  const filterQuestions = (questions: IMcqQuestionPopulated[]) => {
    return questions?.filter((question: IMcqQuestionPopulated) => {
      // Apply filters

      const matchesSearch =
        question.modules?.moduleId?.moduleName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.modules?.disciplineId?.disciplineName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.modules?.topicId?.topicName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.modules?.subtopicId?.subtopicName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const status = selectedStatus === "Active" ? true : false;
      const matchesStatus =
        selectedStatus === "" || selectedStatus == "All"
          ? question
          : question.isActive === status;
      const isModuleMatch =
        filters.module === "" ||
        filters.module == "All" ||
        question.modules?.moduleId?._id === filters.module;

      const isDisciplineMatch =
        filters.discipline === "" ||
        filters.discipline == "All" ||
        question.modules?.disciplineId?._id === filters.discipline;
      const isTopicMatch =
        filters.topic === "" ||
        filters.topic == "All" ||
        question.modules?.topicId?._id === filters.topic;

      // Return true for questions that match all filter conditions
      return (
        matchesSearch &&
        matchesStatus &&
        isModuleMatch &&
        isDisciplineMatch &&
        isTopicMatch
      );
    });
  };

  const [disabledTableEdit, setDisabledTableEdit] = useState(true);

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalType, setConfirmationModalType] = useState("");

  const [updatedQuestions, setUpdatedQuestions] = useState<
    IMcqQuestionPopulated[] | []
  >([]);

  useEffect(() => {
    setUpdatedQuestions(deckQuestions);
  }, [deckQuestions]);

  useEffect(() => {
    if (!disabledTableEdit) {
      setSelectedStatus("");
      setFilters(initialTableFilterState);
      setSelectedQuestionsForDelete([]);
    }
  }, [disabledTableEdit]);


  const [decktypes, setDeckTypes] = useState([])
  const { data, isLoading, isError } = useFetchDeckTypes()


  useEffect(() => {
    if (!isLoading && !isError && data) {
      setDeckTypes(data.data)
    }
  }, [
    isLoading,
    isError,
    data
  ])



  const handleConfirmDeleteAction = () => {
    setConfirmationModal(false);
    const removedDeletedQuestionsCollection = updatedQuestions.filter(
      (d) => !selectedQuestionsForDelete.includes(d._id)
    );

    setUpdatedQuestions(removedDeletedQuestionsCollection);
  };

  const filteredQuestions: IMcqQuestionPopulated[] | [] =
    filterQuestions(updatedQuestions);

  const [allData, setAllData] = useState({
    status: ["Active", "InActive"],
    universities: [],
    modules: [],
    disciplines: [],
    topics: [],
    subTopics: [],
  });
  const getAllOptions = (
    name: string,
    values: string[] | number[] | object[]
  ) => {
    //  console.log("Name: ", name, values);
    setAllData({ ...allData, [name]: values });
  };
  // console.log('All Data: ', allData);

  const [clearFilters, setClearFilters] = useState(false);
  const handleClearAll = () => {
    setClearFilters(true);
    // setQuestions([]);
    setFilterValues(initialFilterValues);
  };

  // =====================================
  // 🔰 Drop Down Data States and Functions
  // =====================================

  function generateUniqueDropdownOptions<T>(
    items: T[],
    idKey: keyof T,
    nameKey: keyof T
  ): IDropDown[] {
    const uniqueIds: string[] = [];
    return items
      .filter((item) => {
        const itemId = item[idKey];
        if (itemId && !uniqueIds.includes(itemId as string)) {
          uniqueIds.push(itemId as string);
          return true;
        }
        return false;
      })
      .map((item) => ({
        _id: item[idKey] as string,
        name: item[nameKey] as string,
      }));
  }

  // Example usage for Modules
  const uniqueModulesAsDropdowns = generateUniqueDropdownOptions(
    updatedQuestions.map((question) => question.modules?.moduleId),
    "_id",
    "moduleName"
  );

  // Example usage for Disciplines
  const uniqueDisciplineAsDropdowns = generateUniqueDropdownOptions(
    updatedQuestions.map((question) => question.modules?.disciplineId),
    "_id",
    "disciplineName"
  );
  const uniqueTopicsAsDropdowns = generateUniqueDropdownOptions(
    updatedQuestions.map((question) => question.modules?.topicId),
    "_id",
    "topicName"
  );

  const getDeckTypeValue = (selectedValue: string) => {
    if (selectedValue === 'select') {
      setFilterValues({ ...filterValues, deckType: {} });
    } else {
      setClearFilters(false);
      setFilterValues({
        ...filterValues,
        deckType: {
          _id: '',
          value: selectedValue,
        },
      });
    }
  };

  const handleDropDownFilters = (name: string, option: string) => {
    setFilters({ ...filters, [name]: option });
  };

  //🔰 React Dnd Stuff :
  const onDragEnd = (result: DropResult) => {
    // console.log(result);

    if (!result.destination) {
      return;
    }

    // Implement the logic to reorder the deckQuestions array.
    const items = [...updatedQuestions];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // setDeckQuestions(items);

    setUpdatedQuestions(items);
  };

  const areTableUpdates = () => {
    // Check if the lengths are different (questions added or deleted)
    if (deckQuestions.length !== updatedQuestions.length) {
      return true;
    }

    // Check if the sequence of objects based on _id is different (reordering)
    for (let i = 0; i < deckQuestions.length; i++) {
      if (deckQuestions[i]._id !== updatedQuestions[i]._id) {
        return true;
      }
    }

    // If the lengths are the same and the sequence is the same, no updates
    return false;
  };

  const handleDeckQuestionTableUpdate = () => {
    setDisabledTableEdit(false);
    const hasChanged = areTableUpdates();
    if (hasChanged) {
      // console.log('handleDeckQuestionTableUpdate:', updatedQuestions);
      addQuestionToDeck(updatedQuestions, "editFromTable");
    } else {
      showToast("No Changes Found!", "info");
    }
  };

  const handleRevertQuestionsConfirmationModal = () => {
    const hasChanged = areTableUpdates();
    if (hasChanged) {
      setConfirmationModalType("revertTableChanges");
      setConfirmationModal(true);
    } else {
      setDisabledTableEdit(true);
    }
  };

  const revertTableChanges = () => {
    setConfirmationModal(false);
    setConfirmationModalType("");
    setUpdatedQuestions(deckQuestions);
    setDisabledTableEdit(true);
  };

  const [viewCrudOptions, setViewCrudOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current) {
        const dropdown = dropdownRef.current;
        if (!dropdown.contains(event.target as Node) && !event.target) {
          setViewCrudOptions(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      {screen == "OptionScreen" && (
        <Drawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Add Questions"
          size="lg"
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <button
              className=" text-primary p-7 cursor-pointer hover:bg-primary hover:text-white transition-all ease-in-out border border-gray-200 rounded shadow-xs"
              onClick={() => handleButtonClick()}
            >
              Filter
            </button>
            <button
              className="text-primary  disabled:opacity-60 disabled:bg-white disabled:text-primary disabled:cursor-not-allowed p-7 cursor-pointer hover:bg-primary hover:text-white transition-all ease-in-out border border-gray-200 rounded shadow-xs"
              onClick={() => setScreen("FilterScreen")}
              disabled={true}
            >
              Search
            </button>
            <button
              className="text-primary disabled:opacity-60 disabled:bg-white disabled:text-primary disabled:cursor-not-allowed  p-7 cursor-pointer hover:bg-primary hover:text-white transition-all ease-in-out border border-gray-200 rounded shadow-xs"
              onClick={() => setScreen("ByQuestionIdScreen")}
            >
              By Question ID
            </button>
            <button
              className="text-primary disabled:opacity-60 disabled:bg-white disabled:text-primary disabled:cursor-not-allowed  p-7 cursor-pointer hover:bg-primary hover:text-white transition-all ease-in-out border border-gray-200 rounded shadow-xs"
              onClick={() => setScreen("FilterScreen")}
              disabled={true}
            >
              Bulk Import
            </button>
          </div>
        </Drawer>
      )}

      {screen === "ByQuestionIdScreen" && (
        <Drawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Add New Question"
          size="xl"
          backScreen={true}
          prevScreenName="OptionScreen"
          setScreen={setScreen}
          unSavedData={selectedQuestions.length > 0}
        >
          <ExistingQuestionDeckForm
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            prevMcqsId={fetchedMcqIds}
            addQuestionToDeck={addQuestionToDeck}
            setScreen={setScreen}
          />
        </Drawer>
      )}
      {screen == "FilterScreen" && (
        <Drawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Search and Filter"
          size="xl"
          backScreen={true}
          prevScreenName="OptionScreen"
          setScreen={setScreen}
          unSavedData={selectedQuestions.length > 0}
        >
          <MyToast />
          <div className="grid grid-cols-2 grid-rows-2 gap-10">
            <UniversityDropDown
              onSelect={getSelectedUniversityValue}
              getAllOptions={getAllOptions}
              reset={clearFilters}
            />
            <DisciplineDropDown
              onSelect={getSelectedDisciplineValue}
              getAllOptions={getAllOptions}
              reset={clearFilters}
            />
            <ModuleDropDown
              onSelect={getSelectedModuleValue}
              getAllOptions={getAllOptions}
              reset={clearFilters}
            />
            <TopicsDropDown
              onSelect={getSelectedTopicValue}
              getAllOptions={getAllOptions}
              reset={clearFilters}
            />
            <SubTopicsDropDown
              onSelect={getSelectedSubTopicValue}
              getAllOptions={getAllOptions}
              reset={clearFilters}
            />
            <DropDown
              name="deckType"
              label="Deck Type"
              // value="SELECT"
              options={decktypes}
              // options={['QUIZ', 'ANNUAL_EXAM', 'MODULE_EXAM']}
              onSelect={(value) => {
                getDeckTypeValue(value as string);
                console.log("value:", value);
              }}
              width="w-full"
              reset={clearFilters}
            />
          </div>

          <div className="flex items-center justify-end my-5 space-x-4">
            <div className="w-52">
              <ButtonOutlined
                handleClick={() => {
                  handleClearAll();
                }}
                width="w-full"
              >
                Clear All
              </ButtonOutlined>
            </div>
            <div className="w-52">
              {" "}
              <ButtonFill
                handleClick={() => handleFilterSubmit()}
                width="w-full"
              >
                Search
              </ButtonFill>
            </div>
          </div>

          <TableSnapShot
            questions={questions}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            setDeckQuestions={setDeckQuestions}
            setIsOpen={setIsOpen}
            setScreen={setScreen}
            addQuestionToDeck={addQuestionToDeck}
            prevMcqsId={fetchedMcqIds}
            isFilteredMcqsLoading={isFilteredMcqsLoading}
          />
        </Drawer>
      )}
      <section className=" antialiased my-10">
        <div className="mx-auto ">
          <div className="bg-white  relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <SearchIcon color="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                      placeholder="Search"
                      required={true}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={!disabledTableEdit}
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                {disabledTableEdit ? (
                  <EditButton
                    setDisabled={setDisabledTableEdit}
                    disabled={disabledTableEdit}
                  />
                ) : (
                  <div className="flex items-center space-x-4">
                    <CancelButton
                      disabled={disabledTableEdit}
                      callBack={() => handleRevertQuestionsConfirmationModal()}
                    />
                    <SaveButton
                      disabled={disabledTableEdit}
                      callBack={() => handleDeckQuestionTableUpdate()}
                    />
                  </div>
                )}
                <ButtonFill
                  icon={<AddIcon />}
                  handleClick={() => setIsOpen(true)}
                  disabled={!disabledTableEdit}
                >
                  Add Questions
                </ButtonFill>
              </div>
            </div>

            {contentLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div role="status" className="flex items-center space-x-2">
                  <span className="relative text-xl font-semibold text-gray-700 flex items-center space-x-3">
                    Loading
                  </span>
                  <LoadingIconFilled />
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 items-end p-4">
                  <DropDown
                    label="Status"
                    value={selectedStatus}
                    options={distinctStatus}
                    all={true}
                    onSelect={(selectedValue) =>
                      setSelectedStatus(String(selectedValue))
                    }
                    disabled={!disabledTableEdit}
                    width="w-full"
                  />

                  <DropdownSelect
                    onValueChange={handleDropDownFilters}
                    propertyKey="name"
                    reset={false}
                    options={uniqueModulesAsDropdowns}
                    all={true}
                    for="module"
                    width=""
                    disabled={!disabledTableEdit}
                  />
                  <DropdownSelect
                    onValueChange={handleDropDownFilters}
                    propertyKey="name"
                    reset={false}
                    options={uniqueDisciplineAsDropdowns}
                    all={true}
                    for="discipline"
                    width=""
                    disabled={!disabledTableEdit}
                  />
                  <DropdownSelect
                    onValueChange={handleDropDownFilters}
                    propertyKey="name"
                    reset={false}
                    options={uniqueTopicsAsDropdowns}
                    all={true}
                    for="topic"
                    width=""
                    disabled={!disabledTableEdit}
                  />

                  <ConfirmationModal
                    active={confirmationModal}
                    message={
                      confirmationModalType === "bulkDelete"
                        ? "Are you sure you want to remove these questions from deck?"
                        : "You have some unsaved changes"
                    }
                    onConfirm={() =>
                      confirmationModalType === "bulkDelete"
                        ? handleConfirmDeleteAction()
                        : revertTableChanges()
                    }
                    onCancel={() => setConfirmationModal(false)}
                  />

                  {!disabledTableEdit && (
                    <ButtonOutlined
                      margin={false}
                      icon={<DeleteIcon />}
                      disabled={selectedQuestionsForDelete?.length < 1}
                      handleClick={() => {
                        setConfirmationModal(true);
                        setConfirmationModalType("bulkDelete");
                      }}
                    >
                      Bulk Delete
                    </ButtonOutlined>
                  )}
                </div>

                <SnapShotModal
                  active={QuestionSnapShotModal}
                  onCancel={() => setQuestionSnapShotModal(false)}
                  onConfirm={() => {}}
                >
                  <QuestionViewSnapShot
                    selectedQuestionForView={selectedQuestionForView}
                  />
                </SnapShotModal>

                <table className="w-full text-sm text-left text-gray-500 mb-20">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-4 py-4"></th>

                      <th scope="col" className="px-4 py-4">
                        S.no
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Id
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Question
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Modules
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Discipline
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Topic
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Sub Topic
                      </th>

                      <th scope="col" className="px-4 pyicon-3 text-center">
                        Type
                      </th>

                      <th scope="col" className="px-4 pyicon-3 text-center">
                        Status
                      </th>
                      <th scope="col" className="px-4 pyicon-3 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="deckQuestions" direction="vertical">
                      {(provided: DroppableProvided) => (
                        <tbody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {filteredQuestions &&
                            filteredQuestions.length > 0 &&
                            filteredQuestions.map((item, index) => {
                              return (
                                <Draggable
                                  key={item._id}
                                  draggableId={item._id}
                                  index={index}
                                  isDragDisabled={disabledTableEdit}
                                >
                                  {(provided: DraggableProvided) => (
                                    <tr
                                      className="border-b text-xs bg-white"
                                      key={item._id}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                    >
                                      <th
                                        scope="col"
                                        className="px-4 py-4"
                                        {...provided.dragHandleProps}
                                      >
                                        <BarsIcon />
                                      </th>

                                      <th
                                        scope="col"
                                        className="px-4 py-4 text-center"
                                      >
                                        {index + 1}
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-3 h-full text-xs  font-medium text-gray-900 whitespace-nowrap"
                                      >
                                        <div className="flex items-center">
                                          {" "}
                                          {!disabledTableEdit && (
                                            <Checkbox
                                              for={item._id}
                                              showLabel={false}
                                              checked={selectedQuestionsForDelete.some(
                                                (selectedItem) =>
                                                  selectedItem === item._id
                                              )}
                                              onChange={(checked) =>
                                                handleCheckboxChangeForDelete(
                                                  item._id,
                                                  checked
                                                )
                                              }
                                            />
                                          )}
                                          {item._id}
                                        </div>
                                      </th>
                                      <td
                                        className="px-4 py-3 text-xs cursor-pointer"
                                        onClick={() => {
                                          setSelectedQuestionForView(item);
                                          setQuestionSnapShotModal(true);
                                        }}
                                      >
                                        {item.questionText.length > 80
                                          ? `${item?.questionText?.slice(
                                              0,
                                              80
                                            )}...`
                                          : item?.questionText
                                          ? item?.questionText
                                          : "------"}
                                      </td>

                                      <td className="px-4 py-3">
                                        {item.modules?.moduleId?.moduleName}
                                      </td>
                                      <td className="px-4 py-3">
                                        {item.modules.disciplineId
                                          ?.disciplineName
                                          ? item.modules.disciplineId
                                              ?.disciplineName
                                          : "Unknown"}
                                      </td>
                                      <td className="px-4 py-3">
                                        {item.modules.topicId?.topicName
                                          ? item.modules.topicId?.topicName
                                          : "Unknown"}
                                      </td>
                                      <td className="px-4 py-3">
                                        {item.modules.subtopicId?.subtopicName
                                          ? item.modules.subtopicId
                                              ?.subtopicName
                                          : "Unknown"}
                                      </td>

                                      <td className="px-4 py-3">
                                        <div className="mx-auto w-fit">
                                          {item.questionType ? (
                                            item.questionType === "MCQ" ? (
                                              <Badge
                                                type="success"
                                                label="MCQ"
                                                customTheme={true}
                                                color="bg-blue-100 text-blue-700"
                                              />
                                            ) : (
                                              <Badge
                                                type="error"
                                                label="SAQ"
                                                customTheme={true}
                                                color="bg-yellow-100 text-yellow-700"
                                              />
                                            )
                                          ) : (
                                            <Badge
                                              type="error"
                                              label="Unknown"
                                            />
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="mx-auto w-fit">
                                          {item.isActive ? (
                                            <Badge
                                              type="success"
                                              label="Active"
                                            />
                                          ) : (
                                            <Badge
                                              type="error"
                                              label="inActive"
                                            />
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 flex items-center justify-center relative">
                                        <button
                                          id={`${item._id}-dropdown-button`}
                                          data-dropdown-toggle={`${item._id}-dropdown`}
                                          className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                                          type="button"
                                          onClick={() => {
                                            // console.log('Clicked');
                                            setSelectedQuestionForView(item);
                                            setViewCrudOptions(true);
                                          }}
                                        >
                                          <SettingDotsIcon />
                                        </button>
                                        <div
                                          ref={dropdownRef}
                                          id={`${item._id}-dropdown`}
                                          className={`${
                                            viewCrudOptions &&
                                            selectedQuestionForView._id ===
                                              item._id
                                              ? ""
                                              : "hidden"
                                          }  w-44 bg-white rounded divide-y divide-gray-100 shadow absolute top-0 right-0 z-[100]`}
                                        >
                                          <ul
                                            className="py-1 text-sm"
                                            aria-labelledby={`${item._id}-dropdown-button`}
                                          >
                                            {/* Edit Button */}
                                            <li>
                                              <a
                                                href={`/questions/editor/${
                                                  item._id
                                                }?mode=edit&type=${
                                                  item.questionType
                                                    ? item.questionType.toLowerCase()
                                                    : "mcq"
                                                }`}
                                                target="_blank"
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100 text-gray-700 space-x-2"
                                              >
                                                <EditIcon />
                                                <span>Edit</span>
                                              </a>
                                            </li>
                                            {/* Preview Button */}
                                            <li>
                                              <button
                                                type="button"
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                onClick={() => {
                                                  setQuestionSnapShotModal(
                                                    true
                                                  );
                                                }}
                                              >
                                                <EyeIcon />
                                                <span> Preview</span>
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                type="button"
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                onClick={() => {
                                                  if (disabledTableEdit) {
                                                    showToast(
                                                      "You need to edit the deck group to delete a deck",
                                                      "error"
                                                    );
                                                    return;
                                                  }

                                                  handleCheckboxChangeForDelete(
                                                    item._id,
                                                    true
                                                  );

                                                  setConfirmationModal(true);
                                                  setConfirmationModalType(
                                                    "bulkDelete"
                                                  );
                                                }}
                                              >
                                                <DeleteIcon />
                                                <span>Remove</span>
                                              </button>
                                            </li>

                                            <li>
                                              <button
                                                type="button"
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-red-500 "
                                                onClick={() =>
                                                  setViewCrudOptions(false)
                                                }
                                              >
                                                <span>Close</span>
                                              </button>
                                            </li>
                                          </ul>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </Draggable>
                              );
                            })}
                          {provided.placeholder}
                        </tbody>
                      )}
                    </Droppable>
                  </DragDropContext>
                </table>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Table;
