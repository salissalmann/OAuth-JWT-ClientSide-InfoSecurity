interface TabProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  tabList: string[]
}
const Tabs = ({ currentTab, tabList, setCurrentTab }: TabProps) => {

  return (
    <>
      <section className="py-2 ">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="w-full">
                <div className="flex flex-wrap rounded-lg border border-[#E4E4E4] py-3 px-4 space-x-2">
                  {tabList.map((tab, index) => (
                    <a
                      key={index}
                      onClick={() => setCurrentTab(tab)}
                      className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-primary-500   transition-all delay-75 cursor-pointer ${currentTab === tab ? 'bg-primary text-white' : ' '
                        }`}
                    >
                      {tab}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tabs;
