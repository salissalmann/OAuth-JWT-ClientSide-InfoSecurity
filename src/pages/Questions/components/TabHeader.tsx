const TabHeader = ({
  tabOptions,
  activeTab,
  setActiveTab,
  setActiveTabIndex,
  disabled = false,
}: {
  tabOptions: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
}) => {
  return (
    <section className="">
      <div className="container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="w-full ">
              <div className="flex flex-wrap rounded-lg border border-[#E4E4E4] py-3 px-4 space-x-2">
                {tabOptions &&
                  tabOptions.length > 0 &&
                  tabOptions.map((opt, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (!disabled) {
                            setActiveTab(opt);
                            setActiveTabIndex(index);
                          }
                        }}
                        className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-primary-500 hover:text-white  transition-all delay-75 cursor-pointer ${
                          activeTab === opt ? 'bg-primary text-white' : ' '
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabHeader;
