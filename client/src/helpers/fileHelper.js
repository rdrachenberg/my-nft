export const FileHelper = (file) => {
    let regex = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|gif|heic|JPG|JPEG|PNG|GIF|HEIC)$/);

    if(file === null) {
        return false;
    }

    if(regex.test(file) === true) {
        return true;
    
    } else {
        return false;
    }

}