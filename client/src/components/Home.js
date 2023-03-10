import { Children, useState } from "react";
import { ethers } from 'ethers';
import { Balance } from "./Balance";
import { myNFTAddress } from "./MyNFTAddress";
import { stakeViewer } from "../helpers/stakeHelper";


export const Home = (props) => {
    
    const [staker, setStaker] = useState('');
    const MyNFTContractAddress =  myNFTAddress();
    
    const account = props.account;
    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi;

    const dripSentToVault = props.dripSentToVault;
    console.log(dripSentToVault);
    console.log(props);
    console.log(Children)

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
           
            
        </div>
    )
}