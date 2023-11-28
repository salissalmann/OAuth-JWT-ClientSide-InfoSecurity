import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonOutlined, Drawer } from "../../components/UiComponents";
import SearchQuestionByIdDrawer from "./components/SearchQuestionByIdDrawer";
import {
  Divider,
  SecondaryHeading,
  SubTitle,
} from "../../components/UiComponents/Headings";
import { IMcqQuestionPopulated } from "../Decks/Interfaces";

import SearchQuestionsByFiltersDrawer from "./components/SearchQuestionsByFiltersDrawer";
import storage from "../../utils/useStorage";

const PreQuestionScreen = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [screen, setScreen] = useState<string>("");
  const nav = useNavigate();

  const handleEditQuestionById = (data: IMcqQuestionPopulated) => {
    if (!data._id) return null;
    setIsOpen(false);
    const url = `/questions/editor/${data._id}`;
    nav(url);
  };

  useEffect(() => {
    if (screen === "mainScreen") {
      setIsOpen(false);
    }
  }, [screen]);

  const handleEditSubmitFromFilterDrawer = (
    questions: IMcqQuestionPopulated[]
  ) => {
    if (questions.length > 0 && questions[0]._id) {
      const isBulkEdit = questions.length > 1;
      const questionIds = isBulkEdit ? questions.map((ques) => ques._id) : [];
      isBulkEdit && storage.setItem("questions", questionIds, "session");
      const url = `/questions/editor/${questions[0]._id}?mode=${
        isBulkEdit ? "bulkEdit" : "edit"
      }`;
      nav(url);
    }
  };
  return (
    <div className="w-full">
      <div className="space-y-8">
        <SubTitle>Questions</SubTitle>

        {/* ===Create=== */}
        <div className="space-y-4">
          <SecondaryHeading>Create</SecondaryHeading>
          <Divider />
          <div className="flex items-center gap-4">
            <ButtonOutlined
              handleClick={() => {
                nav("/questions/editor?mode=add&type=mcq");
              }}
              height="h-24"
              width="w-56"
              onHoverBgFilled={true}
            >
              Add MCQ
            </ButtonOutlined>
            <ButtonOutlined
              handleClick={() => {
                nav("/questions/editor?mode=add&type=saq");
              }}
              height="h-24"
              width="w-56"
              onHoverBgFilled={true}
            >
              Add SAQ
            </ButtonOutlined>
          </div>
        </div>
        {/* ===Manage=== */}
        <div className="space-y-4">
          <SecondaryHeading>Manage</SecondaryHeading>
          <Divider />
          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            <ButtonOutlined
              handleClick={() => {
                setScreen("searchByFilters");
                setIsOpen(true);
              }}
              height="h-24"
              width="w-full md:w-56"
              onHoverBgFilled={true}
            >
              Filter
            </ButtonOutlined>
            <ButtonOutlined
              handleClick={() => {}}
              height="h-24"
              width="w-full md:w-56"
              onHoverBgFilled={true}
              disabled={true}
            >
              Search
            </ButtonOutlined>
            <ButtonOutlined
              handleClick={() => {
                setScreen("searchById");
                setIsOpen(true);
              }}
              height="h-24"
              width="w-full md:w-56"
              onHoverBgFilled={true}
            >
              By Question ID
            </ButtonOutlined>
          </div>
        </div>
      </div>
      {screen === "searchById" && (
        <Drawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Search Question By Id"
          size="xl"
          backScreen={true}
          prevScreenName=""
          setScreen={setScreen}
        >
          <SearchQuestionByIdDrawer
            prevMcqsId={[]}
            setScreen={setScreen}
            primaryButtonText="Edit"
            primaryButtonCallBack={handleEditQuestionById}
          />
        </Drawer>
      )}


      {screen === "searchByFilters" && (
        <SearchQuestionsByFiltersDrawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          screen={screen}
          setScreen={setScreen}
          primaryCallback={handleEditSubmitFromFilterDrawer}
        />
      )}
    </div>
  );
};

export default PreQuestionScreen;
