export const DescriptionTester = (nameStr) => {

    let regex = new RegExp(/^[\w\W]{1,280}$/)

    if(nameStr === null) {
        return false;
    }

    if(regex.test(nameStr) === true) {
        return true;
    
    } else {
        return false
    }

}