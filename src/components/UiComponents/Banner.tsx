import React from 'react';
import { Title } from './Headings';
import Image from './Image';

interface BannerProps {
   category: string;
   heading: string;
   description: string;
   link: string;
   isPicture?: boolean;
   isLink?: boolean;
}

const Banner: React.FC<BannerProps> = ({
   category,
   heading,
   description,
   link,
   isPicture = true,
   isLink = true,
}) => {
   return (
      <section className="text-gray-600 body-font overflow-hidden">
         <div className="mx-auto flex items-center justify-between">
            <div className="flex flex-col items-start">
               <span className="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                  {category}
               </span>
               <Title>{heading}</Title>

               <p className="leading-relaxed mb-8">{description}</p>
               {isLink && (
                  <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                     <a
                        className="text-indigo-500 inline-flex items-center"
                        href={link}
                     >
                        Learn More
                        <svg
                           className="w-4 h-4 ml-2"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                           strokeWidth={2}
                           fill="none"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        >
                           <path d="M5 12h14" />
                           <path d="M12 5l7 7-7 7" />
                        </svg>
                     </a>
                  </div>
               )}
            </div>
            {isPicture && (
               <Image
                  src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-tailwind/img/team-1.jpg"
                  shape="circle"
               />
            )}
         </div>
      </section>
   );
};

export default Banner;
