import Badge from '../../../components/UiComponents/Badges';
import { SecondaryHeading } from '../../../components/UiComponents/Headings';
import {
  IMcqQuestion,
  IModulesPopulated,
  IUniDetails,
} from '../../Decks/Interfaces';

const QuestionPreviewScreen = ({
  question,
  modules,
  uniDetails,
}: {
  question: IMcqQuestion;
  modules: IModulesPopulated;
  uniDetails: IUniDetails[] | [];
}) => {
  return (
    <div className=" mb-4 rounded-t sm:mb-5 text-sm max-h-[80vh] overflow-y-scroll">
      <div className="">
        <SecondaryHeading>Question:</SecondaryHeading>
        <p className=""> {question?.questionText}</p>
      </div>
      <div className="flex items-center  gap-3 flex-wrap mt-2">
        <Badge
          type="success"
          label={`Discipline: ${modules?.disciplineId?.disciplineName}`}
          customTheme={true}
          color="bg-pink-100 text-pink-700"
        />
        <Badge
          type="success"
          label={`Module: ${modules?.moduleId?.moduleName}`}
          customTheme={true}
          color="bg-violet-100 text-violet-700"
        />
        <Badge
          type="success"
          label={`Topic: ${modules?.topicId?.topicName}`}
          customTheme={true}
          color="bg-yellow-100 text-yellow-700"
        />
        <Badge
          type="success"
          label={`SubTopic: ${modules?.subtopicId?.subtopicName}`}
          customTheme={true}
          color="bg-blue-100 text-blue-700"
        />
      </div>

      {question.options && question.options.length > 0 && (
        <div className="">
          <SecondaryHeading>Options:</SecondaryHeading>
          <div className="space-y-4">
            {question.options &&
              question.options.length > 0 &&
              question.options.map((opt, index) => {
                return (
                  <div className="" key={index}>
                    <p className="">
                      <span className="font-medium text-primary">
                        Option {index + 1}:
                      </span>{' '}
                      {opt?.plainOptionText}
                    </p>
                    <p className="">
                      <span className="font-medium text-primary">
                        Explanation {index + 1}:
                      </span>{' '}
                      {opt?.plainExplanationText}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <SecondaryHeading>Question Source:</SecondaryHeading>

        {uniDetails &&
          uniDetails?.map((uni, index) => {
            return (
              <div className="" key={index}>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">University:</p>
                  <p className="text-emerald-600">
                    {typeof uni?.uniId === 'object'
                      ? uni?.uniId?.universityName
                      : uni?.uniId}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">year:</p>
                  <p className="">{uni?.year}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">Exam Type:</p>
                  <p className="">{uni?.examType}</p>
                </div>
              </div>
            );
          })}
      </div>
      {question?.questionText && (
        <div className="">
          <SecondaryHeading>Question Tip:</SecondaryHeading>
          <p className=""> {question?.plainTipText}</p>
        </div>
      )}

      {question &&
        question?.questionSource?.practiceQuestionDetails?.practiceTags &&
        question?.questionSource?.practiceQuestionDetails?.practiceTags.length >
          0 && (
          <div>
            <SecondaryHeading>Question Tags:</SecondaryHeading>
            <div className="flex flex-wrap gap-2">
              {question?.questionSource?.practiceQuestionDetails?.practiceTags.map(
                (tag, index) => {
                  return (
                    <Badge
                      key={index}
                      type="success"
                      label={tag.trim()}
                      customTheme={true}
                      color="bg-gray-100 text-gray-700"
                    />
                  );
                }
              )}
            </div>
          </div>
        )}

      {question && question?.degrees && question?.degrees.length > 0 && (
        <div>
          <SecondaryHeading>Degrees:</SecondaryHeading>
          <div className="flex flex-wrap gap-2">
            {question?.degrees.map((tag, index) => {
              return (
                <Badge
                  key={index}
                  type="success"
                  label={tag.trim()}
                  customTheme={true}
                  color="bg-gray-100 text-gray-700"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPreviewScreen;
