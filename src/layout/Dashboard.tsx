import { useState } from "react";
import apiClient from "../services/api/apiClient";
interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const getCookie = (name: string) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };
  
  const Logout = async () => {
    window.location.href = "/login";
    const RefreshToken =  getCookie("refreshToken");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    const response = await apiClient.get(`/api/auth/logout/${RefreshToken}`);    
    //Remove all cookies
  };


  return (
    <div className="">
      <aside
        className={`fixed top-0 z-[200] ${
          isSideBarOpen
            ? "ml-0  md:w-4/12  lg:w-[25%] xl:w-[20%] 2xl:w-[15%] "
            : "ml-[-100%] "
        } flex h-screen w-full flex-col justify-between border-r bg-white px-6 pb-3 transition duration-300`}
      >

        <div className="-mx-6 flex items-center justify-between border-t px-6 pt-4 ">
          <button className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600 " 
          onClick={Logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="group-hover:text-gray-700 ">Logout</span>
          </button>
        </div>
      </aside>
      <div
        className={`${
          isSideBarOpen ? " lg:w-[75%] xl:w-[80%] 2xl:w-[85%] " : "w-full"
        } ml-auto mb-6 `}
      >
        <div className="sticky z-[200] top-0 h-16 border-b bg-white flex">
          <div className="flex items-center justify-between space-x-4 px-6 my-auto w-full">
            <button
              className="-mr-2 h-16 w-12 border-r  "
              onClick={() => setIsSideBarOpen((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="my-auto h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex space-x-4">
              {/* <!--search bar --> */}
              <div hidden className="md:block">
                <div className="relative flex items-center text-gray-400 focus-within:text-cyan-400">
                  <span className="absolute left-4 flex h-6 items-center border-r border-gray-300 pr-3">
                    <svg
                      xmlns="http://ww50w3.org/2000/svg"
                      className="w-4 fill-current"
                      viewBox="0 0 35.997 36.004"
                    >
                      <path
                        id="Icon_awesome-search"
                        data-name="search"
                        d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"
                      ></path>
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="leadingIcon"
                    id="leadingIcon"
                    placeholder="Search here"
                    className="outline-none w-full rounded-xl border border-gray-300 py-2.5 pl-14 pr-4 text-sm text-gray-600 transition focus:border-cyan-300 "
                  />
                </div>
              </div>
              {/* <!--/search bar --> */}
              <button
                aria-label="search"
                className="h-10 w-10 rounded-xl border bg-gray-100 active:bg-gray-200 md:hidden "
              >
                <svg
                  xmlns="http://ww50w3.org/2000/svg"
                  className="mx-auto w-4 fill-current text-gray-600 "
                  viewBox="0 0 35.997 36.004"
                >
                  <path
                    id="Icon_awesome-search"
                    data-name="search"
                    d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"
                  ></path>
                </svg>
              </button>
              <button
                aria-label="chat"
                className="h-10 w-10 rounded-xl border bg-gray-100 active:bg-gray-200 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-auto h-5 w-5 text-gray-600 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </button>
              <button
                aria-label="notification"
                className="h-10 w-10 rounded-xl border bg-gray-100 active:bg-gray-200 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-auto h-5 w-5 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 pt-6 2xl:container mx-auto">
          <div className="flex h-[80vh] items-start justify-start">
            {props?.children ? (
              props.children
            ) : (
              <span className="">Content</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
