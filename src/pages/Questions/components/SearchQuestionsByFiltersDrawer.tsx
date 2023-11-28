import { FC, useEffect, useState } from 'react';
import {
  ButtonFill,
  ButtonOutlined,
  Drawer,
  DropDown,
} from '../../../components/UiComponents';
import MyToast from '../../../components/UiComponents/MyToast';
import {
  DisciplineDropDown,
  ModuleDropDown,
  SubTopicsDropDown,
  TopicsDropDown,
  UniversityDropDown,
} from '../../Decks/components';
import {
  IDiscipline,
  IMcqQuestionPopulated,
  IModule,
  ISubTopic,
  ITopic,
  IUniversity,
} from '../../Decks/Interfaces';
import { useFetchAllMcqQuestionsByFilters, useFetchDeckTypes } from '../../../hooks';
import TableSnapShot from '../../Decks/CreateDeck/components/TableSnapShot';

interface SearchQuestionsByFiltersDrawerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  screen: string;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  primaryCallback: (questions: IMcqQuestionPopulated[]) => void;
}

const SearchQuestionsByFiltersDrawer: FC<
  SearchQuestionsByFiltersDrawerProps
> = ({ isOpen, setIsOpen, setScreen, primaryCallback }) => {
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
    deckType: {},
  };


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


  const [clearFilters, setClearFilters] = useState(false);

  const [filterValues, setFilterValues] =
    useState<IFilterValues>(initialFilterValues);

  // Get Drop Down Values
  const getSelectedUniversityValue = (selectedValue: IUniversity) => {
    if (selectedValue._id === undefined || selectedValue._id === '') {
      setFilterValues({ ...filterValues, university: {} });
    } else if (typeof selectedValue === 'object') {
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
    if (selectedValue._id === undefined || selectedValue._id === '') {
      setFilterValues({ ...filterValues, module: {} });
    } else if (typeof selectedValue === 'object') {
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
    if (selectedValue._id === undefined || selectedValue._id === '') {
      setFilterValues({ ...filterValues, discipline: {} });
    } else if (typeof selectedValue === 'object') {
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
    if (selectedValue._id === undefined || selectedValue._id === '') {
      setFilterValues({ ...filterValues, topic: {} });
    } else if (typeof selectedValue === 'object') {
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
    if (selectedValue._id === undefined || selectedValue._id === '') {
      setFilterValues({ ...filterValues, subTopic: {} });
    } else if (typeof selectedValue === 'object') {
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

  const handleClearAll = () => {
    setClearFilters(true);
    setFilterValues(initialFilterValues);
  };

  // const buildFilterParams = (filters: IFilterValues) => {
  //   const params = [];

  //   for (const key in filters) {
  //     if (filters[key]._id) {
  //       params.push(`${key}Id=${filters[key]._id}`);
  //     }
  //   }

  //   return params.length > 0 ? `?${params.join('&')}` : '';
  // };

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
      setQuestions(filteredMcqs.body.mcqQuestions);
    }
  }, [filteredMcqs, isFilteredMcqsLoading, isFilteredMcqsError]);

  const handleFilterSubmit = () => {
    refetch();
  };
  console.log('Params: ', params);
  const [selectedQuestions, setSelectedQuestions] = useState<
    IMcqQuestionPopulated[]
  >([]);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Search and Filter"
        size="xl"
        backScreen={true}
        prevScreenName="mainScreen"
        setScreen={setScreen}
      >
        <MyToast />
        <MyToast />{' '}
        <div className="grid gap-5 md:grid-cols-2 md:grid-rows-2 md:gap-10">
          <UniversityDropDown
            onSelect={getSelectedUniversityValue}
            reset={clearFilters}
          />
          <DisciplineDropDown
            onSelect={getSelectedDisciplineValue}
            reset={clearFilters}
          />
          <ModuleDropDown
            onSelect={getSelectedModuleValue}
            reset={clearFilters}
          />
          <TopicsDropDown
            onSelect={getSelectedTopicValue}
            reset={clearFilters}
          />
          <SubTopicsDropDown
            onSelect={getSelectedSubTopicValue}
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
              console.log('value:', value);
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
            {' '}
            <ButtonFill handleClick={() => handleFilterSubmit()} width="w-full">
              Search
            </ButtonFill>
          </div>
        </div>

        {/* Called from Deck Components */}
        <TableSnapShot
          questions={questions}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          setIsOpen={setIsOpen}
          setScreen={setScreen}
          isFilteredMcqsLoading={isFilteredMcqsLoading}
          primaryButtonText="Edit"
          selectMultiple={true}
          primaryCallback={primaryCallback}
        />
      </Drawer>
    </>
  );
};

export default SearchQuestionsByFiltersDrawer;
