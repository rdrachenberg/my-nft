import { myNFTAddress } from '../components/MyNFTAddress.js';
import { ethers } from "ethers";


export const withdrawl = async () => {
    const MyNFTContractAddress =  myNFTAddress();
    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const deploySigner = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
    
    const contractDeployed = new ethers.Contract(MyNFTContractAddress, abi, deploySigner);
    let nonce = await provider.getTransactionCount(deploySigner.address, 'latest');
    nonce++;

    console.log('nonce here', nonce);

    const withdrawToWallet = await contractDeployed.ownerWithdrawToFountain({nonce: nonce});
    withdrawToWallet.wait();
    console.log(withdrawToWallet);

    return withdrawToWallet
}