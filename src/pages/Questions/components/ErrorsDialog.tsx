import { FC, useEffect, useState } from "react";
import { IQuestionFormErrorState } from "../interface";
import { CrossIcon } from "../../../components/UiComponents";

interface ErrorsDialogProps {
  errors: IQuestionFormErrorState;
  isError: boolean;
  setShowErrorsDialog: (show: boolean) => void;
}

const ErrorsDialog: FC<ErrorsDialogProps> = ({
  errors,
  setShowErrorsDialog,
  isError = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setShowErrorsDialog(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, setShowErrorsDialog]);

  console.log("isError: ", isError);
  if (!isError) return null;
  return (
    <div className="bg-red-100/50  rounded-md shadow-md border border-red-500 p-3">
      <div
        className={`relative transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        } `}
      >
        <button
          className="absolute top-0 right-0"
          onClick={() => setIsVisible(false)}
        >
          <CrossIcon size="w-5 h-5" />
        </button>
        {errors.disciplineError.error && (
          <p className="flex items-center flex-wrap space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>{" "}
            <span> {errors.disciplineError.message}</span>
          </p>
        )}
        {errors.moduleError.error && (
          <p className="flex items-center flex-wrap space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>{" "}
            <span> {errors.moduleError.message}</span>
          </p>
        )}
        {errors.topicError.error && (
          <p className="flex items-center flex-wrap space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>{" "}
            <span> {errors.topicError.message}</span>
          </p>
        )}
        {errors.optionErrors.error && (
          <p className="flex items-center flex-wrap space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>{" "}
            <span> {errors.optionErrors.message}</span>
          </p>
        )}
        {errors.sourceError.error && (
          <p className="flex items-center flex-wrap space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>{" "}
            <span> {errors.sourceError.message}</span>
          </p>
        )}
        {errors.degreesError.error && (
          <p className="flex items-center flex-wrap space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>{" "}
            <span> {errors.degreesError.message}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorsDialog;
