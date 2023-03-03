import {  ethers } from 'ethers';
import { dripABI } from '../abis/dripABI';
import { myNFTAddress } from '../components/MyNFTAddress';
import { Toaster } from './toaster'

export const DripTransfer = async (signer, paymentToggle) => {
    
    const contractAddress = '0x20f663cea80face82acdfa3aae6862d246ce0333';
    const userAccount = signer.getAddress();

    const myNFT =  myNFTAddress();

    console.log(contractAddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const DripContract = new ethers.Contract(contractAddress, dripABI, signer);
    const dripBalance = await DripContract.balanceOf(userAccount);
    
    const formatBalance = parseInt(dripBalance._hex);
    

    const bnbBalance = await provider.getBalance(userAccount);
    const bnbFormatter = ethers.utils.formatUnits(bnbBalance);

    const minimumBNB = ethers.utils.parseUnits('0.05', 'ether')
    
    // ******************************************
    //* logs ************************************
    console.log(minimumBNB);
    console.log(dripBalance);
    console.log(formatBalance);
    console.log('bnb balance: ' + bnbFormatter);

    const balanceMeetsMinimum = (formatBalance >= 10 ? true : false || bnbBalance > minimumBNB ? true : false);
    const dripOrBNB = (paymentToggle ? 'drip' : 'bnb');

    if(!balanceMeetsMinimum) {
        console.log('sorry, you need at least 10 Drip or 0.05 BNB to mint')
        throw new Error('sorry, you need at least 10 Drip to mint or 0.05 BNB')
    }

    console.log(dripOrBNB);
    console.log(ethers.utils.parseUnits('10', 'ether'));
    const dripToTransfer = ethers.utils.parseUnits('10', 'ether');
    console.log(dripToTransfer);

    if(dripOrBNB === 'drip') {
        await DripContract.approve(myNFT, dripToTransfer);
        
        await DripContract.transfer(myNFT, dripToTransfer);
        Toaster('success', 'drip successfully transfered ', '3000');
        return
    } else {
        // await DripContract.approve(contractAddress, minimumBNB);
        const tx = {
            value: minimumBNB._hex,
            nonce: await provider.getTransactionCount(userAccount, 'latest'),
            gasLimit: ethers.utils.hexlify(10000),
            gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
        }

        return tx
        // const transaction = await signe.sendTransaction(tx);

        // console.log(transaction);

        // return transaction
    }

}