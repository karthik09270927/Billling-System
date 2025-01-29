import { toast } from 'react-toastify';

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        pauseOnFocusLoss: true,
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        pauseOnFocusLoss: true,
    });
};
