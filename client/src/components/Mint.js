import { myNFTAddress } from "./MyNFTAddress";
import { useProvider, useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { DripTransfer } from '../helpers/dripHelper';
import { BNBTransferToFountain } from "../helpers/bnbHelper";
import { Toaster } from '../helpers/toaster.js';
import { dripABI } from "../abis/dripABI";
import { withdrawl } from "../helpers/withdrawHelper";
import { stakeViewer } from '../helpers/stakeHelper';


export async function MyMint(myNFTTokenURI, paymentToggle) {
    const MyNFTContractAddress =  myNFTAddress();

    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi
    
    // console.log(abi);
    // console.log(myNFTTokenURI);
    // console.log(MyNFTContractAddress);
    
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
            const tx = await DripTransfer(signer, paymentToggle);
            if(tx) console.log(tx);
            
            let valueToPass = ethers.utils.parseUnits('500.05', 'ether');
        
            if(!tx) {
                valueToPass = '0';
            
            } else {
                // valueToPass = await contract.mintFee();
            }
        
            // console.log('value to pass here ---> ',valueToPass);
            
            const data = await contract.mint(myNFTTokenURI, paymentToggle, { value: valueToPass._hex });;
            console.log(data);

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
                        fountainTransfer.wait();
                        console.log(fountainTransfer)
                        
                    } catch (error) {
                        console.log(error);
                        
                        return error
                    }
                }
                
                return data
            }
    
        } catch (error) {
            console.log(error);

            return error
        }
    }
}