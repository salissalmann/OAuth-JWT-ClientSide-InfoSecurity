import { useState, useEffect } from "react";
import { CreateModal, DeleteModal, ViewModal, UpdateModal } from "./Modals";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  EyeIcon,
  SearchIcon,
  SettingDotsIcon,
} from "./Icons";
import { ButtonOutlined } from "./Button";
import DropDown from "./DropDown";
import Badge from "./Badges";
import Switcher from "./Switcher";
import { dummyProducts } from "../../Data/data";

const modalTypes = {
  view: "view",
  add: "add",
  delete: "delete",
  update: "update",
};
const Table = () => {
  const [viewCrudOptions, setViewCrudOptions] = useState(false);
  const [activeRow, setActiveRow] = useState(-1);
  const [modal, setModal] = useState("");
  const [products, setProducts] = useState(dummyProducts);
  useEffect(() => {
    setProducts(dummyProducts);
  }, []);

  // FIleration Purpose
  const [searchQuery, setSearchQuery] = useState("");
  const [selectBrand, setSelectBrand] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // 🔰 Note: You will have to make seperate functions in order to get each dropdown value
  //   const getDropDownValue = (selectedValue: string | number) => {
  //     console.log("Selected Value:", selectedValue);
  //   };

  const handleSettingClick = (id: number) => {
    setViewCrudOptions((prev) => !prev);
    setActiveRow(id);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      !selectBrand || selectBrand === "All" || product.brand === selectBrand;
      
    const matchesCategory =
      !selectCategory ||
      selectCategory === "All" ||
      product.category === selectCategory;

    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "All" ||
      product.status === selectedStatus;

    return matchesSearch && matchesBrand && matchesStatus && matchesCategory;
  });

  function getDistinctValues<T>(array: T[], property: keyof T): string[] {
    const valuesSet = new Set(array.map((item) => item[property] as string));
    return [...valuesSet];
  }

  const distinctBrands: string[] = getDistinctValues(products, "brand");
  const distinctCategories: string[] = getDistinctValues(products, "category");
  const distinctStatus: string[] = getDistinctValues(products, "status");

  return (
    <>
      {/* Start block */}
      <section className=" antialiased my-10">
        <div className="mx-auto ">
          <div className="bg-white  relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <SearchIcon color="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                      placeholder="Search"
                      required={true}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <ButtonOutlined icon={<AddIcon />} handleClick={() => {}}>
                  Add product
                </ButtonOutlined>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4">
              <DropDown
                label="Brand"
                options={distinctBrands}
                onSelect={(selectedValue) =>
                  setSelectBrand(String(selectedValue))
                }
                all={true}
                width="min-w-[12rem]"
              />
              <DropDown
                label="Category"
                options={distinctCategories}
                onSelect={(selectedValue) =>
                  setSelectCategory(String(selectedValue))
                }
                all={true}
                width="min-w-[12rem]"
              />
              <DropDown
                label="Status"
                options={distinctStatus}
                all={true}
                onSelect={(selectedValue) =>
                  setSelectedStatus(String(selectedValue))
                }
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 mb-20">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-4 py-4">
                      Product name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Brand
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      isPublished
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Delete
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr className="border-b" key={product.id}>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {product.productName}
                      </th>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">{product.brand}</td>
                      <td className="px-4 py-3 max-w-[12rem] truncate">
                        {product.description}
                      </td>
                      <td className="px-4 py-3">{product.price}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          type={
                            product.status === "Active" ? "success" : "error"
                          }
                          label={product.status}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="mx-auto w-fit">
                          <Switcher
                            for={`${product.id}`}
                            size="small"
                            isActive={product.isPublished}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none mx-auto w-fit"
                          type="button"
                          onClick={() => {}}
                        >
                          <DeleteIcon size="w-6 h-6" />
                        </button>
                      </td>

                      <td className="px-4 py-3 flex items-center justify-center relative">
                        <button
                          id={`${product.productName}-dropdown-button`}
                          data-dropdown-toggle={`${product.productName}-dropdown`}
                          className="inline-flex items-center text-sm font-medium hover:bg-gray-100  p-1.5  text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none "
                          type="button"
                          onClick={() => handleSettingClick(product.id)}
                        >
                          <SettingDotsIcon />
                        </button>
                        <div
                          id={`${product.productName}-dropdown`}
                          className={`${
                            viewCrudOptions && activeRow === product.id
                              ? ""
                              : "hidden"
                          }  w-44 bg-white rounded divide-y divide-gray-100 shadow absolute top-0 right-0 z-[100]`}
                        >
                          <ul
                            className="py-1 text-sm"
                            aria-labelledby={`${product.productName}-dropdown-button`}
                          >
                            {/* Edit Button */}
                            <li>
                              <button
                                type="button"
                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                onClick={() => setModal(modalTypes.update)}
                              >
                                <EditIcon />
                                <span>Edit</span>
                              </button>
                            </li>
                            {/* Preview Button */}
                            <li>
                              <button
                                type="button"
                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-gray-700 space-x-2"
                                onClick={() => setModal(modalTypes.view)}
                              >
                                <EyeIcon />
                                <span> Preview</span>
                              </button>
                            </li>

                            <li>
                              <button
                                type="button"
                                className="flex w-full items-center py-2 px-4 hover:bg-gray-100  text-red-500 "
                                onClick={() => setViewCrudOptions(false)}
                              >
                                <span>Close</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500 space-x-2">
                <span> Showing</span>
                <span className="font-semibold text-gray-900 ">1-10</span>
                <span> of</span>
                <span className="font-semibold text-gray-900">1000</span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
                  >
                    1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  >
                    2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-current="page"
                    className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 "
                  >
                    3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
                  >
                    ...
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
                  >
                    100
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* End block */}

      {/* Update modal */}

      {modal === modalTypes.update && (
        <UpdateModal active={true} onCancel={() => {}} onConfirm={() => {}} />
      )}
      {/* Create modal */}
      {modal === modalTypes.add && (
        <CreateModal active={true} onCancel={() => {}} onConfirm={() => {}} />
      )}

      {/* Read modal */}
      {modal === modalTypes.view && (
        <ViewModal active={true} onCancel={() => {}} onConfirm={() => {}} />
      )}
      {/* Delete modal */}
      {modal === modalTypes.delete && (
        <DeleteModal active={true} onCancel={() => {}} onConfirm={() => {}} />
      )}
    </>
  );
};

export default Table;
