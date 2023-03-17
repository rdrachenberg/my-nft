import { ethers } from 'ethers';
import { fountainABI } from '../abis/fountainABI';
import { Toaster } from './toaster';

export const BNBTransferToFountain = async (amount) => {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
    
    // Toaster('info', ` Here is the Deployers Address: ${signer.address}`, '2000')
    
    const reservoirContract = '0xB486857fac4254A7ffb3B1955EE0C0A2B2ca75AB'
    const resContract = new ethers.Contract(reservoirContract, fountainABI, signer);
    const bnbTest =  ethers.utils.parseUnits(amount, 'ether');
    
    
    const tx = await resContract.buy({
        value:bnbTest._hex,
    })

    let receipt = await tx.wait();
    console.log('here is the tx receipt for the resevior stake ', receipt);

    // const stats = await resContract.statsOf(signer.address);

    // console.log('user stats here -> ' , stats)
    // Toaster('success', `Stats, ${stats}`)

    Toaster('success', `💰Transfered ${amount}BNB to fountain`, '2000');
    return tx
}