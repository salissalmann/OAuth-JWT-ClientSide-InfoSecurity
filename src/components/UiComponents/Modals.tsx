import { useState } from "react";
import { ButtonFill, ButtonOutlined } from "./Button";
import { Input, Label } from "./Forms";

interface ModalProps {
  active: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
  children?: React.ReactNode;
  isActionButton?: boolean;
  actionButtonText?: string | React.ReactNode;
  actionButtonCallBack?: () => void;
}

export const ViewModal = (props: ModalProps) => {
  return (
    <div
      id="readProductModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.active ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative p-4 w-full max-w-xl max-h-full">
        {/* Modal content */}
        <div className="relative p-4 bg-white rounded-lg shadow ddark:bg-gray-800 sm:p-5">
          {/* Modal header */}
          <div className="flex justify-between mb-4 rounded-t sm:mb-5">
            <div className="text-lg text-gray-900 md:text-xl ddark:text-white">
              <h3 className="font-semibold ">Apple iMac 27”</h3>
              <p className="font-bold">$2999</p>
            </div>
            <div>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex ddark:hover:bg-gray-600 ddark:hover:text-white"
                data-modal-toggle="readProductModal"
                onClick={() => props.onCancel()}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
          <dl>
            <dt className="mb-2 font-semibold leading-none text-gray-900 ddark:text-white">
              Details
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 ddark:text-gray-400">
              Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7
              processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory,
              Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage,
              Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.
            </dd>
            <dt className="mb-2 font-semibold leading-none text-gray-900 ddark:text-white">
              Category
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 ddark:text-gray-400">
              Electronics/PC
            </dd>
          </dl>
          <div className="flex justify-end items-center space-x-3">
            <ButtonFill handleClick={() => {}}>Edit</ButtonFill>
            <ButtonOutlined handleClick={() => {}}>Preview</ButtonOutlined>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SnapShotModal = (props: ModalProps) => {
  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.active ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40 space-y-0`}
      style={{ marginTop: "0 !important" }}
    >
      <div className="relative p-4 w-full max-w-3xl max-h-full ">
        {/* Modal content */}
        <div className="relative p-4 bg-white rounded-lg shadow ddark:bg-gray-800 sm:p-5">
          {props.children}
          <div className="flex justify-end items-center space-x-3 mt-5">
            <ButtonOutlined handleClick={() => props.onCancel()}>
              Cancel
            </ButtonOutlined>

            {props.isActionButton && (
              <ButtonFill
                handleClick={() =>
                  props.actionButtonCallBack && props.actionButtonCallBack()
                }
              >
                {props.actionButtonText ? props.actionButtonText : "Confirm"}
              </ButtonFill>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeleteModal = (props: ModalProps) => {
  return (
    <div
      id="deleteModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.active ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative p-4 text-center bg-white rounded-lg shadow ddark:bg-gray-800 sm:p-5">
          <button
            type="button"
            className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ddark:hover:bg-gray-600 ddark:hover:text-white"
            data-modal-toggle="deleteModal"
            onClick={() => props.onCancel()}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <svg
            className="text-gray-400 ddark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="mb-4 text-gray-500 ddark:text-gray-300">
            Are you sure you want to delete this item?
          </p>
          <div className="flex justify-center items-center space-x-4">
            <ButtonOutlined handleClick={() => {}}> No, cancel</ButtonOutlined>

            <ButtonFill type="danger" handleClick={() => props.onConfirm()}>
              {" "}
              Yes, I'm sure
            </ButtonFill>
            {/* <button
              type="submit"
              className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 ddark:bg-red-500 ddark:hover:bg-red-600 ddark:focus:ring-red-900"
            >
           
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export const ConfirmationModal = (props: ModalProps) => {
  return (
    <div
      id="deleteModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.active ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative p-4 text-center bg-white rounded-lg shadow ddark:bg-gray-800 sm:p-5">
          <button
            type="button"
            className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ddark:hover:bg-gray-600 ddark:hover:text-white"
            data-modal-toggle="deleteModal"
            onClick={() => props.onCancel()}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <svg
            className="text-gray-400 ddark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="mb-4 text-gray-500 ddark:text-gray-300">
            {props.message}
          </p>
          <div className="flex justify-center items-center space-x-4">
            <ButtonOutlined handleClick={() => props.onCancel()}>
              {" "}
              cancel
            </ButtonOutlined>

            <ButtonFill type="danger" handleClick={() => props.onConfirm()}>
              {" "}
              Confirm
            </ButtonFill>
            {/* <button
              type="submit"
              className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 ddark:bg-red-500 ddark:hover:bg-red-600 ddark:focus:ring-red-900"
            >
           
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EmptyModal = ({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  return (
    <div
      id="deleteModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        isOpen ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative p-4 text-center bg-white rounded-lg shadow ddark:bg-gray-800 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export const UpdateModal = (props: ModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    checkboxes: [],
  });
  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div
      id="updateProductModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.active ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative p-4 bg-white rounded-lg shadow  sm:p-5">
          {/* Modal header */}
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Update Product
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
              data-modal-toggle="updateProductModal"
              onClick={() => props.onCancel()}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <form action="#" className="space-y-3">
            <div className="">
              <Label>First name</Label>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                name="firstName"
                onChange={handleInputChange}
              />
            </div>

            <div className="">
              <Label>Last name</Label>
              <Input
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                name="lastName"
                onChange={handleInputChange}
              />
            </div>

            <div className="">
              <Label required={true}>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end items-center space-x-3">
              <ButtonFill handleClick={() => {}}>Cancel</ButtonFill>
              <ButtonOutlined
                handleClick={() => {
                  () => props.onConfirm();
                }}
              >
                Update Product
              </ButtonOutlined>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const CreateModal = (props: ModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    checkboxes: [],
  });
  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div
      id="createProductModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.active ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-[1000]  flex justify-center items-center w-full h-screen bg-gray-200/40`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative p-4 bg-white rounded-lg shadow ">
          {/* Modal header */}
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Add Product
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
              data-modal-target="createProductModal"
              data-modal-toggle="createProductModal"
              onClick={() => props.onCancel()}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <form action="#">
            <div className="">
              <Label>First name</Label>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                name="firstName"
                onChange={handleInputChange}
              />
            </div>

            <div className="">
              <Label>Last name</Label>
              <Input
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                name="lastName"
                onChange={handleInputChange}
              />
            </div>

            <div className="">
              <Label required={true}>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-end">
              <ButtonOutlined handleClick={() => () => props.onConfirm()}>
                {" "}
                Add new product
              </ButtonOutlined>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
