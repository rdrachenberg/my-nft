import { useState, useEffect } from "react";
import { MDBBtn, MDBCard, MDBCardImage, MDBCardBody, MDBCardText, MDBCardTitle } from 'mdb-react-ui-kit';
import { ethers } from 'ethers';
import { Balance } from "./Balance";
import { myNFTAddress } from "./MyNFTAddress";
import { stakeViewer } from "../helpers/stakeHelper";
import { bnbStakeViewer } from "../helpers/bnbStakeHelper";



export const Home = (props) => {
    
    const [staker, setStaker] = useState('');
    const [bnbStaker, setBNBStaker] = useState('');

    const MyNFTContractAddress =  myNFTAddress();
    
    const account = props.account;
    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi;

    const [dripSentToVault, setDripSentToVault] = useState(0);
    const [nftCollection, setNFTCollection] = useState([])
    
    const getNFTs = async () => {
        const data = await fetch('http://localhost:8080/api/add-file');
        const jsonData = await data.json();
        
        setNFTCollection(jsonData);
        let drip = await addDrip(jsonData);
        console.log(drip);
        setDripSentToVault(drip);
        console.log(jsonData);
    }

    const addDrip = async (data) => {
            console.log(data)
            let temp = [];

            for(let i = 0; i < data.length; i++) {
                let balance = data[i].drip;
                
                if(balance === undefined || balance === null) {
                    balance = 0;
                }
                // console.log(balance);
                temp.push(balance);
            }

            let finalSum = await temp.reduce((a1, a2) => {
                return a1 + a2
            })
            
            // console.log(finalSum);
            temp = []; // cleanup
            return finalSum

        
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
        
    }, [])
    
    useState( async () => {
        const bnbStake = await bnbStakeViewer();
        setBNBStaker(bnbStake)
        
    }, [])

    useEffect(() => {
        getNFTs();
    }, [])


    return (
        <div>
            <h2>Welcome to My-NFT</h2>
            <Balance account={account}/>
            <div className='balance'>
                <h4>BNB Locked in Reservoir: {bnbStaker}</h4>
            </div>
            <div className='fountain-stake'>
                <h4>Drops Locked in Reservoir: {staker}</h4>
            </div>
            <div className='faucet-vault'>
                <h4>Drip Sent to Faucet Vault: {dripSentToVault}</h4>
            </div>
            <div className='display-container'>
                {nftCollection.length > 0 ? 
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
                    <div className='containter-none'>
                        <div> You dont have any nfts yet. ...</div>
                        <MDBCardImage style={{height: '330px'}} src='/duck.jpg' alt='...' position='top'/>
                        <MDBBtn id='minter-none' tag='a' href='/upload'>Mint One Here</MDBBtn> 
                    </div>
                }
            </div>
        </div>
    )
}