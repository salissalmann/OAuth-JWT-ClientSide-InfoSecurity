import React, { useState } from 'react';

interface SwitcherProps {
   for: string;
   size?: string;
   onChange?: (enabled: boolean, name: string) => void;
   isActive?: boolean;
   disabled?: boolean;
   togglevalue?: boolean;
}

const Switcher: React.FC<SwitcherProps> = ({
   for: toggleId,
   size = 'normal',
   onChange,
   isActive,
   disabled = false,
   togglevalue,
}) => {
   console.log("toogleValue: ",togglevalue)
   const [enabled, setEnabled] = useState(() => {
      return isActive !== undefined && isActive !== null ? isActive : false;
   });

   React.useEffect(() => {
      if (togglevalue !== undefined && togglevalue !== null) {
         setEnabled(togglevalue);
      }
   }, [togglevalue]);

   const handleToggleChange = () => {
      const newEnabled = !enabled;
      setEnabled(newEnabled);
      if (onChange) {
         onChange(newEnabled, toggleId);
      }
   };

   return (
      <label
         htmlFor={`toggle_${toggleId}`}
         className="flex cursor-pointer select-none items-center justify-center w-fit"
      >
         <div className="relative">
            <input
               name={toggleId}
               type="checkbox"
               id={`toggle_${toggleId}`}
               className="sr-only"
               onChange={handleToggleChange}
               disabled={disabled}
            />
            <div
               className={`block rounded-full ${
                  enabled ? ' bg-primary ' : ' bg-gray-200 '
               }  ${size === 'small' ? 'h-6 w-12' : 'h-8 w-14'}`}
            ></div>
            <div
               className={`absolute rounded-full bg-white transition ${
                  enabled &&
                  (size === 'small'
                     ? ' !translate-x-[145%]  '
                     : ' !right-1 !translate-x-full  ')
               } ${
                  size === 'small'
                     ? ' left-1 top-1 h-4 w-4 '
                     : ' left-1 top-1 h-6 w-6 '
               }`}
            ></div>
         </div>
      </label>
   );
};

export default Switcher;

// export const Switcher = (props: { for: string | number; size?: string }) => {
//     const [enabled, setEnabled] = useState(false);
//     let size = {
//       normal: {
//         x: " h-8 w-14 ",
//         y: " left-1 top-1  h-6 w-6",
//         z: " !right-1 !translate-x-full ",
//       },
//       small: {
//         x: "h-6 w-12",
//         y: "left-1 top-1  h-4 w-4 ",
//         z: "  !translate-x-[135%] ",
//       },
//     };
//     const styleX = props.size === "small" ? size.small.x : size.normal.x;
//     const styleY = props.size === "small" ? size.small.y : size.normal.y;
//     const styleZ = props.size === "small" ? size.small.z : size.normal.z;

//     return (
//       <label
//         htmlFor={`toggle_${props.for}`}
//         className="flex cursor-pointer select-none items-center justify-center w-fit"
//       >
//         <div className="relative">
//           <input
//             type="checkbox"
//             id={`toggle_${props.for}`}
//             className="sr-only"
//             onChange={() => {
//               setEnabled(!enabled);
//             }}
//           />
//           <div className={` block ${styleX} rounded-full bg-gray-200 `}></div>
//           <div
//             className={`absolute ${styleY}   rounded-full bg-white transition ${
//               enabled && `${styleZ}  !bg-primary `
//             }`}
//           ></div>
//         </div>
//       </label>
//     );
//   };
