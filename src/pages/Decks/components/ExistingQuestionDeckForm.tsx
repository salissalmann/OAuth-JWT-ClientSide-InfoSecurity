import React, { useState } from 'react';
import { Input, Label } from '../../../components/UiComponents/Forms';
import { LoadingIconFilled } from '../../../components/UiComponents/Icons';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import { useFetchMcqQuestionDetailById } from '../../../hooks';
import { useEffect } from 'react';
import { ButtonFill, ButtonOutlined } from '../../../components/UiComponents';
import QuestionViewSnapShot from '../../DeckGroups/Components/QuestionViewSnapShot';
import { IMcqQuestionPopulated, initialQuestionState } from '../Interfaces';

interface ExistingFormInterface {
  setScreen: (type: string) => void;
  selectedQuestions: IMcqQuestionPopulated[];
  setSelectedQuestions: React.Dispatch<
    React.SetStateAction<IMcqQuestionPopulated[]>
  >;
  prevMcqsId: string[];
  addQuestionToDeck: (
    questionsTobeSave: IMcqQuestionPopulated[],
    type: string
  ) => void;
}
export const ExistingQuestionDeckForm: React.FC<ExistingFormInterface> = ({
  setScreen,
  selectedQuestions,
  setSelectedQuestions,
  prevMcqsId,
  addQuestionToDeck,
}) => {
  // 6523e74ed3dfb7eb9097f828
  const [questionId, setQuestionId] = useState('');
  const [questionData, setQuestionData] =
    useState<IMcqQuestionPopulated>(initialQuestionState);

  const [isQuestionAlreadyInDeck, setIsQuestionAlreadyInDeck] = useState(false);
  const {
    data: question,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    error: questionError,
    refetch: reFetchQuestion,
  } = useFetchMcqQuestionDetailById(questionId);

  useEffect(() => {
    if (!isQuestionLoading && isQuestionError) {
      // questionError?.response?.data?.message
      showToast(
        'Question Not Found or Invalid Id',
        'error',
        <LoadingIconFilled />
      );
    }

    if (!isQuestionLoading && !isQuestionError && question) {
      setQuestionData(question.body);
      // console.log('Question : ', question.body);
    }
  }, [question, isQuestionLoading, questionError, isQuestionError]);

  const handleInputChange = (_: string, value: string) => {
    setQuestionId(value);
  };

  const findQuestion = async () => {
    setQuestionData(initialQuestionState);
    setIsQuestionAlreadyInDeck(false);
    if (prevMcqsId.includes(questionId)) {
      setIsQuestionAlreadyInDeck(true);
    } else {
      reFetchQuestion();
    }
  };

  const addQuestionById = async () => {
    if (
      !selectedQuestions.some(
        (selectedItem: IMcqQuestionPopulated) =>
          selectedItem._id === questionData._id
      )
    ) {
      setSelectedQuestions([...selectedQuestions, questionData]);
      setQuestionData(initialQuestionState);
      addQuestionToDeck([...selectedQuestions, questionData], 'addById');
    }
  };

  return (
    <>
      <div className="flex flex-row gap-6 items-center justify-center ">
        <div className="w-full ">
          <Label>Question Id</Label>
          <div className="flex items-center  w-full">
            <div className="w-full ">
              <Input
                type="text"
                placeholder="Enter your first name"
                value={questionId}
                name="questionId"
                onChange={handleInputChange}
              />
            </div>

            <div className="w-52 ml-4 flex-shrink-0">
              <ButtonFill
                handleClick={() => {
                  findQuestion();
                }}
                width="w-full"
                disabled={
                  !questionId || questionId.trim() === '' ? true : false
                }
              >
                Find
              </ButtonFill>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-6 items-center justify-start mt-8 p-2">
        <div className="w-full xl:w-3/4">
          <Label>Result</Label>
          {isQuestionAlreadyInDeck && (
            <p className="text-red-600">This question is already in deck 😃</p>
          )}
        </div>
      </div>

      {questionData && questionData._id && (
        <div className="flex flex-row gap-6 items-center justify-start bg-gray-50 rounded p-5">
          <div
            className="w-full 
                      flex flex-col gap-2
                      "
          >
            <QuestionViewSnapShot selectedQuestionForView={questionData} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end ">
        <div className="w-52">
          <ButtonOutlined
            width="w-full"
            handleClick={() => {
              setQuestionId('');
              setQuestionData(initialQuestionState);
              setScreen('OptionScreen');
            }}
          >
            Cancel
          </ButtonOutlined>
        </div>
        {questionData && (
          <div className="w-52 ml-4">
            <ButtonFill
              width="w-full"
              handleClick={() => {
                addQuestionById();
              }}
              disabled={
                !questionId ||
                questionId.trim() === '' ||
                isQuestionAlreadyInDeck
                  ? true
                  : false
              }
            >
              Add
            </ButtonFill>
          </div>
        )}

        <MyToast />
      </div>
    </>
  );
};

export default ExistingQuestionDeckForm;
