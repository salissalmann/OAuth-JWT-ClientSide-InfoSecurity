import { Title } from '../../../components/UiComponents/Headings';
import {
   EditIcon,
   LoadingIconFilled,
   SaveIcon,
} from '../../../components/UiComponents//Icons';
import MyToast, { showToast } from '../../../components/UiComponents//MyToast';
import Switcher from '../../../components/UiComponents/Switcher';
import { useEditDeckGroups } from '../../../hooks';
import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../../../components/UiComponents';

interface IDeckGroupData {
   id: string;
   deckName: string;
   deckSource: string;
   deckDescription?: string;
   published: boolean;
   decksInformation: {
      deckId: string;
      deckName: string;
      deckDescription: string;
      deckTime: number;
      isPremium: boolean;
      isPublished: boolean;
   }[];
}

interface BannerProps {
   category: string;
   heading: string;
   formData: IDeckGroupData;
   setFormData: (data: IDeckGroupData) => void;
   disabled: boolean;
   handleDisabled: () => void;
   originalDeckGroupInfo: IDeckGroupData,
   validateForm: (() => boolean);
}

const Banner: React.FC<BannerProps> = ({
   category,
   formData,
   setFormData,
   disabled = false,
   handleDisabled,
   originalDeckGroupInfo,
   validateForm

}) => {

   const [confirmationModal, setConfirmationModal] = useState(false)

   const getSwitcherValue = (val: boolean) => {
      setFormData({ ...formData, published: val });
   };


   useEffect(() => {
      validateForm();
   }, [formData]);


   const EditDeckGroupMutation = useEditDeckGroups()
   const HandleSave = async () => {
      if (validateForm()) {
         setFormData(originalDeckGroupInfo)
         return;
      }
      if (JSON.stringify(originalDeckGroupInfo) === JSON.stringify(formData)) {
         return;
      }

      const data = await EditDeckGroupMutation.mutateAsync({
         deckgroupId: formData.id,
         deckgroup: {
            groupName: formData.deckName,
            groupDescription: formData.deckDescription,
            groupSource: formData.deckSource,
            published: formData.published,
         }
      });

      if (data.success) {
         showToast(
            'Deck Group Updated Successfully',
            'success',
            <LoadingIconFilled />
         );
      }
   };

   return (
      <section className="text-gray-600 body-font overflow-hidden border-b-2 border-gray-100">
         <div
            className="mx-auto flex items-center justify-between px-5 py-4 md:flex-row flex-col">
            <div className="flex flex-col items-start">
               <span className="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                  {category}
               </span>
               <div className="flex flex-row items-center justify-center gap-3">
                  <Title>{`${formData.deckName}`}</Title>
                  <Switcher
                     for="test"
                     onChange={getSwitcherValue}
                     disabled={disabled}
                     togglevalue={formData.published}
                  />
               </div>
            </div>
            <div className="ml-auto">
               {disabled ? (
                  <>
                     <button
                        className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                        onClick={handleDisabled}
                     >
                        <div
                           className={`relative flex items-center space-x-3
                  text-gray-600`}
                        >
                           <EditIcon />
                           <span className=" text-base font-semibold">
                              Edit
                           </span>
                        </div>
                     </button>
                  </>
               ) : (
                  <div className="
                flex items-center justify-between mt-5 border-b pb-2 gap-5
                ">
                     <button
                        className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                        onClick={() => {
                           if (JSON.stringify(originalDeckGroupInfo) === JSON.stringify(formData)) {
                              handleDisabled()
                              return
                           }
                           else {
                              setConfirmationModal(true)
                           }
                        }}
                     >
                        <div
                           className={`relative flex items-center space-x-3 text-gray-800`}
                        >
                           <EditIcon />
                           <span className=" text-base font-semibold">Cancel</span>
                        </div>
                     </button>
                     <button
                        className={`relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-lg before:border before:border-gray-200 before:bg-gray-800 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max my-2`}
                        onClick={() => {
                           handleDisabled();
                           HandleSave();
                        }}
                     >
                        <div
                           className={`relative flex items-center space-x-3
                     text-white`}
                        >
                           <SaveIcon />
                           <span className=" text-base font-semibold">Save</span>
                        </div>
                     </button>
                  </div>
               )}
            </div>
         </div>
         <ConfirmationModal
            active={confirmationModal}
            message="Are you sure you want to discard the changes you have made?"
            onConfirm={() => {
               setFormData(originalDeckGroupInfo)
               setConfirmationModal(false)
               handleDisabled()
            }}
            onCancel={() => {
               setConfirmationModal(false)
            }}
         />
         <MyToast />
      </section>
   );
};

export default Banner;
