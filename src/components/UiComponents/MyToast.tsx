import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (
  text: string,
  type: "success" | "error" | "warning" | "info",
  icon?: React.ReactNode
) => {
  const toastId = toast[type](text);
  if (toastId) {
    toast.update(toastId, { icon });
  }
};

const MyToast = () => {
  return <ToastContainer autoClose={3000} />;
};

export default MyToast;
