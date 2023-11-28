import { ButtonFill } from "../../../components/UiComponents";
import IModule from "./Module.interface";
import Image from "../../../components/UiComponents/Image";

interface ViewModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  module: IModule;
  active: boolean;
}

const ViewModal: React.FC<ViewModalProps> = (props) => {
  return (
    <div
      id="readProductModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.active ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative w-full max-w-xl max-h-full p-4">
        <div className="relative p-4 bg-white rounded-lg shadow ddark:bg-gray-800 sm:p-5">
          {/* Modal header */}
          <div className="flex justify-between mb-4 rounded-t sm:mb-5">
            <div className="text-sm text-gray-900 md:text-xl ddark:text-white">
              <span className="inline-block px-2 py-1 text-xs font-medium tracking-widest text-indigo-500 rounded bg-indigo-50">
                Module
              </span>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center gap-3 pb-4">
              {props.module.moduleImage ? (
                <Image
                  src={props.module.moduleImage}
                  size="xs"
                  disabled
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              )}
              <dd className="text-xl font-bold text-gray-900 sm:mb-2 ddark:text-gray-400">
                {props.module.moduleName}
              </dd>
            </div>
            <div>
              <dd className="mb-4 font-light text-gray-900 sm:mb-5 ddark:text-gray-400">
                {props.module.moduleDescription}
              </dd>
              <dt
                className={`inline-block py-1 px-2 rounded ${
                  props.module.isActive ? "bg-green-500" : "bg-rose-500"
                }  text-white text-xs font-medium tracking-widest`}
              >
                {props.module.isActive ? "Active" : "InActive"}
              </dt>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <ButtonFill
              handleClick={() => {
                props.setIsOpen(false);
              }}
            >
              Close
            </ButtonFill>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
