import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface GlobalToastProviderProps {
    isDarkMode: boolean;
  }

const GlobalToastProvider: React.FC<GlobalToastProviderProps> = ({ isDarkMode }) => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? "dark" : "light"}
      toastClassName="custom-toast"
    />
  );
};

export default GlobalToastProvider;
