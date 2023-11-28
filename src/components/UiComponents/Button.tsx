import { ReactNode } from 'react';
import { LoadingIconFilled, LoadingIconOutlined } from './Icons';
type ButtonIcon = ReactNode;

interface ButtonProps {
  children?: ReactNode;
  isLoading?: boolean;
  icon?: ButtonIcon;
  width?: string;
  type?: 'danger';
  handleClick: () => void;
  disabled?: boolean;
  margin?: boolean;
  height?: string;
  onHoverBgFilled?: boolean;
}

export const ButtonFill = (props: ButtonProps) => {
  const isDisabled = props.disabled !== undefined ? props.disabled : false;

  return (
    <button
      className={`relative flex h-12 cursor-pointer w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg ${
        props.type === 'danger' ? 'before:bg-red-600' : 'before:bg-primary'
      }  before:transition before:duration-300 before:scale-95 hover:before:scale-100 active:duration-75 ${
        isDisabled &&
        ' disabled:opacity-90 disabled:cursor-not-allowed disabled:bg-whiter '
      }  ${props.margin ? 'my-2' : ' '} active:before:scale-95 ${
        props.width ? props.width : ' sm:w-max '
      }`}
      disabled={isDisabled}
      onClick={() => {
        props.handleClick();
      }}
    >
      {props.isLoading ? (
        <>
          <div role="status" className="flex items-center space-x-2">
            <span className="relative text-base font-semibold text-white flex items-center space-x-3">
              Loading
            </span>
            <LoadingIconFilled />
          </div>
        </>
      ) : (
        <div
          className={`relative flex items-center ${
            props.children && props.icon && ' space-x-3 '
          }  text-white`}
        >
          {props.icon}
          {props.children && (
            <span className=" text-base font-semibold">{props.children}</span>
          )}
        </div>
      )}
    </button>
  );
};


export const ButtonOutlined = (props: ButtonProps) => {
  const isDisabled = props.disabled !== undefined ? props.disabled : false;

  return (
    <button
      className={`relative flex ${
        props?.height ? props.height : ' h-12 '
      } items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border  before:bg-gradient-to-b before:transition before:duration-300 before:scale-95 hover:before:scale-100 ${
        props?.onHoverBgFilled
          ? ' hover:before:bg-primary  hover:before:border-primary'
          : ' before:border-gray-200 before:bg-gray-50 '
      } active:duration-75 active:before:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-whiter group  ${
        props.width ? props.width : ' sm:w-max w-full '
      }  ${props.margin ? 'my-2' : ' '} `}
      onClick={() => props.handleClick()}
      disabled={isDisabled}
    >
      {props.isLoading ? (
        <>
          <div role="status" className="flex items-center space-x-2">
            <span className="relative text-base font-semibold text-primary flex items-center space-x-3">
              Loading
            </span>
            <LoadingIconOutlined />
          </div>
        </>
      ) : (
        <div
          className={`relative flex items-center ${
            props.children && props.icon && ' space-x-3 '
          }
          
          ${
            props?.onHoverBgFilled
              ? ' text-primary group-hover:text-white '
              : ' text-primary '
          }

          
          `}
        >
          {props.icon}
          {props.children && (
            <span className=" text-base font-semibold">{props.children}</span>
          )}
        </div>
      )}
    </button>
  );
};

export const DarkButton: React.FC<ButtonProps> = (props) => {
  const isDisabled = props.disabled !== undefined ? props.disabled : false;
  return (
    <button
      className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg  before:bg-gray-800 before:bg-gradient-to-b before:transition before:duration-300  active:duration-75 sm:w-max my-2 disabled:before:opacity-70 active:before:scale-95 hover:before:scale-105 disabled:cursor-not-allowed `}
      onClick={() => {
        props.handleClick();
      }}
      disabled={isDisabled}
    >
      <div
        className={`relative flex items-center text-white ${
          props.children && props.icon && ' space-x-3 '
        }`}
      >
        {props.children && (
          <span className=" text-base font-semibold">{props.children}</span>
        )}
        {props.icon}
      </div>
    </button>
  );
};

export const Loader = () => {
  return (
    <div role="status" className="flex items-center space-x-2">
      <LoadingIconOutlined />
    </div>
  );
};
