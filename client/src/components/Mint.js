import { myNFTAddress } from "./MyNFTAddress";
import { useProvider, useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { DripTransfer } from '../helpers/dripHelper';

export async function MyMint(myNFTTokenURI) {
    const MyNFTContractAddress =  myNFTAddress();

    const abi = require('../artifacts/contracts/Art.sol/Art.json').abi
    
    console.log(abi);
    console.log(myNFTTokenURI);
    console.log(MyNFTContractAddress);

      // const tx = {
        //     from: userAccount,
        //     to: MyNFTContractAddress,
        //     value: minimumBNB,
        //     nonce: await provider.getTransactionCount(userAccount, 'latest'),
        //     gasLimit: ethers.utils.hexlify(10000),
        //     gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
        // }

        // const transaction = await signer.sendTransaction(tx);

        // console.log(transaction);

    
    if(typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(MyNFTContractAddress, abi, signer);
        

        try {
            const tx = await DripTransfer(signer);
            // console.log(await DripTransfer(signer));
           console.log(tx);
            const value = ethers.utils.parseUnits('0.05', 'ether');
            const data = await contract.mint(myNFTTokenURI, {value: value});;
          
            console.log(data);
            if(data) {
                return data
            }
        } catch (error) {
            console.log(error);
            return error
        }

       
    }
}
    
    
    // return 