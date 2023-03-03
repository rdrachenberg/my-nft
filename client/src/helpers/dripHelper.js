import {  ethers } from 'ethers';
import { dripABI } from '../abis/dripABI';
import { myNFTAddress } from '../components/MyNFTAddress';
import { Toaster } from './toaster'

export const DripTransfer = async (signer, paymentToggle) => {
    
    const contractAddress = '0x20f663cea80face82acdfa3aae6862d246ce0333';
    const dripTaxVault = '0xbff8a1f9b5165b787a00659216d7313354d25472'
    const userAccount = signer.getAddress();

    const myNFT =  myNFTAddress();
    const myNFTABI = require('../artifacts/contracts/Art.sol/Art.json').abi;

    console.log(contractAddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const DripContract = new ethers.Contract(contractAddress, dripABI, signer);
    let dripBalance = await DripContract.balanceOf(userAccount);
    const Art = new ethers.Contract(myNFT, myNFTABI, signer);
    const mintFee = await Art.mintFee();
    
    const formatBalance = parseInt(dripBalance._hex);
    

    const bnbBalance = await provider.getBalance(userAccount);
    const bnbFormatter = ethers.utils.formatUnits(bnbBalance);

    const minimumBNB = await mintFee;
    
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
        
        const tx = await DripContract.transfer(dripTaxVault, dripToTransfer);
        await tx.wait();
        console.log(tx);

        dripBalance = ethers.utils.formatEther(await DripContract.balanceOf(dripTaxVault), 'ether');
        console.log('drip balance here --- > ', dripBalance)
        Toaster('success', `drip successfully transfered ${dripBalance}`, '3000');
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