import { useState, useEffect } from "react";
import { MDBBtn, MDBCard, MDBCardImage, MDBCardBody, MDBCardText, MDBCardTitle } from 'mdb-react-ui-kit';
import { ethers } from 'ethers';
import { Balance } from "./Balance";
import { myNFTAddress } from "./MyNFTAddress";
import { stakeViewer } from "../helpers/stakeHelper";



export const Home = (props) => {
    
    const [staker, setStaker] = useState('');

    const MyNFTContractAddress =  myNFTAddress();
    
    const account = props.account;
    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi;

    const [dripSentToVault, setDripSentToVault] = useState(props.dripSentToVault);
    const [nftCollection, setNFTCollection] = useState([])
    
    const getNFTs = async () => {
        const data = await fetch('http://localhost:8080/api/add-file');
        const jsonData = await data.json();
        
        setNFTCollection(jsonData);
        console.log(jsonData);
    }
    
    // console.log(dripSentToVault);
    // console.log(props);
    // console.log(Children)

    if(window.ethereum !== undefined) {
        // console.log('window detected');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(MyNFTContractAddress, abi, provider);

    }

    

    useState( async () => {
        const stake = await stakeViewer();
        setStaker(stake)
        console.log(props)
    }, [])

    useEffect(() => {
        getNFTs();
    }, [])


    return (
        <div>
            <h2>Welcome to My-NFT</h2>
            <h3>Your connected account is</h3>
            <p>{account}</p>
            <Balance account={account}/>
            <div className='fountain-stake'>
                <h4>Drops Locked in Fountain: {staker}</h4>
            </div>
            <div className='faucet-vault'>
                <h4>Sent to Drip Faucet Vault: {dripSentToVault}</h4>
            </div>
            <div className='display-container'>
                
                    {nftCollection.length > 1 ? 
                        
                        <div className='cards'>
                            {nftCollection.map((nfts) =>
                                <div key={nfts.finalHash}>
                                <MDBCard style={{width: '18rem', maxWidth:'18rem', padding: '10px', margin: '10px', backgroundColor: '#2D7595'}}>
                                    <MDBCardImage style={{height: '180px'}} src={nfts.meta.image} alt='...' position='top'/>
                                    <MDBCardBody>
                                        <MDBCardTitle>{nfts.meta.name}</MDBCardTitle>
                                        <MDBCardText>{nfts.meta.description}</MDBCardText>
                                        <MDBCardText>Minter: {nfts.meta.attributes[1].value}</MDBCardText>
                                        <div className='card-buttons'>
                                            <MDBBtn tag='a' href={nfts.finalHash} target='__blank'>IPFS JSON File</MDBBtn>
                                            <br />
                                            <MDBBtn tag='a' href={nfts.meta.image} target='__blank'>IPFS Image Hash</MDBBtn>
                                        </div>
                                    </MDBCardBody>
                                </MDBCard>
                                </div>
                            )}
                        </div>
                        
                    :
                        <div> Sorry. no nfts found ...</div>
                    }
                
            </div>
        </div>
    )
}