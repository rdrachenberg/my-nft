import {ToastContainer, toast} from 'react-toastify';

export const Toaster = (toastType, message, delay) => {

    switch (toastType) {
        case 'success': 
            toast.success(message, {delay: delay});
            break;
        case 'info':
            toast.info(message, {delay: delay});
            break;
        case 'fail':
            toast.error(message);
            break;
        default: 
            break;
    }
    //* Create toast alert handlers 
    //* ********************************************************************************************
    const showAlertSuccess = (message, delay) => {
        toast.success(message, {delay: delay});
    }
    
    const showAlertFail = (message) => {
        toast.error(message);
    }
    
    const showAlertInfo = (message, delay) => {
        toast.info(message, {delay: delay});
    }
}