import { useState } from 'react';
import Editor from '../../../components/Editor/Editor';
import {
  Divider,
  SecondaryHeading,
} from '../../../components/UiComponents/Headings';
import { IMcqQuestion } from '../../Decks/Interfaces';
import { TextArea } from '../../../components/UiComponents';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { degreesData } from '../constants';

interface QuestionProps {
  question: IMcqQuestion;
  setQuestion: (question: IMcqQuestion) => void;
  disabledQuestionEdit: boolean;
}

const QuestionExtraInfo: React.FC<QuestionProps> = ({
  question,
  setQuestion,
  disabledQuestionEdit,
}) => {
  const [editorState, setEditorState] = useState<object>(question.tip);

  const handleEditorStateChange = (newState: object, plainText: string) => {
    setEditorState(newState);
    setQuestion({ ...question, tip: newState, plainTipText: plainText });
  };

  const handleQuestionTags = (_: string, value: string) => {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    // Update the question state with the new practiceTags value
    const updatedQuestion = {
      ...question,
      questionSource: {
        ...question.questionSource,
        practiceQuestionDetails: {
          ...question.questionSource?.practiceQuestionDetails,
          practiceTags: tags,
        },
      },
    };

    setQuestion(updatedQuestion);
  };

  const handleDegreeClick = (degree: string) => {
    if (question.degrees && question.degrees.includes(degree)) {
      const updatedDegrees = question.degrees.filter((d) => d !== degree);
      setQuestion({ ...question, degrees: updatedDegrees });
    } else {
      const updatedDegrees = question.degrees
        ? [...question.degrees, degree]
        : [degree];
      setQuestion({ ...question, degrees: updatedDegrees });
    }
  };
  console.log('Degrees: ', question.degrees);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <SecondaryHeading>Tip</SecondaryHeading>
        <Divider />

        <div className="">
          <SecondaryHeading darkColor={true}>Question Tip</SecondaryHeading>
          <Editor
            editorState={
              editorState as SerializedEditorState<SerializedLexicalNode>
            }
            setEditorState={handleEditorStateChange}
            disabled={disabledQuestionEdit}
            reset={true}
            getPlainText
          />
        </div>
      </div>

      <div className="space-y-4">
        <SecondaryHeading>Degree </SecondaryHeading>
        <Divider />

        <div className="space-x-2">
          {degreesData.map((degree) => (
            <button
              key={degree}
              className={`${
                question.degrees && question.degrees.includes(degree)
                  ? 'bg-primary text-white'
                  : 'bg-gray-200/50 text-gray-600 '
              } rounded-full py-2 px-4 text-sm font-semibold shadow-sm`}
              onClick={() => handleDegreeClick(degree)}
            >
              {degree}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SecondaryHeading>Tags</SecondaryHeading>
        <Divider />

        <div className="">
          <SecondaryHeading darkColor={true}>Question Tags</SecondaryHeading>
          <span className="text-gray-600 text-sm inline-block mb-2">
            Please write tags in comma-separated format,{' '}
            <span className="text-emerald-700">
              e.g: biology,example,tagSample
            </span>
          </span>
          <TextArea
            for="Question Tags"
            value={
              question.questionSource?.practiceQuestionDetails?.practiceTags
                ? question.questionSource?.practiceQuestionDetails?.practiceTags.join(
                    ','
                  )
                : ''
            }
            setValue={(_, value) => handleQuestionTags(_, value)}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionExtraInfo;
