import { useState } from "react";
import { ethers } from 'ethers';
import { Balance } from "./Balance";
import { myNFTAddress } from "./MyNFTAddress";


export const Home =  (props) => {

    const {collection, setCollection} = useState([]);
    const MyNFTContractAddress =  myNFTAddress();
    
    const account = props.account;
    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi;

    if(window.ethereum !== undefined) {
        // console.log('window detected');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(MyNFTContractAddress, abi, provider);

        
    }


    return (
        <div>
            <h2>Welcome to My-NFT</h2>
            <h3>Your connected account is</h3>
            <p>{account}</p>
            
            <Balance account={account}/>
           
            
        </div>
    )
}