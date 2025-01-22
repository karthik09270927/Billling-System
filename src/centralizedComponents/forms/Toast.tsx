import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  autoClose?: number;
  hideProgressBar?: boolean;
}

const Toast: React.FC = () => {
  return <ToastContainer />;
};

export const Toasts = ({
  message,
  type,
  position = 'bottom-right',
  autoClose = 3000,
  hideProgressBar = true,
}: ToastProps) => {
  if (type === 'success') {
    toast.success(message, {
      position,
      autoClose,
      hideProgressBar,
    });
  } else if (type === 'error') {
    toast.error(message, {
      position,
      autoClose,
      hideProgressBar,
    });
  }
};

export default Toast;
