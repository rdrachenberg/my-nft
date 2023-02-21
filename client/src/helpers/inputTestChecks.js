import { FileHelper } from './fileHelper';
import { NameTester } from './nameLimiter';
import { DescriptionTester } from './descriptionLimiter';
import { Toaster } from './toaster';

export function InputChecks(name, description, files) {
    // REGEX file extention name test
    let fileTest = FileHelper(files); // console.log(fileTest);

    // REGEX test to make sure the name is not under 1 & over 20 character limits 
    let nameTest = NameTester(name);

    // REGEX test to make sure the name is not under 1 & over 280 character limits 
    let descriptionTest = DescriptionTester(description);

    // check to make sure there is a file attached 
    if(!files || files.length === 0) {
        Toaster('no files selected', 1000);
        return;
    }
    
    // check to make sure file is in a image file. Should return true
    if(fileTest) {
        console.log('** File passed test!!');
        Toaster('success', 'File inspection passed test...');
    
    } else {
        Toaster('fail','Not a valid file format.', {position: 'top-left'});
        Toaster('info','Please use jpg, jpeg, png, or gif formats.', {position: 'top-left'});
        return;
    }

    // check to make sure name is more than an empty string
    if(name === '') {
        Toaster('fail','You must name your NFT', 1000);
        return;
    }

    // check name REGEX test. Should be less than 20 characters
    if(nameTest) {
        console.log('** Name Test passed!');
        Toaster('success', 'Name passed test', 1000);
    
    } else {
        Toaster('info','Sorry, you must submit 1-20 characters', {position: 'top-left'});
        return;
    }
    
    // check to make sure the description is more than an empty string
    if(description === '') {
        Toaster('info', 'You must include a description');
        return 
    }

    // check description REGEX test. Should be less than 280 characters
    if(descriptionTest) {
        console.log('** Description Test Passed!');
        Toaster('success', 'Description test passed', 2000)

    } else {
        Toaster('fail', 'Sorry, you have exceeded the character limit of 280 characters');
        return;
    }
}