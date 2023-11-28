import React, { ReactNode } from 'react';
import { BackIcon, ConfirmationModal, CrossIcon } from '.';
import { useState } from 'react';

interface DrawerProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backScreen?: boolean;
  prevScreenName?: string;
  setScreen?: (screenName: string) => void;
  unSavedData?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({
  title,
  children,
  isOpen,
  setIsOpen,
  size = 'xl',
  backScreen = false,
  setScreen,
  prevScreenName = '',
  unSavedData = false,
}) => {
  const style = {
    sm: ' w-full lg:max-w-xl ',
    md: ' w-full lg:max-w-2xl ',
    lg: ' w-full lg:max-w-3xl ',
    xl: ' w-full lg:min-w-[60rem] max-w-5xl ',
  };

  const drawerSize = style[size];
  const [confirmationModal, setConfirmationModal] = useState(false);
  const handleCancelConfirmation = () => {
    setConfirmationModal(false);
    prevScreenName && setScreen && setScreen(prevScreenName);
  };

  const handleBackScreen = () => {
    console.log("indie handlebacksrecc")
    if (unSavedData) {
      setConfirmationModal(true);
    } else {
      console.log("else")
      prevScreenName && setScreen && setScreen(prevScreenName);
    }
  };
  return (
    <main
      className={
        ' fixed overflow-hidden z-[10000] bg-gray-600 bg-opacity-25 inset-0  transform ease-in-out ' +
        (isOpen
          ? ' transition-opacity opacity-100 duration-500 translate-x-0  '
          : ' transition-all delay-500 opacity-0 translate-x-full  ')
      }
    >


      <ConfirmationModal
        active={confirmationModal}
        message="You have unsaved changes"
        onConfirm={handleCancelConfirmation}
        onCancel={() => setConfirmationModal(false)}
      />
      <section
        className={
          `${drawerSize}  right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  p-4` +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full')
        }
      >
        <article
          className={`relative ${drawerSize}  pb-10 flex flex-col space-y-6 overflow-y-auto h-full`}
        >
          <header className=" font-medium flex items-center justify-start space-x-3 text-lg border-b-[1px] border-b-gray-100">
            <p className=""> {title}</p>
            {backScreen && (
              <span
                className="cursor-pointer"
                onClick={() => handleBackScreen()}
              >
                <BackIcon />
              </span>
            )}

            <button className='lg:hidden fixed top-2 right-2 bg-white border border-gray-200 rounded-full p-3 shadow-lg z-[210]' onClick={() => handleBackScreen()}>    <CrossIcon /></button>
          </header>
          <div className="p-4 pt-0"> {children}</div>
        </article>
      </section>
      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
};

export default Drawer;
