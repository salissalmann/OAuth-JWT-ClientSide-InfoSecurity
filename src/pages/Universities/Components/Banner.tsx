import axios from 'axios';
import React, { useState } from 'react';
import { Title } from '../../../components/UiComponents/Headings';
import MyToast, { showToast } from '../../../components/UiComponents/MyToast';
import { addImageToUniversity } from '../../../services/api';
import { IUniversity } from './Universities.interface';

interface BannerProps {
   category: string;
   heading: string;
   description?: string;
   isPicture: boolean;
   image: string;
   disabled: boolean;
   university?: IUniversity | undefined;
   setUniversity: (university: IUniversity | undefined) => void;
   displayOriginalImage: boolean;
   setDisplayOriginalImage: (val: boolean) => void;
}

const Banner: React.FC<BannerProps> = ({
   category,
   heading,
   description,
   isPicture = true,
   image = "",
   disabled = false,
   university,
   displayOriginalImage,
   setDisplayOriginalImage,
}) => {
   const [base64Image, setBase64Image] = useState<string>(image)

   const handleEditClick = () => {
      const input = document.getElementById('image') as HTMLInputElement;
      input?.click();
      input?.addEventListener('change', async (e) => {
         const file = (e.target as HTMLInputElement).files![0];
         if (file) {
            //Upload Image
            const formData = new FormData();
            formData.append('universityLogo', file);
            try {
               if (!university?._id) return;
               const Response = await addImageToUniversity(university._id, formData)
               if (Response.status === 200) {
                  showToast('Image Updated!', 'success');
               }
            } catch (error) {
               if (axios.isAxiosError(error)) {
                  showToast(error.response?.data, 'error');
               } else {
                  showToast('Something went wrong', 'error');
               }
            }


            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
               setBase64Image(reader.result as string);
               setDisplayOriginalImage(false)
            };
         }
      });
   };



   return (
      <section className="text-gray-600 body-font overflow-hidden border-b pb-2">
         <div className="mx-auto flex items-center justify-between">
            <div className="flex flex-col items-start">
               <span className="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                  {category}
               </span>
               <div>
                  <div className="flex flex-row items-center justify-center gap-3">
                     <Title>{heading}</Title>
                  </div>
               </div>
               <p className="leading-relaxed text-lg mt-2">{description}</p>
            </div>
            <div style={{ position: 'relative' }}>
               {!disabled && (
                  <>
                     <button
                        className="edit-button text-white font-bold py-2 px-4 rounded-full z-10 bg-gray-700 bg-opacity-75 hover-bg-gray-700 opacity-100 transition duration-300 ease-in-out"
                        onClick={handleEditClick}
                        style={{
                           position: 'absolute',
                           top: '35%',
                           left: '22%',
                           zIndex: 1,
                        }}
                     >
                        Edit
                     </button>
                     <input type="file" accept="image/*" name="image" id="image" className="hidden" />
                  </>
               )}
               {isPicture && (
                  <img
                     src={displayOriginalImage ?
                        (university?.universityLogo.startsWith('https://') ? university?.universityLogo :
                           `http://${university?.universityLogo}`)
                        : (base64Image || 'placeholder-image-url')}
                     alt="avatar image"
                     loading="lazy"
                     className="inline-flex items-center justify-center mr-2 text-white transition-all duration-200 ease-in-out rounded-full w-28 h-28 object-cover max-w-full max-h-full border 
                     border-gray-300"
                  />
               )}
            </div>
         </div>
         <MyToast />

      </section>
   );
};

export default Banner;
