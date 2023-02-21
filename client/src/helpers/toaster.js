import { toast } from 'react-toastify';

export const Toaster = (toastType, message, delay) => {

    switch (toastType) {
        case 'success': 
            toast.success(message, {delay: delay});
            break;
        case 'info':
            toast.info(message, {delay: delay});
            break;
        case 'fail':
            toast.error(message, {delay: delay});
            break;
        default: 
            break;
    }
}