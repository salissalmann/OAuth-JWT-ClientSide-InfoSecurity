import { useState } from 'react';

import {
  ButtonFill,
  ButtonOutlined,
  Checkbox,
  ConfirmationModal,
  DropDown,
  EditIcon,
  EyeIcon,
  SettingDotsIcon,
  SnapShotModal,
} from '../../../../components/UiComponents';
import Badge from '../../../../components/UiComponents/Badges';
import QuestionViewSnapShot from '../../../DeckGroups/Components/QuestionViewSnapShot';
import { IMcqQuestionPopulated, initialQuestionState } from '../../Interfaces';
import MyToast, {
  showToast,
} from '../../../../components/UiComponents/MyToast';

interface TableSnapShotProps {
  questions: IMcqQuestionPopulated[];
  selectedQuestions: IMcqQuestionPopulated[];
  setSelectedQuestions: React.Dispatch<
    React.SetStateAction<IMcqQuestionPopulated[]>
  >;
  setDeckQuestions?: React.Dispatch<
    React.SetStateAction<IMcqQuestionPopulated[]>
  >;
  setIsOpen: (isOpen: boolean) => void;
  setScreen: (screen: string) => void;
  addQuestionToDeck?: (
    questionsTobeSave: IMcqQuestionPopulated[],
    type?: string
  ) => void;
  prevMcqsId?: string[];
  isFilteredMcqsLoading: boolean;
  primaryButtonText?: string;
  selectMultiple?: boolean;
  primaryCallback?: (questions: IMcqQuestionPopulated[]) => void;
}

const TableSnapShot: React.FC<TableSnapShotProps> = (props) => {
  // console.log('Fetch Questions: ', questions);

  const selectMulitple =
    typeof props.selectMultiple !== 'undefined' ? props.selectMultiple : true;
  const handleCheckboxChange = (
    item: IMcqQuestionPopulated,
    isChecked: boolean
  ) => {
    if (isChecked) {
      if (selectMulitple) {
        if (
          !props.selectedQuestions.some(
            (selectedItem: IMcqQuestionPopulated) =>
              selectedItem._id === item._id
          )
        ) {
          props.setSelectedQuestions([...props.selectedQuestions, item]);
        }
      } else {
        props.setSelectedQuestions([item]);
      }
    } else {
      if (selectMulitple) {
        props.setSelectedQuestions(
          props.selectedQuestions.filter(
            (selectedItem: IMcqQuestionPopulated) =>
              selectedItem._id !== item._id
          )
        );
      } else {
        props.setSelectedQuestions([]);
      }
    }
  };

  const handleQuestionSubmit = () => {
    if (props.selectedQuestions.length <= 0) {
      showToast("You havn't select any question yet.", 'info');
    } else {
      // 🔰 Add Selected Question to Deck
      props.addQuestionToDeck &&
        props.addQuestionToDeck(props.selectedQuestions);
      props.setDeckQuestions && props.setDeckQuestions(props.selectedQuestions);
    }
  };

  const [confirmationModal, setConfirmationModal] = useState(false);
  const handleCancelConfirmation = () => {
    props.setSelectedQuestions([]);
    setConfirmationModal(false);
  };

  const handleConfirmationView = () => {
    console.log(
      'props.selectedQuestions.length : ',
      props.selectedQuestions.length
    );
    if (props.selectedQuestions && props.selectedQuestions.length > 0) {
      setConfirmationModal(true);
    } else {
      props.setScreen('OptionScreen');
      props.setIsOpen(false);
    }
  };
  const [viewCrudOptions, setViewCrudOptions] = useState(false);
  const [QuestionSnapShotModal, setQuestionSnapShotModal] = useState(false);
  const [selectedQuestionForView, setSelectedQuestionForView] =
    useState<IMcqQuestionPopulated>(initialQuestionState);

  const distinctStatus = ['Active', 'InActive'];

  const [selectedStatus, setSelectedStatus] = useState('Active');

  const filteredProducts = props?.questions.filter(
    (question: IMcqQuestionPopulated) => {
      const status = selectedStatus === 'Active' ? true : false;

      // Check if the question's _id is not in the prevMcqsId array
      const isNotInPrevMcqs =
        typeof props.prevMcqsId !== 'undefined'
          ? !props.prevMcqsId.includes(question._id)
          : true;

      if (selectedStatus === 'All') {
        return isNotInPrevMcqs && question;
      }

      const matchesStatus = question.isActive === status;

      return isNotInPrevMcqs && matchesStatus;
    }
  );

  const areThereNewQuestions = (
    questions: IMcqQuestionPopulated[],
    prevQuestion: string[]
  ) => {
    const newQuestionsExist = questions?.some(
      (question: IMcqQuestionPopulated) => {
        return !prevQuestion.includes(question._id);
      }
    );

    return newQuestionsExist;
  };

  return (
    <>
      <ConfirmationModal
        active={confirmationModal}
        message="You have some unsaved changes"
        onConfirm={handleCancelConfirmation}
        onCancel={() => setConfirmationModal(false)}
      />

      <SnapShotModal
        active={QuestionSnapShotModal}
        onCancel={() => setQuestionSnapShotModal(false)}
        onConfirm={() => {}}
      >
        <QuestionViewSnapShot
          selectedQuestionForView={selectedQuestionForView}
        />
      </SnapShotModal>
      <MyToast />

      <section className="antialiased my-10">
        <div className="mx-auto ">
          <div className="bg-white  relative shadow-sm space-y-3 sm:rounded-lg overflow-hidden">
            <DropDown
              label="Status"
              value={selectedStatus}
              options={distinctStatus}
              all={true}
              onSelect={(selectedValue) =>
                setSelectedStatus(String(selectedValue))
              }
            />
            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 mb-20">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        Id
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Question
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts &&
                      filteredProducts.length > 0 &&
                      filteredProducts.map((item: IMcqQuestionPopulated) => (
                        <tr className="border-b" key={item._id}>
                          <th
                            scope="row"
                            className="px-4 py-3 flex items-center justify-start font-medium text-gray-900 whitespace-nowrap"
                          >
                            <Checkbox
                              for={item._id}
                              showLabel={false}
                              checked={props.selectedQuestions.some(
                                (selectedItem: IMcqQuestionPopulated) =>
                                  selectedItem._id === item._id
                              )}
                              onChange={(checked) =>
                                handleCheckboxChange(item, checked)
                              }
                            />

                            {item._id}
                          </th>
                          <td className="px-4 py-3 text-xs">
                            {item.questionText.length > 80
                              ? `${item.questionText.slice(0, 80)}...`
                              : item.questionText}
                          </td>

                          <td className="px-4 py-3">
                            <div className="mx-auto w-fit">
                              {item.isActive ? (
                                <Badge type="success" label="Active" />
                              ) : (
                                <Badge type="error" label="inActive" />
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
                              id={`${item._id}-dropdown`}
                              className={`${
                                viewCrudOptions &&
                                selectedQuestionForView._id === item._id
                                  ? ''
                                  : 'hidden'
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
                                        : 'mcq'
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
                                      setQuestionSnapShotModal(true);
                                    }}
                                  >
                                    <EyeIcon />
                                    <span> Preview</span>
                                  </button>
                                </li>

                                <li>
                                  <button
                                    type="button"
                                    className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-red-500 "
                                    onClick={() => setViewCrudOptions(false)}
                                  >
                                    <span>Close</span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-10 bg-gray-50">
                {props?.isFilteredMcqsLoading ? (
                  <h1>loading..</h1>
                ) : (
                  <h1>No Questions Found</h1>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end my-5 space-x-4">
            <div className="w-52">
              <ButtonOutlined
                handleClick={() => handleConfirmationView()}
                width="w-full"
              >
                Cancel
              </ButtonOutlined>
            </div>
            <div className="w-52">
              <ButtonFill
                handleClick={() =>
                  props.primaryCallback
                    ? props.primaryCallback(props.selectedQuestions)
                    : handleQuestionSubmit()
                }
                width="w-full"
                disabled={
                  props.selectedQuestions.length <= 0 ||
                  !areThereNewQuestions(
                    props?.selectedQuestions,
                    typeof props?.prevMcqsId !== 'undefined'
                      ? props?.prevMcqsId
                      : []
                  )
                }
              >
                {props?.primaryButtonText ? props.primaryButtonText : 'Add'}
              </ButtonFill>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TableSnapShot;
