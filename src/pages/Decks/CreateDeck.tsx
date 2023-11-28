import { useParams } from 'react-router-dom';
import Banner from '../../components/UiComponents/Banner';
import Form from './CreateDeck/components/Form';
import Table from './CreateDeck/components/Table';
import { useState } from 'react';
import {
  useFetchDeckById,
  useFindMcqQuestionsWithDetailForIds,
  useUpdateDeckInfo,
} from '../../hooks';
import { useEffect } from 'react';
import {
  ConfirmationModal,
  EditIcon,
  LoadingIconFilled,
  SaveIcon,
} from '../../components/UiComponents';
import MyToast, { showToast } from '../../components/UiComponents/MyToast';
import {
  IDeckFormData,
  IMcqQuestionPopulated,
  IRelation,
  initialErrorState,
} from './Interfaces';
import { isAxiosError } from 'axios';

const CreateDeck = () => {
  const [disabledDeckForm, setDisabledDeckForm] = useState(true);
  // Fetched Data to check is User Edited the deck info or not before api
  const [invalidDeck, setInvalidDeck] = useState(false);
  const [fetchedDeckData, setFetchedDeckData] = useState<IDeckFormData>({
    deckName: '',
    deckDescription: '',
    deckTags: '',
    deckCriteria: {
      universityId: '',
      year: '2023',
      deckType: '',
    },
    totalMcqs: 0,
    deckTime: 0,
    isPremium: false,
    isPublished: false,
    availableForAllUniversities: false,
    mcqsIds: [],
    relations: [] as IRelation[],
  });
  const [formData, setFormData] = useState<IDeckFormData>({
    deckName: '',
    deckDescription: '',
    deckTags: '',
    deckCriteria: {
      universityId: '',
      year: '2023',
      deckType: '',
    },
    totalMcqs: 0,
    deckTime: 0,
    isPremium: false,
    isPublished: false,
    availableForAllUniversities: false,
    mcqsIds: [],
    relations: [] as IRelation[],
  });

  const [errors, setErrors] = useState(initialErrorState);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const validateForm = () => {
    const newErrors = { ...errors };
    let isError = false;

    if (!formData.deckName) {
      newErrors.deckNameError = {
        error: true,
        message: 'Deck Name is required',
      };
      isError = true;
    } else {
      newErrors.deckNameError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckDescription) {
      newErrors.deckDescriptionError = {
        error: true,
        message: 'Deck Name is required',
      };
      isError = true;
    } else {
      newErrors.deckDescriptionError = {
        error: false,
        message: '',
      };
    }
    if (
      !formData.deckCriteria.year ||
      formData.deckCriteria.year.toString().length !== 4
    ) {
      newErrors.deckYearError = {
        error: true,
        message: 'Year must be a 4-digit number',
      };
      isError = true;
    } else {
      newErrors.deckYearError = {
        error: false,
        message: '',
      };
    }
    if (!formData.deckCriteria.deckType) {
      newErrors.deckTypeError = {
        error: true,
        message: 'Exam Type is not selected',
      };
      isError = true;
    } else {
      newErrors.deckTypeError = {
        error: false,
        message: '',
      };
    }

    setErrors(newErrors);
    return isError;
  };

  const { deckId } = useParams<{ deckId: string }>();

  const {
    data: deckData,
    isLoading: isDeckLoading,
    isError: isDeckError,
    error: deckError,
  } = useFetchDeckById(deckId ? deckId : '');

  useEffect(() => {
    if (!isDeckLoading && !isDeckError) {
      const deck = deckData.data;
      console.log(deck);

      if (deck === undefined || deck === null) {
        setInvalidDeck(true);
        showToast('Invalid Deck id or no data found..', 'error');
        return;
      }
      // For Form Data
      setFormData({
        deckName: deck.deckName,
        deckDescription: deck.deckDescription,
        deckTags: deck?.deckTags ? deck.deckTags : '',
        deckCriteria: {
          universityId: deck?.deckCriteria?.universityId
            ? deck.deckCriteria.universityId
            : '',
          year: deck?.deckCriteria?.year
            ? (deck.deckCriteria.year as string)
            : '2023',
          deckType: deck?.deckCriteria?.deckType
            ? deck.deckCriteria.deckType
            : '',
        },
        totalMcqs: deck?.totalMcqs ? deck.totalMcqs : 0,
        deckTime: deck?.deckTime ? deck.deckTime : 0,
        isPremium: deck?.isPremium !== undefined ? deck.isPremium : false,
        isPublished: deck?.isPublished ? deck.isPublished : true,
        availableForAllUniversities: deck?.availableForAllUniversities
          ? deck.availableForAllUniversities
          : false,
        mcqsIds: deck?.mcqsIds ? deck.mcqsIds : [],
        relations: deck?.relations ? (deck.relations as IRelation[]) : [],
      });

      // Saved Deck Info from Backend
      setFetchedDeckData({
        deckName: deck.deckName,
        deckDescription: deck.deckDescription,
        deckTags: deck?.deckTags ? deck.deckTags : '',
        deckCriteria: {
          universityId: deck?.deckCriteria?.universityId
            ? deck.deckCriteria.universityId
            : '',
          year: deck?.deckCriteria?.year
            ? (deck.deckCriteria.year as string)
            : '2023',
          deckType: deck?.deckCriteria?.deckType
            ? deck.deckCriteria.deckType
            : '',
        },
        totalMcqs: deck?.totalMcqs ? deck.totalMcqs : 0,
        deckTime: deck?.deckTime ? deck.deckTime : 0,
        isPremium: deck?.isPremium !== undefined ? deck.isPremium : false,
        isPublished: deck?.isPublished ? deck.isPublished : true,
        availableForAllUniversities: deck?.availableForAllUniversities
          ? deck.availableForAllUniversities
          : false,
        mcqsIds: deck?.mcqsIds ? deck.mcqsIds : [],
        relations: deck?.relations ? (deck.relations as IRelation[]) : [],
      });

      fetchQuestionsData(deck?.mcqsIds ? deck.mcqsIds : []);
    } else if (!isDeckLoading && deckError) {
      if (isAxiosError(deckError)) {
        const message =
          deckError.response?.data?.header?.errorMessage ||
          'Internal Server Error';
        showToast(message, 'error');
      } else {
        showToast('Internal Server Error', 'error');
      }
    }
  }, [deckData, isDeckLoading, isDeckError, deckError]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const findMcqQuestionsWithDetailForIds =
    useFindMcqQuestionsWithDetailForIds();

  const [fetchedDeckQuestion, setFetchedDeckQuestions] = useState<
    IMcqQuestionPopulated[]
  >([]);
  const fetchQuestionsData = async (ids: string[] | []) => {
    const populatedQuestionData =
      await findMcqQuestionsWithDetailForIds.mutateAsync(ids);

    if (populatedQuestionData.status === 'success') {
      const sortQuestionsByQids = (
        questions: IMcqQuestionPopulated[],
        qids: string[]
      ) => {
        return questions.sort((a, b) => {
          const indexOfA = qids.indexOf(a._id);
          const indexOfB = qids.indexOf(b._id);
          return indexOfA - indexOfB;
        });
      };

      const sortedQuestions = sortQuestionsByQids(
        populatedQuestionData.body.mcqs,
        ids
      );

      setFetchedDeckQuestions(sortedQuestions);
    }
  };

  useEffect(() => {
    if (
      !findMcqQuestionsWithDetailForIds.isLoading &&
      findMcqQuestionsWithDetailForIds.isError
    ) {
      if (isAxiosError(findMcqQuestionsWithDetailForIds.error)) {
        const message =
          findMcqQuestionsWithDetailForIds.error.response?.data?.header
            ?.errorMessage || 'Internal Server Error';
        showToast(message, 'error');
      } else {
        showToast('Internal Server Error', 'error');
      }
    }
  }, [
    findMcqQuestionsWithDetailForIds.isLoading,
    findMcqQuestionsWithDetailForIds.isError,
    findMcqQuestionsWithDetailForIds.error,
  ]);

  const updateDeckInfoMutation = useUpdateDeckInfo();
  const updateDeckInfo = async () => {
    const hasChanged = haveObjectsChanged(formData, fetchedDeckData);

    const isError = validateForm();
    !isError && setDisabledDeckForm(true);
    if (!hasChanged) {
      showToast('No Changes Found!', 'info', <LoadingIconFilled />);
      return;
    }

    if (isError) {
      showToast('There are some errors in the form.', 'error');
      return;
    }
    if (deckId && !isError) {
      const updatedDeckData = await updateDeckInfoMutation.mutateAsync({
        deckId,
        body: formData,
      });

      if (updatedDeckData.success) {
        showToast('Deck info updated Successfully 🚀', 'success');
        setFetchedDeckData(formData);
      }
    }
  };

  useEffect(() => {
    if (!updateDeckInfoMutation.isLoading && updateDeckInfoMutation.isError) {
      if (isAxiosError(updateDeckInfoMutation.error)) {
        const message =
          updateDeckInfoMutation.error.response?.data?.header?.errorMessage ||
          'Internal Server Error';
        showToast(message, 'error');
      } else {
        showToast('Internal Server Error', 'error');
      }
    }
  }, [
    updateDeckInfoMutation.isLoading,
    updateDeckInfoMutation.isError,
    updateDeckInfoMutation.error,
  ]);

  // Custom comparison function to check if two objects are equal

  function haveObjectsChanged(
    objA: IDeckFormData,
    objB: IDeckFormData
  ): boolean {
    return (
      objA.deckName !== objB.deckName ||
      objA.deckDescription !== objB.deckDescription ||
      objA.deckTags !== objB.deckTags ||
      objA.deckCriteria.universityId !== objB.deckCriteria.universityId ||
      objA.deckCriteria.year !== objB.deckCriteria.year ||
      objA.deckCriteria.deckType !== objB.deckCriteria.deckType ||
      objA.totalMcqs !== objB.totalMcqs ||
      objA.deckTime !== objB.deckTime ||
      objA.isPremium !== objB.isPremium ||
      objA.isPublished !== objB.isPublished ||
      objA.availableForAllUniversities !== objB.availableForAllUniversities
    );
  }

  const handleUndoChanges = () => {
    const hasChanged = haveObjectsChanged(formData, fetchedDeckData);

    if (hasChanged) {
      setConfirmationModal(true);
    } else {
      setConfirmationModal(false);
      setDisabledDeckForm(true);
      setFormData(fetchedDeckData);
    }
  };

  const undoDeckInformationChanges = () => {
    setConfirmationModal(false);
    setDisabledDeckForm(true);
    setFormData(fetchedDeckData);
  };

  if (invalidDeck) {
    return (
      <div className="w-screen mt-52 flex items-center justify-center">
        <h1 className="text-gray-800 text-3xl">
          Deck Not Found or Invalid Deck Id 😓
        </h1>
      </div>
    );
  }
  if (!isDeckLoading && isDeckError) {
    return (
      <div className="w-screen mt-52 flex items-center justify-center rela">
        <MyToast />
        <h1 className="text-gray-800 text-3xl">Error 😓</h1>
      </div>
    );
  }
  if (isDeckLoading) {
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
    <div className="w-full pb-20">
      <ConfirmationModal
        active={confirmationModal}
        message="You have some unsaved changes"
        onConfirm={() => undoDeckInformationChanges()}
        onCancel={() => setConfirmationModal(false)}
      />

      <Banner
        category="Deck"
        heading={`${formData.deckName ? formData.deckName : 'Loading..'} ${
          deckId ? ' - ' + deckId : ''
        }`}
        description={formData.deckDescription}
        link="#"
        isPicture={false}
        isLink={false}
      />

      <div className="ml-auto">
        {disabledDeckForm ? (
          <EditButton
            setDisabled={setDisabledDeckForm}
            disabled={disabledDeckForm}
          />
        ) : (
          <div className="flex items-center space-x-4">
            <CancelButton
              disabled={disabledDeckForm}
              callBack={handleUndoChanges}
            />
            <SaveButton disabled={disabledDeckForm} callBack={updateDeckInfo} />
          </div>
        )}
      </div>

      <Form
        formData={formData}
        setFormData={setFormData}
        onSubmit={updateDeckInfo}
        disabledDeckForm={disabledDeckForm}
        errors={errors}
      />
      <Table
        deckFetchedMcqsId={formData.mcqsIds ?? []}
        deckFetchedRelations={
          formData.relations ? (formData.relations as IRelation[]) : []
        }
        fetchedDeckQuestion={fetchedDeckQuestion}
        contentLoading={findMcqQuestionsWithDetailForIds.isLoading}
      />

      <MyToast />
    </div>
  );
};

interface IActionButton {
  setDisabled?: (value: boolean) => void;
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
        props.setDisabled && props.setDisabled(!props.disabled);
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

export default CreateDeck;
