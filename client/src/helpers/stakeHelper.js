import { ethers } from 'ethers';
import { fountainABI } from '../abis/fountainABI';
import { Toaster } from './toaster';


export const stakeViewer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
    
    // Toaster('info', ` Here is the Deployers Address: ${signer.address}`, '2000')
    
    const reservoirContract = '0xB486857fac4254A7ffb3B1955EE0C0A2B2ca75AB'
    const resContract = new ethers.Contract(reservoirContract, fountainABI, signer);
    const stats = await resContract.balanceOf(signer.address);

    console.log(stats)
    const balanceOfStake = ethers.utils.formatEther(stats._hex);
    const fixed = Number(balanceOfStake).toFixed(2)
    console.log(fixed);
    console.log(balanceOfStake)
   

    // Toaster('success', `My NFT Resevior Stake:${balanceOfStake}`, '3000');

    return fixed
}