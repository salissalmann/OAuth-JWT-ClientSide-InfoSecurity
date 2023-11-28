import { BoltIcon } from './Icons';

const CardsContainer = () => {
  return (
    <section>
      <div className="relative items-center w-full py-10 mx-auto ">
        <div className="grid w-full grid-cols-1 gap-12 mx-auto lg:grid-cols-3">
          {[1, 1, 1, 1, 1, 1].map((i) => {
            return (
              <CustomCard
                key={i}
                title="Title here"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt, nam. Eum, maxime? Inventore non sit provident sequi maxime, quod harum?"
                buttonText="Get Started"
                icon={<BoltIcon color="text-primary" />}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface CustomCardProps {
  key: string | number;
  title: string;
  description: string;
  buttonText: string;
  icon?: React.ReactNode;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  key,
  title,
  description,
  buttonText,
  icon,
}) => {
  return (
    <div className="p-6 shadow-md" key={key}>
      <div className="flex items-center mb-3">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-12 h-12 mr-3 text-primary rounded-full bg-blue-50">
          {icon}
        </div>
        <h1 className="text-xl font-semibold leading-none tracking-tighter text-neutral-600">
          {title}
        </h1>
      </div>
      <p className="mx-auto text-base leading-relaxed text-gray-500">
        {description}
      </p>
      <div className="mt-4">
        <a
          href="#"
          className="inline-flex items-center mt-4 font-semibold text-primary lg:mb-0 hover:text-neutral-600"
          title="read more"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};
export default CardsContainer;
