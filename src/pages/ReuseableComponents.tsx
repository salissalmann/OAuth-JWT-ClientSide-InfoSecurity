import { useState } from 'react';
import { schools } from '../Data/data';
import Badge from '../components/UiComponents/Badges';
import { ButtonFill, ButtonOutlined } from '../components/UiComponents/Button';
import CardsContainer from '../components/UiComponents/CardsContainer';
import CustomSearchDropdown from '../components/UiComponents/CustomSearchDropdown';
import Drawer from '../components/UiComponents/Drawer';
import FileImplementation from '../components/UiComponents/FileImplementation';
import { Form } from '../components/UiComponents/Forms';
import { SubTitle } from '../components/UiComponents/Headings';
import { CopyIcon } from '../components/UiComponents/Icons';
import Image from '../components/UiComponents/Image';
import Table from '../components/UiComponents/Table';
import Tabs from '../components/UiComponents/Tabs';
import ToastComponent from '../components/UiComponents/ToastComponent';
import Banner from './../components/UiComponents/Banner';

const ReuseableComponents = () => {
  const src =
    'https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-tailwind/img/team-1.jpg';

  const getDropDownValue = (val: string) => {
    console.log('Custom Drop Down Value: ', val);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full pb-20">
      <Banner
        category="CATEGORY"
        heading="Banner Heading here."
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum doloremque repellendus officia id recusandae, odit saepe quos! Autem, dolor! Temporibus!"
        link="/link-to-learn-more"
      />
      <button
        className="bg-green-600 text-white rounded px-4 py-1"
        onClick={() => setIsOpen(true)}
      >
        open
      </button>

      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} title="Create New Deck">
        <SubTitle>Heading Here</SubTitle>
        <p className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere error
          quae odio reprehenderit libero fugiat quasi assumenda odit esse est
          modi laboriosam, vel deserunt illo impedit eligendi nihil aut
          corrupti? Est accusantium reiciendis ducimus debitis. Illum ut ipsum
          sapiente? Deserunt?
        </p>
      </Drawer>

      <CustomSearchDropdown
        options={schools}
        getDropDownValue={getDropDownValue}
        placeholder="Enter School Name"
        width="w-full max-w-lg"
      />

      <CardsContainer />
      <div className="my-7">
        <SubTitle>Badges</SubTitle>
        <div className="flex items-center space-x-5">
          <Badge type="success" label="success" />
          <Badge type="error" label="Something bad happened" />
          <Badge type="warning" label="Danger Ahead" />
          <Badge type="info" label="Fetching Data" />
        </div>
      </div>
      <div className="my-7">
        <SubTitle>Toasts</SubTitle>
        <ToastComponent />
      </div>
      <div className="my-7">
        <SubTitle>Images</SubTitle>
        {/* // Circle image with default size (rounded-full, no custom size) */}
        <Image src={src} shape="circle" size="sm" />
        <Image src={src} shape="circle" size="md" />
        <Image src={src} shape="circle" size="lg" />
        <Image src={src} shape="circle" size="xl" />
        <div className="my-6"></div>
        <Image src={src} shape="square" size="sm" />
        <Image src={src} shape="square" size="md" />
        <Image src={src} shape="square" size="lg" />
        <Image src={src} shape="square" size="xl" />

        <div className="my-6"></div>
        <Image src={src} shape="rectangle" size="sm" />
        <Image src={src} shape="rectangle" size="md" />
        <Image src={src} shape="rectangle" size="lg" />
        <Image src={src} shape="rectangle" size="xl" />
      </div>

      <Form />

      <div className="my-7">
        <SubTitle>Upload File Implementation</SubTitle>
        <FileImplementation />
      </div>
      <div className="my-7">
        <SubTitle>Button Components</SubTitle>
        <div className="flex items-center space-x-5">
          <ButtonFill icon={<CopyIcon />} handleClick={() => {}}>
            Submit
          </ButtonFill>
          <ButtonOutlined icon={<CopyIcon />} handleClick={() => {}} />
          <ButtonFill isLoading={true} handleClick={() => {}}>
            Submit
          </ButtonFill>
          <ButtonOutlined handleClick={() => {}}>Cancel</ButtonOutlined>
          <ButtonOutlined isLoading={true} handleClick={() => {}}>
            Cancel
          </ButtonOutlined>
        </div>
      </div>
      <div className="my-7">
        <SubTitle>Button Components</SubTitle>
        <Tabs />
      </div>
      <div className="my-7">
        <SubTitle>Table Layyout</SubTitle>

        <Table />
      </div>
    </div>
  );
};

export default ReuseableComponents;
