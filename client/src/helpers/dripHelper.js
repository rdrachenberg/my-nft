import {useContext, useEffect, useState} from 'react'
import {  ethers } from 'ethers';
import { dripABI } from '../abis/dripABI';
import { myNFTAddress } from '../components/MyNFTAddress';
import { Toaster } from './toaster'




export const DripTransfer = async (signer, paymentToggle, setDripSentToVault, dripSentToVault) => {
    // const dripAccountSent = useContext(DripContext);
    const contractAddress = '0x20f663cea80face82acdfa3aae6862d246ce0333';
    const dripTaxVault = '0xbff8a1f9b5165b787a00659216d7313354d25472'
    const userAccount = await signer.getAddress();
    console.log(userAccount);
    
    const myNFT =  myNFTAddress();
    const myNFTABI = require('../artifacts/contracts/Art.sol/Art.json').abi;

    console.log(contractAddress);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const DripContract = new ethers.Contract(contractAddress, dripABI, signer);
    let dripBalance = await DripContract.balanceOf(userAccount);
    const Art = new ethers.Contract(myNFT, myNFTABI, signer);
    const mintFee = await Art.mintFee();
    // const signee = await signer2
    // console.log(signee);
    console.log(dripBalance);
    const formatBalance = parseInt(dripBalance._hex);
    

    const bnbBalance = await provider.getBalance(userAccount);
    const bnbFormatter = ethers.utils.formatUnits(bnbBalance);

    const minimumBNB = await mintFee;
    let tx;
    // ******************************************
    //* logs ************************************
    console.log(minimumBNB);
    console.log(dripBalance);
    console.log(formatBalance);
    console.log('bnb balance: ' + bnbFormatter);

    const balanceMeetsMinimum = (formatBalance >= 10 ? true : false || bnbBalance > minimumBNB._hex ? true : false);
    const dripOrBNB = (paymentToggle ? 'drip' : 'bnb');

    if(!balanceMeetsMinimum) {
        console.log('sorry, you need at least 10 Drip or 0.05 BNB to mint')
        throw new Error('sorry, you need at least 10 Drip to mint or 0.05 BNB')
    }

    console.log(dripOrBNB);
    const setDripAmount = '20'
    console.log(ethers.utils.parseUnits(setDripAmount, 'ether'));
    const dripToTransfer = ethers.utils.parseUnits(setDripAmount, 'ether');
    console.log(dripToTransfer);


    if(dripOrBNB === 'drip') {
        const approval = await DripContract.approve(myNFT, dripToTransfer._hex);
        const approvalRreceipt = await approval.wait();
        console.log(approvalRreceipt);

        tx = await DripContract.transfer(dripTaxVault, dripToTransfer._hex);
        let receipt = await tx.wait();
        console.log(receipt);
        
        let dripAmount = Number(setDripAmount);
        
        if(isNaN(dripSentToVault) || dripSentToVault === undefined) {
            dripSentToVault = 0;
        }
        
        console.log(dripAmount);
        console.log(dripSentToVault)
        dripAmount = dripAmount + dripSentToVault;
        console.log(dripAmount);
        
        
        setDripSentToVault(dripSentToVault => dripSentToVault + dripAmount);
        // console.log(setDripSentToVault);
        console.log('vars ==== ', dripSentToVault)
        console.log('drip sent to valut here -->',dripSentToVault);

        dripBalance = ethers.utils.formatEther(await DripContract.balanceOf(dripTaxVault), 'ether');
        console.log('sent here --- > ', dripAmount)
        Toaster('success', `${dripAmount} drip successfully transfered`, '3000');
        
        tx = {
            drip: dripAmount
        }
        

    } else {
        // await DripContract.approve(contractAddress, minimumBNB);
        tx = {
            value: minimumBNB._hex,
            nonce: await provider.getTransactionCount(userAccount, 'latest'),
            gasLimit: ethers.utils.hexlify(10000),
            gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
        }

        
    }
    return tx
}