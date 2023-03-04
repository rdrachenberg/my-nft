import { myNFTAddress } from "./MyNFTAddress";
import { useProvider, useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { DripTransfer } from '../helpers/dripHelper';
import { Toaster } from '../helpers/toaster.js';
import { dripABI } from "../abis/dripABI";

export async function MyMint(myNFTTokenURI, paymentToggle) {
    const MyNFTContractAddress =  myNFTAddress();

    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi
    
    console.log(abi);
    console.log(myNFTTokenURI);
    console.log(MyNFTContractAddress);
    const provider2 = new ethers.providers.JsonRpcProvider();

    
    if(typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = signer.getAddress();
        const contract = new ethers.Contract(MyNFTContractAddress, abi, signer);
        const contractAddress = '0x20f663cea80face82acdfa3aae6862d246ce0333';
        const DripContract = new ethers.Contract(contractAddress, dripABI, signer)
        const dripBalance = await DripContract.balanceOf(address);
        const signer2 = provider2.getSigner(MyNFTContractAddress)
        console.log(dripBalance);
        
            try {
            const tx = await DripTransfer(signer, paymentToggle, signer2);
            // console.log(await DripTransfer(signer));
           console.log(tx);
            let valueToPass = ethers.utils.parseUnits('0.05', 'ether');
            
            if(!tx) {
                valueToPass = '0';
            } else {
                valueToPass = await contract.mintFee();
            }
            console.log('value to pass here ---> ',valueToPass);
            const data = await contract.mint(myNFTTokenURI, paymentToggle, { value: valueToPass._hex });;
          
            console.log(data);
            if(data) {
                Toaster('success', 'Minted NFT hash: ' + data.hash, '3000');
                return data
            }
        } catch (error) {
            console.log(error);
            return error
        }

       
    }
}
    
    
    // return 