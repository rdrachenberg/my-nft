export const FileHelper = (file) => {
    let regex = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/);

    if(file === null) {
        return false;
    }

    if(regex.test(file) === true) {
        return true;
    
    } else {
        return false;
    }

}