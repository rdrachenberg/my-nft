import React, {useState, useEffect, useRef } from 'react';
import { Buffer } from 'buffer';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { MDBFile, MDBInput, MDBTextArea, MDBBtn, MDBCheckbox, MDBCard, MDBCardImage, MDBCardBody, MDBCardText, MDBCardTitle, MDBListGroupItem, MDBListGroup } from 'mdb-react-ui-kit';
import { InputChecks } from '../helpers/inputTestChecks';
import { MyMint } from '../components/Mint'

//* ************************************************************************************************
//* Infura *****************************************************************************************
//* ************************************************************************************************
const projectId = process.env.REACT_APP_INFURA_PROJECT_ID; // Infura id
const projectSecretKey = process.env.REACT_APP_INFURA_PROJECT_SECRET; // Infura key
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecretKey).toString('base64'); // Infura required basic auth format to be passed in headers

//* ************************************************************************************************
//* functional component to upload file, name, and description to ipfs ****************************
//* ************************************************************************************************
export const Upload = (props) => {
    //* State variables 
    //* ********************************************************************************************
    const [uploaded, setUploaded] = useState([]);
    const nameInput = useRef();
    const descriptionInput = useRef();
    const account = props.address; // console.log(account, 'account here');
    
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
        const files = form[2].files; // console.log(files);
        const fileTestName = files[0].name; 

        let fileFormatName = fileTestName.split('.')[1];
        fileFormatName = '.' + fileFormatName;
        console.log(fileFormatName)
        console.log(fileTestName);
        
        // set refrences to form values 
        nameInput.current = form[0].value; // console.log(nameInput.current);
        descriptionInput.current = form[1].value; // console.log(descriptionInput.current);

        // function checks input values and runs REGEX test. See import
        InputChecks(nameInput.current, descriptionInput.current, fileTestName)
        
        // Set image file 
        const file = files[0];

        // get the image file hash from ipfs. To be used in final hash. 
        const result = await ipfs.add(file); // console.log(result);
        
        // create constant equal to the hash, which is result.path
        const imageCID = result.path; // console.log(imageCID);

        // construct a options object with the body having the relevant final JSON
        const options = {
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
        const finalJSONHash = await ipfs.add(body); // console.log(finalJSONHash);
        
        
        const sendToChain = await MyMint(`http://gateway.ipfs.io/ipfs/${finalJSONHash.path}`);
        
        console.log(sendToChain);

        
            setUploaded([
                ...uploaded, {
                    cid: result.cid,
                    path: result.path,
                    meta: JSON.parse(body),
                    finalHash: `http://gateway.ipfs.io/ipfs/${finalJSONHash.path}`,
                    chainHash: sendToChain.hash
                }
            ]);
        
        // set array to hold data. Will be used to send to the server for account nft mint data
        

        // const finalResult = await fetch('http://localhost:8080/add-file', options);

        // console.log(finalResult);

        // TODO create post request to server to record minting results

        console.log(uploaded);  //! uncomment on production 

        form.reset();
    }

    useEffect(() => {
        if(uploaded.length > 0) {
            console.log(uploaded);
        }
    })
    
    return (
        <div>
            
            {uploaded.length > 0 ? 
                <div className='collection'>
                            <h2>Collection</h2>
                        </div>
            : 
                <>
                    <h3 id='mint-input'>Mint input</h3>
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
                            <form onSubmit={onSubmitHandler} className={'form'}>    
                                <MDBInput id='name' wrapperClass='mb-4' label='Name' required />
                                <MDBTextArea wrapperClass='mb-4' id='description' rows={4} label='Description' required />
                                <MDBFile id='file-upload' type='file' name='file' htmlFor='file-upload' required/>
                                <MDBBtn type='submit' className='mb-4' block>Upload your NFT</MDBBtn>
                            </form>
                        </div>
                        
                    :
                        <form onSubmit={onSubmitHandler} className={'form'}>    
                            <MDBInput id='name' wrapperClass='mb-4' label='Name' required />
                            <MDBTextArea wrapperClass='mb-4' id='description' rows={4} label='Description' required />
                            <MDBFile id='file-upload' type='file' name='file' htmlFor='file-upload' required/>
                            <MDBBtn type='submit' className='mb-4' block>Upload your NFT</MDBBtn>
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