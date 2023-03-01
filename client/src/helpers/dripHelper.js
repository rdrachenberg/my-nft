import { BigNumber, ethers } from 'ethers';
import { dripABI } from '../abis/dripABI';
import { myNFTAddress } from '../components/MyNFTAddress';

export const DripTransfer = async (signer) => {
    
    const contractAddress = '0x20f663cea80face82acdfa3aae6862d246ce0333';
    const userAccount = signer.getAddress();

    const myNFT =  myNFTAddress();

    console.log(contractAddress);
    const DripContract = new ethers.Contract(contractAddress, dripABI, signer);
    const dripBalance = await DripContract.balanceOf(userAccount);
    
    const formatBalance = parseInt(dripBalance._hex);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

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
    const dripOrBNB = (formatBalance >= 10 ? 'drip' : 'bnb');

    if(!balanceMeetsMinimum) {
        console.log('sorry, you need at least 10 Drip or 0.05 BNB to mint')
        throw new Error('sorry, you need at least 10 Drip to mint or 0.05 BNB')
    }

    console.log(dripOrBNB);

    if(dripOrBNB === 'drip') {
        await DripContract.approve(contractAddress, minimumBNB);
    } else {
        // await DripContract.approve(contractAddress, minimumBNB);
        const tx = {
            value: minimumBNB._hex,
            nonce: await provider.getTransactionCount(userAccount, 'latest'),
            gasLimit: ethers.utils.hexlify(10000),
            gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
        }

        // const transaction = await signe.sendTransaction(tx);

        // console.log(transaction);

        // return transaction

        return tx
    }

}