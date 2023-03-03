// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require("ethers");
const dripABI = require('../abi/drip.json')


// dripABI = JSON.stringify(dripABI);
// console.log(dripABI);

async function main() {
  
  const contractAddress = '0x20f663cea80face82acdfa3aae6862d246ce0333';
  
//   console.log(dripABI)

  const dripWhaleSigner = await hre.ethers.getImpersonatedSigner('0xa79e5c4f0018dd018d86a4f85b68b9f40e4a8ca2')
//   const singer = dripWhaleSigner.getSigners();
  console.log(dripWhaleSigner);
//   console.log(signer);

  const Drip = await new ethers.Contract(contractAddress, dripABI, dripWhaleSigner);
  
  const dripAmount = hre.ethers.utils.parseUnits('500', 'ether');
  const dripTransfer = await Drip.transfer('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', dripAmount);

  
  
  console.log('Drip transfered ---> ', dripTransfer);


  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
