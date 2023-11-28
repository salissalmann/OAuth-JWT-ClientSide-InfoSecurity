import Badge from '../../../components/UiComponents/Badges';
import { SecondaryHeading } from '../../../components/UiComponents/Headings';
import { IMcqQuestionPopulated } from '../../Decks/Interfaces';

const QuestionViewSnapShot = ({
  selectedQuestionForView,
}: {
  selectedQuestionForView: IMcqQuestionPopulated;
}) => {
  return (
    <div className="space-y-5 mb-4 rounded-t sm:mb-5 text-sm">
      <div className=" text-gray-900  ddark:text-white">
        <h4 className="font-medium ">Q_ID: {selectedQuestionForView?._id}</h4>
      </div>

      <p className="">Question: {selectedQuestionForView?.questionText}</p>
      <div className="flex items-center  gap-3 flex-wrap">
        <Badge
          type="success"
          label={`Discipline: ${selectedQuestionForView?.modules?.disciplineId?.disciplineName}`}
          customTheme={true}
          color="bg-pink-100 text-pink-700"
        />
        <Badge
          type="success"
          label={`Module: ${selectedQuestionForView?.modules?.moduleId?.moduleName}`}
          customTheme={true}
          color="bg-violet-100 text-violet-700"
        />
        <Badge
          type="success"
          label={`Topic: ${selectedQuestionForView?.modules?.topicId?.topicName}`}
          customTheme={true}
          color="bg-yellow-100 text-yellow-700"
        />
        <Badge
          type="success"
          label={`SubTopic: ${selectedQuestionForView?.modules?.subtopicId?.subtopicName}`}
          customTheme={true}
          color="bg-blue-100 text-blue-700"
        />
      </div>
      <div className="space-y-4">
        {selectedQuestionForView?.questionSource &&
          selectedQuestionForView?.questionSource?.uniDetails?.map(
            (uni, index) => {
              return (
                <div className="" key={index}>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">University:</p>
                    <p className="text-emerald-600">
                      {uni.uniId &&
                      typeof uni?.uniId === 'object' &&
                      uni.uniId.universityName
                        ? uni.uniId.universityName
                        : typeof uni.uniId == 'string'
                        ? 'Uni Id: ' + uni.uniId + ' not found '
                        : 'Unknown'}
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
            }
          )}
      </div>

      {selectedQuestionForView &&
        selectedQuestionForView?.questionSource?.practiceQuestionDetails
          ?.practiceTags &&
        selectedQuestionForView?.questionSource?.practiceQuestionDetails
          ?.practiceTags.length > 0 && (
          <div>
            <SecondaryHeading>Question Tags:</SecondaryHeading>
            <div className="flex flex-wrap gap-2">
              {selectedQuestionForView?.questionSource?.practiceQuestionDetails?.practiceTags.map(
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
      {selectedQuestionForView &&
        selectedQuestionForView?.degrees &&
        selectedQuestionForView?.degrees.length > 0 && (
          <div>
            <SecondaryHeading>Degrees:</SecondaryHeading>
            <div className="flex flex-wrap gap-2">
              {selectedQuestionForView?.degrees.map((tag, index) => {
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

export default QuestionViewSnapShot;
