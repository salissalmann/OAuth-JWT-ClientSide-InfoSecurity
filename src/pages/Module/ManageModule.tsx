import { useEffect, useState } from "react";
import { DropDown } from "../../components/UiComponents";
import MyToast from "../../components/UiComponents/MyToast";
import TableTop from "./Components/ModuleHeader";
import TableView from "./Components/ModulesViewer";
import { useFetchAllModules } from "../../services/query";
import IModule from "./Components/Module.interface";

const ManageModule = () => {
  const { data, isLoading } = useFetchAllModules();
  const [module, setModule] = useState<IModule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectStatus, setSelectStatus] = useState("All");

  useEffect(() => {
    if (data && !isLoading) {
      setModule(data.body.modules);
    }
  }, [data]);

  const updateFilteredData = () => {
    if (!data) return;
    const NewData = data.body.modules.filter((module: IModule) => {
      if (!module.moduleName || !module.moduleDescription)
        return false;

      const matchesSearch =
        module.moduleName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        module.moduleDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setModule(NewData);
  };

  useEffect(updateFilteredData, [searchQuery, data]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setModule(data.body.modules);
      return;
    }
  };

  useEffect(() => {
    if (selectStatus === "Active" && data) {
      const filteredModules = data.body.modules.filter(
        (module: IModule) => {
          return module.isActive;
        }
      );
      setModule(filteredModules);
    } else if (selectStatus === "InActive" && data) {
      const filteredModules = data.body.modules.filter(
        (module: IModule) => {
          return !module.isActive;
        }
      );
      setModule(filteredModules);
    } else if (data) {
      setModule(data.body.modules);
    }
  }, [selectStatus]);

  const handleSelectStatusChange = (selectedStatus: string) => {
    setSelectStatus(selectedStatus);
  };

  return (
    <>
      <div className="w-full pb-20">
        <MyToast />
        <div className="flex items-center justify-between pb-1 mt-5">
          <h2 className="text-lg font-bold text-gray-900">Module</h2>
        </div>
        <section className="my-5 antialiased">
          <div className="mx-auto">
            <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
              <TableTop
                searchQuery={searchQuery}
                handleSearchQueryChange={handleSearchQueryChange}
                setModule={setModule}
              />
              <div className="flex items-center p-4 space-x-3">
                <DropDown
                  label="Active Status"
                  options={["All", "Active", "InActive"]}
                  onSelect={(selectedStatus: string | number) =>
                    handleSelectStatusChange(selectedStatus.toString())
                  }
                  width="min-w-[12rem]"
                  value={selectStatus}
                />
              </div>

              <TableView
                currentModule={module}
                setModule={setModule}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ManageModule;
