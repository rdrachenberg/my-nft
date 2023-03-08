require("@nomicfoundation/hardhat-toolbox");
const fs = require('fs');


task('accounts', 'Print out a list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// task('drip', 'Adds Drip token to main account', async (taskArgs, hre) => {
//   const signer = await hre.ethers.getSigners();
//   const DripContract = await new hre.ethers.Contract()
// })

task('deploy', 'Deploys the My-NFT', async(taskArgs, hre) => {
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


})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: "../client/src/artifacts",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      allowUnlimitedContractSize: true
    },
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true
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
