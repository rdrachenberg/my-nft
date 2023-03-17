import { myNFTAddress } from "./MyNFTAddress";
import { useProvider, useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { DripTransfer } from '../helpers/dripHelper';
import { BNBTransferToFountain } from "../helpers/bnbHelper";
import { Toaster } from '../helpers/toaster.js';
import { dripABI } from "../abis/dripABI";
import { withdrawl } from "../helpers/withdrawHelper";

export async function MyMint(myNFTTokenURI, paymentToggle, setDripSentToVault, dripSentToVault) {
    const MyNFTContractAddress =  myNFTAddress();
    
    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi
    // console.log(setDripSentToVault);
    console.log(dripSentToVault);
    // console.log(abi);
    // console.log(myNFTTokenURI);
    // console.log(MyNFTContractAddress);
    console.log(window.ethereum);
    
    if(typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
    
        const address = await signer.getAddress(); // console.log(address);
        const contract = new ethers.Contract(MyNFTContractAddress, abi, signer);
        
        const contractAddress = '0x20f663cea80face82acdfa3aae6862d246ce0333';
        const DripContract = new ethers.Contract(contractAddress, dripABI, signer)
       
        const dripBalance = await DripContract.balanceOf(address);
        
        
        console.log(dripBalance);
        
        try {
            const tx = await DripTransfer(signer, paymentToggle, setDripSentToVault, dripSentToVault);
            if(tx) console.log(tx);
            
            let BNBValueToPass = ethers.utils.parseUnits('500.05', 'ether');
        
            if(tx.drip !== undefined) {
                console.log(tx.drip);
                BNBValueToPass = '0';
                
                await setDripSentToVault(tx.drip)
            
            } else {
                BNBValueToPass = await contract.mintFee();
            }
        
            // console.log('value to pass here ---> ',BNBValueToPass);
            
            const data = await contract.mint(myNFTTokenURI, paymentToggle, { value: BNBValueToPass._hex });;
            console.log(data);
            const receipt = await data.wait();
            const modData = [receipt, tx.drip? tx.drip: null];

            if(data) {
                Toaster('success', 'Minted NFT hash: ' + data.hash, '3000');
                const balanceOfContract = ethers.utils.formatEther(await provider.getBalance(MyNFTContractAddress));

                console.log(`Balance of contract here ${balanceOfContract}`);
                const threshold = '0.1'
                
                if(balanceOfContract >= threshold) {
                   
                    try {
                        await withdrawl();
                        
                    } catch (error) {
                        console.log(error);
                        
                        return error;
                    }

                    // BNBTransferToFountain(*param bnb balance on the minting contract)
                // bnb transfer to fountain should be called here
                // it should check the amount of bnb on the contract and call transfer to owner wallet and then transfer to fountain

                    try {
                        const fountainTransfer = await BNBTransferToFountain(balanceOfContract);
                        let receipt = await fountainTransfer.wait();
                        console.log(receipt)
                        
                    } catch (error) {
                        console.log(error);
                        
                        return error
                    }
                }
                
                return modData
            }
    
        } catch (error) {
            console.log(error);

            return error
        }
    } else {
        console.log('metamask window not detected')
        return new Error('This is a freaking error')
    }
}