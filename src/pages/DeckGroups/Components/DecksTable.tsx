import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DropResult,
  Droppable,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import {
  ButtonFill,
  ButtonOutlined,
  Checkbox,
  ConfirmationModal,
} from '../../../components/UiComponents';
import Drawer from '../../../components/UiComponents/Drawer';
import DropDown from '../../../components/UiComponents/DropDown';
import {
  AddIcon,
  BarsIcon,
  DeleteIcon,
  EditIcon,
  EyeIcon,
  LoadingIconFilled,
  SaveIcon,
  SearchIcon,
  SettingDotsIcon,
} from '../../../components/UiComponents/Icons';
import { useReplaceDeckIds } from '../../../hooks';
import { DrawerContent } from './DrawerContent';

interface TableProps {
  data: {
    deckId: string;
    deckName: string;
    deckDescription: string;
    deckTime: number;
    isPremium: boolean;
    isPublished: boolean;
  }[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  deckGroupId: string;
}
interface IDeck {
  deckId: string;
  deckName: string;
  deckDescription: string;
  deckTime: number;
  isPremium: boolean;
  isPublished: boolean;
}

export const Table: React.FC<TableProps> = ({
  data,
  isLoading,
  // isError,
  deckGroupId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedQuestionsForDelete, setSelectedQuestionsForDelete] = useState<
    string[]
  >([]);

  const handleCheckboxChangeForDelete = (item: string, isChecked: boolean) => {
    if (isChecked) {
      if (
        !selectedQuestionsForDelete.some(
          (selectedItem) => selectedItem === item
        )
      ) {
        setSelectedQuestionsForDelete([...selectedQuestionsForDelete, item]);
      }
    } else {
      setSelectedQuestionsForDelete(
        selectedQuestionsForDelete.filter(
          (selectedItem) => selectedItem !== item
        )
      );
    }
  };

  const [filterQuestions, setfilterQuestions] = useState<IDeck[]>([]);

  useEffect(() => {
    setfilterQuestions(data);
  }, [data]);

  const [disabledTableEdit, setDisabledTableEdit] = useState(true);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(filterQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setfilterQuestions(items);
  };

  const convertTime = (time: number) => {
    const hours = Math.floor((time % 3600) / 60);
    const minutes = time % 60;
    return `${hours}:${minutes}`;
  };

  const [viewCrudOptions, setViewCrudOptions] = useState(false);
  const [activeRow, setActiveRow] = useState('');

  const handleSettingClick = (id: string) => {
    setViewCrudOptions((prev) => !prev);
    setActiveRow(id);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (e.target.value === '') {
      setfilterQuestions(data);
      return;
    }
    const NewData = data.filter((deck) => {
      const matchesSearch =
        deck.deckName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.deckDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setfilterQuestions(NewData);
  };

  const handleSelectStatusChange = (selectedStatus: string) => {
    setSelectedStatus(selectedStatus);

    if (selectedStatus === '') {
      setfilterQuestions(data);
      return;
    }
    const NewData = data.filter((deck) => {
      const status = selectedStatus === 'Published' ? true : false;
      const matchesStatus =
        selectedStatus === '' || selectedStatus == 'All'
          ? deck
          : deck.isPublished === status;
      return matchesStatus;
    });
    setfilterQuestions(NewData);
  };

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalType, setConfirmationModalType] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleBulkDelete = () => {
    const NewData = data.filter((deck) => {
      return !selectedQuestionsForDelete.includes(deck.deckId);
    });
    setConfirmationModal(false);
    setfilterQuestions(NewData);
  };

  const ReplaceDeckIdsMutation = useReplaceDeckIds();
  const handleSaveChanges = async () => {
    const UpdatedDeckIdsInOrder = filterQuestions.map((deck) => {
      return deck.deckId;
    });
    const result = await ReplaceDeckIdsMutation.mutateAsync({
      id: deckGroupId,
      deckIds: UpdatedDeckIdsInOrder,
    });
    if (result.success) {
      toast.success(result.message);
      setConfirmationModal(false);
      setDisabledTableEdit(true);
      setSelectedQuestionsForDelete([]);
    } else {
      toast.error(result.message);
      location.reload();
    }
  };

  const handleDelete = (deckId: string) => {
    //ADD DECK ID TO STATE of selections
    setSelectedQuestionsForDelete([...selectedQuestionsForDelete, deckId]);
  };

  useEffect(() => {
    if (!disabledTableEdit) {
      setSelectedStatus('');
    }
  }, [disabledTableEdit]);

  return (
    <>
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
                      disabled={!disabledTableEdit}
                      value={searchQuery}
                      onChange={(e) => {
                        handleSearchQueryChange(e);
                      }}
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
                      setDisabled={setDisabledTableEdit}
                      disabled={disabledTableEdit}
                      callBack={() => {
                        setDisabledTableEdit(true);
                        setfilterQuestions(data);
                        setSelectedQuestionsForDelete([]);
                      }}
                    />
                    <SaveButton
                      setDisabled={setDisabledTableEdit}
                      disabled={disabledTableEdit}
                      callBack={() => {
                        setConfirmationModal(true);
                        setConfirmationModalType('Save Changes');
                      }}
                    />
                  </div>
                )}
                <ButtonFill
                  icon={<AddIcon />}
                  handleClick={() => setIsDrawerOpen(true)}
                  disabled={!disabledTableEdit}
                >
                  Add Deck
                </ButtonFill>
              </div>
            </div>

            {isLoading ? (
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
                <div className="flex items-end space-x-3 p-4">
                  <DropDown
                    label="Status"
                    value={selectedStatus}
                    options={['Published', 'Unpublished']}
                    all={true}
                    disabled={!disabledTableEdit}
                    onSelect={(selectedValue) =>
                      handleSelectStatusChange(selectedValue as string)
                    }
                  />

                  <ConfirmationModal
                    active={confirmationModal}
                    message={
                      confirmationModalType === 'Save Changes'
                        ? 'Are you sure you want to save the changes?'
                        : confirmationModalType === 'bulkDelete'
                          ? 'Are you sure you want to remove the selected decks?'
                          : ''
                    }
                    onConfirm={() =>
                      confirmationModalType === 'Save Changes'
                        ? handleSaveChanges()
                        : confirmationModalType === 'bulkDelete'
                          ? handleBulkDelete()
                          : ''
                    }
                    onCancel={() => {
                      if (confirmationModalType === 'Save Changes') {
                        setConfirmationModal(false);
                        setConfirmationModalType('');
                        setfilterQuestions(data);
                        setDisabledTableEdit(true);
                        setSelectedQuestionsForDelete([]);
                        return;
                      }
                      setConfirmationModal(false);
                      setConfirmationModalType('');
                    }}
                  />

                  {!disabledTableEdit && (
                    <ButtonOutlined
                      margin={false}
                      icon={<DeleteIcon />}
                      disabled={selectedQuestionsForDelete?.length < 1}
                      handleClick={() => {
                        setConfirmationModal(true);
                        setConfirmationModalType('bulkDelete');
                      }}
                    >
                      Bulk Remove
                    </ButtonOutlined>
                  )}
                </div>
                <table className="w-full text-sm text-left text-gray-500 mb-20">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-4 py-4"></th>

                      <th scope="col" className="px-4 py-4">
                        S.No
                      </th>
                      {!disabledTableEdit && (
                        <th scope="col" className="px-4 py-4">
                          Select
                        </th>
                      )}
                      <th scope="col" className="px-4 py-4">
                        Deck ID
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Deck Name
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Deck Time
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Published Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
                        Premium Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-center">
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
                          {filterQuestions &&
                            filterQuestions.length > 0 &&
                            filterQuestions.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.deckId}
                                  draggableId={item.deckId}
                                  index={index}
                                  isDragDisabled={disabledTableEdit}
                                >
                                  {(provided: DraggableProvided) => (
                                    <tr
                                      className="borde\r-b text-xs bg-white"
                                      key={item.deckId}
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
                                      {!disabledTableEdit && (
                                        <th
                                          scope="col"
                                          className="px-4 py-3 h-full text-xs  font-medium text-gray-900 whitespace-nowrap"
                                        >
                                          <div className="flex items-center">
                                            {' '}
                                            <Checkbox
                                              for={item.deckId}
                                              showLabel={false}
                                              checked={selectedQuestionsForDelete.some(
                                                (selectedItem) =>
                                                  selectedItem === item.deckId
                                              )}
                                              onChange={(checked) =>
                                                handleCheckboxChangeForDelete(
                                                  item.deckId,
                                                  checked
                                                )
                                              }
                                            />
                                          </div>
                                        </th>
                                      )}
                                      <td className="px-4 py-3">
                                        {item.deckId}
                                      </td>
                                      <td className="px-4 py-3">
                                        {item.deckName}
                                      </td>

                                      <td className="px-4 py-3">
                                        {item.deckDescription}
                                      </td>
                                      <td className="px-4 py-3 max-w-[12rem] truncate">
                                        {convertTime(item.deckTime)} mins
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="mx-auto w-fit">
                                          <div
                                            className={`inline-flex items-center justify-center cursor-pointer space-x-1
                                                                                        px-2.5 py-1.5 text-xs font-medium rounded-full
                                                                                        ${item.isPublished
                                                ? 'bg-gradient-to-tr to-emerald-400 from-emerald-500 text-white'
                                                : 'bg-gradient-to-tr to-slate-400 from-slate-500 text-white'
                                              }
                                                                                        `}
                                          >
                                            {item.isPublished
                                              ? 'Published'
                                              : 'Unpublished'}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="mx-auto w-fit">
                                          <div
                                            className={`inline-flex items-center justify-center cursor-pointer space-x-1 
                                                                                        px-2.5 py-1.5 text-xs font-medium rounded-full
                                                                                        ${item.isPremium
                                                ? 'bg-gradient-to-tr to-amber-400 from-amber-500 text-white'
                                                : 'bg-gradient-to-tr to-sky-400 from-sky-500 px-4 text-white'
                                              }
                                                                                        `}
                                          >
                                            {item.isPremium
                                              ? 'Premium'
                                              : 'Free'}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 flex items-center justify-center relative">
                                        <button
                                          id={`${item.deckName}-dropdown-button`}
                                          data-dropdown-toggle={`${item.deckName}-dropdown`}
                                          className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                                          type="button"
                                          onClick={() => {
                                            handleSettingClick(item.deckId);
                                          }}
                                        >
                                          <SettingDotsIcon />
                                        </button>
                                        <div
                                          id={`${item.deckName}-dropdown`}
                                          className={`${viewCrudOptions &&
                                            activeRow === item.deckId
                                            ? ''
                                            : 'hidden'
                                            }  w-44 bg-white rounded divide-y divide-gray-100 shadow absolute top-0 right-0 z-[100]`}
                                        >
                                          <ul
                                            className="py-1 text-sm"
                                            aria-labelledby={`${item.deckName}-dropdown-button`}
                                          >
                                            <li>
                                              <button
                                                type="button"
                                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                                onClick={() => {
                                                  if (!disabledTableEdit) {
                                                    toast.error(
                                                      'You need to save the changes to view a deck'
                                                    );
                                                    return;
                                                  }
                                                  //Open Deck in new tab
                                                  window.open(
                                                    `/decks/${item.deckId}`,
                                                    '_blank'
                                                  );
                                                  handleSettingClick("");
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
                                                    toast.error(
                                                      'You need to edit the deck group to remove a deck'
                                                    );
                                                    return;
                                                  }
                                                  handleDelete(item.deckId);
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
                                                onClick={() => {
                                                  handleSettingClick("");
                                                }}
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
          {isDrawerOpen && (
            <Drawer
              isOpen={isDrawerOpen}
              setIsOpen={setIsDrawerOpen}
              title="Add New Deck"
              size="md"
            >
              <DrawerContent deckGroupId={deckGroupId} />
            </Drawer>
          )}
        </div>
      </section>
    </>
  );
};

interface IActionButton {
  setDisabled: (value: boolean) => void;
  disabled: boolean;
  callBack?: () => void;
}

export const SaveButton: React.FC<IActionButton> = (props) => {
  return (
    <button
      className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-800 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
      onClick={() => {
        props.callBack && props.callBack();
      }}
    >
      <div className="relative flex items-center space-x-3 text-white">
        <SaveIcon />
        <span className=" text-base font-semibold">Save</span>
      </div>
    </button>
  );
};
export const EditButton: React.FC<IActionButton> = (props) => {
  return (
    <button
      className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
      onClick={() => {
        props.setDisabled(!props.disabled);
      }}
    >
      <div
        className={`relative flex items-center space-x-3
   text-gray-600`}
      >
        <EditIcon />
        <span className=" text-base font-semibold">Edit</span>
      </div>
    </button>
  );
};
export const CancelButton: React.FC<IActionButton> = (props) => {
  return (
    <button
      className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
      onClick={() => {
        // props.setDisabled(!props.disabled);
        props.callBack && props.callBack();
      }}
    >
      <div
        className={`relative flex items-center space-x-3
   text-gray-600`}
      >
        <EditIcon />
        <span className=" text-base font-semibold">Cancel</span>
      </div>
    </button>
  );
};

export default Table;
