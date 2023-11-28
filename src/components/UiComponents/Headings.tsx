const Headings = () => {
  return <div>Headings</div>;
};

export const Title = (props: { children: string; className?: string }) => {
  return (
    <h2
      className={`${props.className} sm:text-3xl text-xl title-font font-bold text-gray-900 my-4`}
    >
      {props?.children}
    </h2>
  );
};
export const SubTitle = (props: {
  children: string | React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={`${props.className} sm:text-2xl text-xl title-font font-semibold text-gray-900 my-2 capitalize `}
    >
      {props?.children}
    </h2>
  );
};

export const SecondaryHeading = (props: {
  children: string;
  className?: string;
  darkColor?: boolean;
}) => {
  return (
    <h2
      className={`${props.className}  text-lg title-font font-semibold ${
        props.darkColor ? ' text-gray-900 ' : ' text-gray-600 '
      } my-2`}
    >
      {props?.children}
    </h2>
  );
};

export const Divider = () => {
  return <span className="h-[2px] border-t-0 bg-neutral-200 w-full block" />;
};

export default Headings;
