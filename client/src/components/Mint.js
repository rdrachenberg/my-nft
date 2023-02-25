import { myNFTAddress } from "./MyNFTAddress";
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';

export async function MyMint(myNFTTokenURI) {
    const MyNFTContractAddress =  myNFTAddress();

    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi
    
    console.log(abi);
    console.log(myNFTTokenURI);
    console.log(MyNFTContractAddress);
    
    if(typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(MyNFTContractAddress, abi, provider);
        const account = provider.getSigner();
        const accountWSigner = contract.connect(account);

        try {
            const data = await accountWSigner.mint(myNFTTokenURI);
            console.log(data);
            if(data) {
                return data
            }
        } catch(error) {
            console.log(error);
            return error
        }
    }
    return;
    
    }
    
    
    // return 