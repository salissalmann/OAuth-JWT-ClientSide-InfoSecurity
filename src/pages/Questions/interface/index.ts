// Error States
// Define a type for your error object
export interface IErrorObject {
  error: boolean;
  message: string;
}

// Define a type for the entire error state
export interface IQuestionFormErrorState {
  moduleError: IErrorObject;
  disciplineError: IErrorObject;
  topicError: IErrorObject;
  subTopicError: IErrorObject;
  sourceError: IErrorObject;
  questionTextError:IErrorObject;
  optionErrors:IErrorObject;
  degreesError:IErrorObject;
}
