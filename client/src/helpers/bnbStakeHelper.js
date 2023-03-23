import { ethers } from 'ethers';
import { fountainABI } from '../abis/fountainABI';



export const bnbStakeViewer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
    
    // Toaster('info', ` Here is the Deployers Address: ${signer.address}`, '2000')
    
    const reservoirContract = '0xB486857fac4254A7ffb3B1955EE0C0A2B2ca75AB'
    const resContract = new ethers.Contract(reservoirContract, fountainABI, signer);
    const stats = await resContract.statsOf(signer.address);

    console.log(stats);
    console.log(parseInt(stats[0]._hex, 16));
    const balanceOfStake = ethers.utils.formatEther(stats[3]._hex);
    const fixed = Number(balanceOfStake).toFixed(2)
    console.log(fixed);
    console.log(balanceOfStake)
   

    // Toaster('success', `My NFT Resevior Stake:${balanceOfStake}`, '3000');

    return fixed
}