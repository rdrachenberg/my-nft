require("@nomicfoundation/hardhat-toolbox");
const fs = require('fs');

task('accounts', 'Print out a list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('deploy', 'Deploys the My-NFT', async(taskArgs, hre) => {
  const Art = await hre.ethers.getContractFactory('Art');
  const art = await Art.deploy('My-NFT', 'MYNFT');

  await art.deployed();

  console.log('contract deployed here: ', art.address)


})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: "../client/src/artifacts",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/"
    },
    hardhat: {
      chainId: 1337 
    }
  },
 
  solidity: "0.8.4",
  paths: {
    sources: "./contracts",
    artifacts: "../client/src/artifacts",
    test: "./test",
    deploy: "./scripts"
  }
};
