// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  
  const Art = await hre.ethers.getContractFactory("Art");
  const art = await Art.deploy('My-NFT', 'MYNFT');

  await art.deployed();
  
  console.log('NFT Contract Deployed here ---> ', art.address);

  const contractsDir = '../client/src/contracts';

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  };

  fs.writeFileSync(
    contractsDir + '/my-nft-address.json',
    JSON.stringify(
      {
        MyNFT: art.address
      },
      undefined, 2
    )
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
