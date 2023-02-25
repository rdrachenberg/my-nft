import MyNFT from '../contracts/my-nft-address.json'
export const myNFTAddress = () => {
    const myNFTAddr = MyNFT.MyNFT.toString();
    console.log('here is the Deployed Contract Address: ', myNFTAddr);

    return myNFTAddr
}