const { expect } = require('chai');
const { ethers } = require('hardhat');


describe('Art contract test', function() { 
    let art;

    this.beforeEach(async function() {
        // This block will be executed before each test
        // NFT contract deployment 
        const Art = await ethers.getContractFactory('Art');
        art = await Art.deploy('My-NFT', 'MYNFT');
    });

    it('Successfully Minted your NFT', async () => {
        [account1] = await ethers.getSigners();

        expect(await art.balanceOf(account1.address)).to.equal(0);

        const tokenURI = 'https://gateway.ipfs.io/ipfs/Qmbvwm5aQyXoVpVTQWWSyE3wo75wBoZrE6aVa1oGz8iFxi';
        const tx = await art.connect(account1).mint(tokenURI);

        expect(await art.balanceOf(account1.address)).to.equal(1);
    });

    it('tokenURI is successfully set', async () => {
        [account1, account2] = await ethers.getSigners();

        const tokenURI_1 = 'https://gateway.ipfs.io/ipfs/Qmbvwm5aQyXoVpVTQWWSyE3wo75wBoZrE6aVa1oGz8iFxi';
        const tokenURI_2 = 'https://gateway.ipfs.io/ipfs/QmP5RDqDqRvD6syzsL1yxXFvpkTDxrwSGUL3yK8PYkL9uR';

        const tx1 = await art.connect(account1).mint(tokenURI_1);
        const tx2 = await art.connect(account2).mint(tokenURI_2);

        expect(await art.tokenURI(1)).to.equal(tokenURI_1);
        expect(await art.tokenURI(2)).to.equal(tokenURI_2);
    });
})