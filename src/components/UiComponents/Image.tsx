// 🔰 Props Implementation
//  you will have to pass image src
// type = circle or square  (default: square)
// for custom size you will have to pass both hight and width like this ( valid tailwindcss width and height classes):  w-5 h-5 ,  w-6 h-6 , w-7 h-7 ...

{
  /* <Image src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-tailwind/img/team-1.jpg" /> */
}
import { useState } from 'react';

const Image = (props: {
  src: string;
  shape?: 'circle' | 'square' | 'rectangle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  disabled?: false | boolean;
  setImage?: ((val: string) => void) | undefined;
}) => {
  // console.log("Src: ",props.src)
  const shapeClass = props.shape
    ? props.shape === 'circle'
      ? 'rounded-full'
      : props.shape === 'square'
        ? 'rounded-sm'
        : 'rounded-none'
    : '';

  let sizeClass = '';
  if (props.shape === 'rectangle' && props.size) {
    sizeClass =
      props.size === 'xs'
        ? 'w-10 h-10'
        : props.size === 'sm'
          ? 'w-14 h-14'
          : props.size === 'md'
            ? 'w-32 h-16'
            : props.size === 'lg'
              ? 'w-48 h-24'
              : props.size === 'xl'
                ? 'w-64 h-32'
                : props.size || 'w-44 h-full';
  } else {
    sizeClass =
      props.size === 'xs'
        ? 'w-10 h-10'
        : props.size === 'sm'
          ? 'w-14 h-14'
          : props.size === 'md'
            ? 'w-32 h-32'
            : props.size === 'lg'
              ? 'w-48 h-48'
              : props.size === 'xl'
                ? 'w-64 h-64'
                : props.size || 'w-44 h-44';
  }

  // console.log(shapeClass, sizeClass);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const handleEditClick = () => {
    const input = document.getElementById('image');
    input?.click();
    input?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files![0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
        if (props.setImage) {
          props.setImage(reader.result as string);
        }
      };
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      {!props.disabled && (
        <>
          <button
            className="edit-button text-white font-bold py-2 px-4 rounded-full z-10 bg-gray-700 bg-opacity-75 hover:bg-gray-700 opacity-100 transition duration-300 ease-in-out"
            onClick={handleEditClick}
            style={{
              position: 'absolute',
              top: '35%',
              left: '25%',
              zIndex: 1,
            }}
          >
            Edit
          </button>
          <input
            type="file"
            accept="image/*"
            name="image"
            id="image"
            className="hidden"
          />
        </>
      )}
      <img
        src={base64Image || props.src}
        alt="avatar image"
        loading='lazy'
        className={`inline-flex items-center justify-center mr-2 text-white transition-all duration-200 ease-in-out ${shapeClass} ${sizeClass} object-cover max-w-full max-h-full`}
      />
    </div>
  );
};
export default Image;