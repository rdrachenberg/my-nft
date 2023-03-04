import { ethers } from 'ethers';
import { fountainABI } from '../abis/fountainABI';
import { myNFTAddress } from '../components/MyNFTAddress';
import { Toaster } from './toaster';

export const BNBTransferToFountain = async (signer) => {

    const reservoirContract = '0xB486857fac4254A7ffb3B1955EE0C0A2B2ca75AB'
    const resContract = new ethers.Contract(reservoirContract, fountainABI, signer);
    const bnbTest = await ethers.utils.parseUnits('1', 'ether');
    const tx = await resContract.buy({value:bnbTest._hex})

    await tx.wait()
    console.log(tx);
    
    return tx
}