import React from 'react';
import { Title } from '../../../components/UiComponents/Headings';
import Image from '../../../components/UiComponents/Image';
import Switcher from '../../../components/UiComponents/Switcher';
import { ITopic } from '../../../interfaces/Topics/topics.interface';

interface BannerProps {
   category: string;
   heading: string;
   description: string;
   isPicture?: boolean;
   image?: string;
   disabled?: boolean;
   isActive?: boolean;
   topic: ITopic
   setTopic: (topic: ITopic) => void;
}

const Banner: React.FC<BannerProps> = ({
   category,
   heading,
   description,
   isPicture = true,
   image = "",
   disabled = false,
   isActive = false,
   topic,
   setTopic
}) => {

   const getSwitcherValue = (val: boolean) => {
      if (setTopic) {
         setTopic({
            ...topic, isActive: val,
         });
      }
   };

   const setImage = (val: string) => {
      if (setTopic) {
         setTopic({
            ...topic, topicImage: val,
         });
      }
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
                     <Switcher
                        for="test"
                        onChange={getSwitcherValue}
                        disabled={disabled}
                        togglevalue={isActive}
                     />
                  </div>
               </div>
               <p className="leading-relaxed text-lg mt-2">{description}</p>
            </div>
            {isPicture && (
               <Image
                  src={image.startsWith('https://') ? image : `https://${topic.topicImage}`}
                  shape="circle"
                  size="md"
                  disabled={disabled}
                  setImage={setImage}
               />
            )}
         </div>
      </section>
   );
};

export default Banner;
