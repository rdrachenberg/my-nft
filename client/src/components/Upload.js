import React, {useState, useEffect, useRef } from 'react';
import { Buffer } from 'buffer';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { MDBFile, MDBInput, MDBTextArea, MDBBtn, MDBCheckbox, MDBCard, MDBCardImage, MDBCardBody, MDBCardText, MDBCardTitle, MDBListGroupItem, MDBListGroup } from 'mdb-react-ui-kit';
import { InputChecks } from '../helpers/inputTestChecks';
import { MyMint } from '../components/Mint'
import { ToggleSwitch } from './ToggleSwitch';

//* ************************************************************************************************
//* Infura *****************************************************************************************
//* ************************************************************************************************
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID; // Infura id
const projectSecretKey = process.env.REACT_APP_INFURA_PROJECT_SECRET; // Infura key
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecretKey).toString('base64'); // Infura required basic auth format to be passed in headers

let options;

//* ************************************************************************************************
//* functional component to upload file, name, and description to ipfs ****************************
//* ************************************************************************************************
export const Upload = (props) => {
    //* State variables 
    //* ********************************************************************************************
    const [uploaded, setUploaded] = useState([]);
    const [paymentToggle, setPaymentToggle] = useState(false);
    
    const nameInput = useRef();
    const [nameTester, setNameTester] = useState('');
    
    const descriptionInput = useRef();
    const [descriptionTester, setDescriptionTeter] = useState('');
    
    const [fileTester, setFileTester] = useState('');
    const account = props.address; // console.log(account, 'account here');
    const setDripSentToVault = props.setDripSentToVault;
    // console.log(setDripSentToVault);
    const dripSentToVault = props.dripSentToVault;
    // console.log(props)
    // console.log(dripSentToVault);
    // const [dripSentToVault, setDripSentToVault] = props;
    let addDripSentToValut = dripSentToVault;
    
    const onChangeToggle = (checked) => {
        setPaymentToggle(checked)
        // console.log(paymentToggle);
    }

    const isNotEmpty = (e) => {
        return nameTester.length & descriptionTester.length & fileTester.length

    }
    //* Create IPFS instance 
    //* ********************************************************************************************
    const ipfs = ipfsHttpClient({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        }
    })

    //* function onSubmitHandler handles the user input feilds and validates them. Then the image file is uploaded to IPFS. After hash, final JSON is constructed and hashed one more time for final hash containing all IPFS hashes with image hash.
    //* ********************************************************************************************
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        // set inputs to state variables
        const form = e.target; // console.log(form);
        const files = form[3].files; // console.log(files);
        const fileTestName = files[0].name; 
        

        let fileFormatName = fileTestName.split('.')[1];
        fileFormatName = '.' + fileFormatName;
        console.log(fileFormatName)
        console.log(fileTestName);
        
        // set refrences to form values 
        nameInput.current = form[1].value; // console.log(nameInput.current);
        descriptionInput.current = form[2].value; // console.log(descriptionInput.current);

        // function checks input values and runs REGEX test. See import
        InputChecks(nameInput.current, descriptionInput.current, fileTestName)
        
        // Set image file 
        const file = files[0];

        // get the image file hash from ipfs. To be used in final hash. 
        const result = await ipfs.add(file, {pin: true}); // console.log(result);
        
        // create constant equal to the hash, which is result.path
        const imageCID = result.path; // console.log(imageCID);

        // construct a options object with the body having the relevant final JSON
        options = {
            method: 'POST',
            body: JSON.stringify({
                name: nameInput.current,
                description: descriptionInput.current,
                image: `http://gateway.ipfs.io/ipfs/${imageCID}`,
                external_url: `https://my-nft.com SITE HERE`,
                attributes: [
                    {
                        "display_type": "date",
                        "trait_type": "nft-birthday",
                        "value": Date.now().toString()
                    },
                    {   "trait_type": "OG Minter",
                        "value": account
                    }
                ]
            })
        }

        // format for varialbe cleanup
        const body = options.body;

        // create a final hash that will hold all JSON data
        const finalJSONHash = await ipfs.add(body, {pin: true}); // console.log(finalJSONHash);
        
        
        const sendToChain = await MyMint(`http://gateway.ipfs.io/ipfs/${finalJSONHash.path}`, paymentToggle, setDripSentToVault, dripSentToVault);
        
        console.log(sendToChain);
        
        
        addDripSentToValut = (sendToChain[1] === null ? 0 : sendToChain[1]);
        
        console.log(addDripSentToValut);
        // setDripSentToVault(addDripSentToValut => addDripSentToValut + sendToChain[1]);

        setUploaded([
            ...uploaded, {
                cid: result.cid,
                path: result.path,
                meta: JSON.parse(body),
                finalHash: `http://gateway.ipfs.io/ipfs/${finalJSONHash.path}`,
                chainHash: sendToChain[0].transactionHash
            }
        ]);
        let optionsSecond = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                meta: JSON.parse(body),
                finalHash: `http://gateway.ipfs.io/ipfs/${finalJSONHash.path}`,
                chainHash: sendToChain[0].transactionHash,
                drip: addDripSentToValut
            })
        }
        // set array to hold data. Will be used to send to the server for account nft mint data
        // const finalResult = await fetch('http://localhost:8080/add-file', options);
        // console.log(finalResult);
        const sendToBackend = await fetch('http://localhost:8080/api/add-file', optionsSecond);
            console.log(optionsSecond.body)
            await sendToBackend();

        // TODO create post request to server to record minting results

        // console.log(uploaded);  //! comment out on production 

        form.reset();
    }

    useEffect(() => {
        if(uploaded.length > 0) {
            console.log(uploaded);
        }
        
        if(addDripSentToValut !== 0 && options !== {}) {
            setDripSentToVault(addDripSentToValut => addDripSentToValut);
            console.log('this hit here', dripSentToVault);
            
        }
        
            
        
    }, [setDripSentToVault, addDripSentToValut, uploaded, dripSentToVault])
    
    return (
        <div>
            {uploaded.length > 0 ? 
                <div className='collection'>
                    <h2>Collection</h2>
                </div>
            : 
                <>
                    <h3 id='mint-input'>Mint</h3>
                </>
            }
            <div className='container'>  
                <div>
                    {uploaded.length > 0 ?
                        <div>
                            <div className='cards'>
                                {uploaded.map((upload) => 
                                    <div  key={upload.finalHash}>
                                        <MDBCard style={{width: '18rem', maxWidth:'18rem', padding: '10px', margin: '10px', backgroundColor: '#2D7595'}}>
                                            <MDBCardImage style={{height: '180px'}} src={upload.meta.image} alt='...' position='top'/>
                                            <MDBCardBody>
                                                <MDBCardTitle>{upload.meta.name}</MDBCardTitle>
                                                <MDBCardText>{upload.meta.description}</MDBCardText>
                                                <MDBCardText>Minter: {upload.meta.attributes[1].value}</MDBCardText>
                                                <div className='card-buttons'>
                                                    <MDBBtn tag='a' href={upload.finalHash} target='__blank'>IPFS JSON File</MDBBtn>
                                                    <br />
                                                    <MDBBtn tag='a' href={upload.meta.image} target='__blank'>IPFS Image Hash</MDBBtn>
                                                </div>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </div>
                                )}
                            </div>
                            
                        </div>
                    :
                        <form onSubmit={onSubmitHandler} className={'form'}>
                            <ToggleSwitch id='payment' checked={paymentToggle} setChecked={setPaymentToggle} onChange={onChangeToggle}/>
                            <MDBInput id='name' wrapperClass='mb-4' label='Name' onChange={e => setNameTester(e.target.value)} value={nameTester} required />
                            <MDBTextArea wrapperClass='mb-4' id='description' rows={4} label='Description' onChange={e => setDescriptionTeter(e.target.value)} value={descriptionTester} required />
                            <MDBFile id='file-upload' type='file' name='file' htmlFor='file-upload' onChange={e => setFileTester(e.target.value)} value={fileTester} required/>
                            <MDBBtn type='submit' className='mb-4' checked={paymentToggle} color={paymentToggle? 'secondary': 'primary'} disabled={!isNotEmpty()} block>{paymentToggle ? 'Approve' : 'Upload your NFT'}</MDBBtn>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}


    // const ipfs = ipfsHttpClient({
        // headers: {
        //     "Access-Control-Allow-Origin": "*"},
    //     host: 'localhost',
    //     port: 8080,
    //     protocol: 'http',
    
    // });

            // console.log(options)

        // const result = fetch('http://localhost:8080/add-file', options)
        // await result.then((response) => {
        //     console.log(response)
            
        // })
        
        // console.log(await result)

// construct string with public gateway adding our image hash
// setImage(`http://gateway.ipfs.io/ipfs/${imageCID}`);
// set descriptions state 
// setDescriptions(descriptionInput.current);


//* ********************************************************************************************
//? DONE - WRITE REGEX TO CHECK FOR IMAGE FILES ONLY 
//? DONE - WRITE REGEX TO LIMIT STRING LENGTHS ON NAME INPUT & DESCRIPTION
//* ********************************************************************************************