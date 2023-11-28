export interface IDeckFormData {
  _id?: string;
  deckName: string;
  deckDescription: string;
  deckTags: string;
  deckCriteria: {
    universityId: string;
    year: string;
    deckType: string;
  };
  totalMcqs?: number;
  deckTime: number;
  isPremium: boolean;
  isPublished: boolean;
  availableForAllUniversities: boolean;
  mcqsIds?: string[];
  relations?: object[];
}

export interface IReferencePdfLink {
  referenceText: string;
  pdfUrl: string;
  specificPage: number;
  specificLocation: string;
}

export interface IOption {
  optionText: object;
  isCorrect: boolean;
  explanationText: object;
  explanationImage?: string;
  plainOptionText?: string;
  plainExplanationText?: string;
}

export interface IUniDetails {
  uniId:
    | {
        universityName: string;
        _id: string;
      }
    | string;
  year: string;
  examType: string;
}

export interface IBookSource {
  sourceText: string;
  sourcePdfLink: string;
}

export interface IPracticeQuestionDetails {
  practiceTags: string[];
}

export interface IQuestionSource {
  uniDetails?: IUniDetails[];
  bookSource?: IBookSource[];
  practiceQuestionDetails?: IPracticeQuestionDetails;
}

export interface IModules {
  moduleId: string;
  subtopicId: string | undefined;
  topicId: string;
  disciplineId: string;
}
export interface IModulesPopulated {
  moduleId: IModule;
  subtopicId: ISubTopic;
  topicId: ITopic;
  disciplineId: IDiscipline;
}

export interface IMcqQuestion {
  _id?: string;
  questionText: string;
  slug?: string;
  body: object;
  tip: object;
  plainTipText?: string;
  hintText?: string[];
  degrees?:string[];
  questionType: string;
  isPublished?: boolean;
  referencePdfLink?: IReferencePdfLink[];
  options: IOption[];
  isActive: boolean;
  questionSource?: IQuestionSource;
  modules: IModules;
  metaData?: {
    createdBy: string;
    createdAt?: Date;
    lastEditedBy?: string;
    lastUpdatedAt?: Date;
  };
}

export interface IMcqQuestionPopulated {
  _id: string;
  questionText: string;
  slug?: string;
  body?: object;
  tip?: object;
  degrees?:string[];
  plainTipText?: string;
  isPublished?: boolean;
  questionType?: string;
  referencePdfLink?: IReferencePdfLink[];
  options?: IOption[];
  isActive: boolean;
  questionSource?: IQuestionSource;
  modules: IModulesPopulated;
  metaData?: {
    createdBy: string;
    createdAt: Date;
    lastEditedBy: string;
    lastUpdatedAt: Date;
  };
}

// 🔰~~Interfaces For Gettig Drop Downs Values

export interface IUniversity {
  _id: string;
  universityName: string;
  universittDescription?: string;
}

export interface IModule {
  _id: string;
  moduleName: string;
  moduleDescription?: string;
}
export interface IDropDown {
  _id: string;
  [key: string]: string;
}
export interface IDiscipline {
  _id: string;
  disciplineName: string;
  disciplineDescription?: string;
}

export interface ITopic {
  _id: string;
  topicName: string;
  topicDescription?: string;
  subtopicIds?: string[];
}

export interface ISubTopic {
  _id: string;
  subtopicName: string;
  subtopicDescription?: string;
}

// 🔰~~Interfaces For Question Relations

export interface ITopicRelation {
  topicId: string;
  topicName: string;
  numMcqs: number;
  mcqsIds: string[];
}

export interface IDisciplineRelation {
  disciplineId: string;
  disciplineName: string;
  numMcqs: number;
  mcqsIds: string[];
  topics: ITopicRelation[];
}

export interface IModuleRelation {
  moduleId: string;
  moduleName: string;
  numMcqs: number;
  mcqsIds: string[];
  disciplines: IDiscipline[];
}

export interface IRelation {
  moduleId: string;
  moduleName: string;
  numMcqs: number;
  mcqsIds: string[];
  disciplines: IDisciplineRelation[];
}

// Error States
// Define a type for your error object
export interface IErrorObject {
  error: boolean;
  message: string;
}

// Define a type for the entire error state
export interface IDeckErrorState {
  deckNameError: IErrorObject;
  deckDescriptionError: IErrorObject;
  universityIdError: IErrorObject;
  deckTypeError: IErrorObject;
  deckYearError: IErrorObject;
  deckTagsError: IErrorObject;
}



export interface IDrawersFilters {
  university: { _id: string; value: string };
  discipline: { _id: string; value: string };
  module: { _id: string; value: string };
  topic: { _id: string; value: string };
  subTopic: { _id: string; value: string };
}

export interface IFilterValues {
  university: {
    _id?: string;
    value?: string;
  };
  discipline: {
    _id?: string;
    value?: string;
  };
  module: {
    _id?: string;
    value?: string;
  };
  topic: {
    _id?: string;
    value?: string;
  };
  subTopic: {
    _id?: string;
    value?: string;
  };
}

export const initialErrorState = {
  deckNameError: {
    error: false,
    message: "",
  },
  deckDescriptionError: {
    error: false,
    message: "",
  },
  universityIdError: {
    error: false,
    message: "",
  },
  deckTypeError: {
    error: false,
    message: "",
  },
  deckTagsError: {
    error: false,
    message: "",
  },
  deckYearError: {
    error: false,
    message: "",
  },
};

export const initialQuestionState = {
  _id: "",
  questionText: "",
  isActive: false,
  modules: {
    moduleId: {
      _id: "",
      moduleName: "",
    },
    subtopicId: {
      _id: "",
      subtopicName: "",
    },
    topicId: {
      _id: "",
      topicName: "",
    },
    disciplineId: {
      _id: "",
      disciplineName: "",
    },
  },
};


export interface IDeckGroup {
  _id: string;
  groupName: string;
  groupDescription: string;
  published: boolean;
}

