export const tabsType = {
  QuestionDetails: 'Question Details',
  QuestionBody: 'Question Body',
  ExtraInfo: 'Extra Info',
  // ChangeLog: 'ChangeLog',
};
export const initialTabsOptions = [
  tabsType.QuestionDetails,
  tabsType.QuestionBody,
  tabsType.ExtraInfo,
  // tabsType.ChangeLog,
];

export const EMPTY_CONTENT = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
};

export const initialQuestionState = {
  questionText: '',
  // slug: '',
  body: EMPTY_CONTENT,
  tip: EMPTY_CONTENT,
  plainTipText: '',
  degrees:[],
  questionType: '',
  referencePdfLink: [],
  options: [
    {
      optionText: EMPTY_CONTENT,
      isCorrect: true,
      explanationText: EMPTY_CONTENT,
    },
  ],
  isActive: true,
  questionSource: {
    uniDetails: [
      {
        uniId: '',
        year: '',
        examType: '',
      },
    ],
    practiceQuestionDetails: { practiceTags: [] },
  },
  modules: {
    moduleId: '',
    subtopicId: '',
    topicId: '',
    disciplineId: '',
  },
  metaData: {
    createdBy: '',
    lastEditedBy: '',
  },
};
export const initialErrorState = {
  moduleError: {
    error: false,
    message: '',
  },
  disciplineError: {
    error: false,
    message: '',
  },
  topicError: {
    error: false,
    message: '',
  },
  subTopicError: {
    error: false,
    message: '',
  },
  sourceError: {
    error: false,
    message: '',
  },
  optionErrors: {
    error: false,
    message: '',
  },
  questionTextError: {
    error: false,
    message: '',
  },
  degreesError:{
    error:false,
    message:''
  }
};

export const initialPopulatedData = {
  modules: {
    moduleId: {
      _id: '',
      moduleName: '',
    },
    subtopicId: {
      _id: '',
      subtopicName: '',
    },
    topicId: {
      _id: '',
      topicName: '',
    },
    disciplineId: {
      _id: '',
      disciplineName: '',
    },
  },
  uniDetails: [
    {
      uniId: {
        _id: '',
        universityName: '',
      },
      year: '',
      examType: '',
    },
  ],
};


export const degreesData = ["MBBS", "BDS", "PHARMD", "NURSING", "DPT"];