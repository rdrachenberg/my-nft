//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import 'hardhat/console.sol';
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Art is ERC721 {

    uint256 public tokenCount;
    uint256 public mintFee;
    address public owner;

    mapping (uint256 => string) private _tokenURIs;

    constructor(
        string memory name,
        string memory symbol,
        uint256 fee
    ) ERC721(name, symbol) {
        tokenCount = 1;
        mintFee = fee;
        owner = payable(msg.sender);
        
    }

/*
* @dev Sets the to _tokenId in the _tokenURIs mapping.
* @param _tokenId (mint #) and _tokenURI will be a string to the IPFS data hash JSON .
* @return
*/
    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual  {
        require( _exists(_tokenId),"ERC721Metadata: URI set to a token that doesnt exist");
        
        _tokenURIs[_tokenId] = _tokenURI;
    }

    function setMintFee(uint fee)public returns(uint256 mintF) {
            mintFee = fee;
        return mintFee;
    }

    function mint(string memory _tokenURI, bool isDrip) public payable{
        require(!isTokenURIEmpty(_tokenURI), 'You must provide a valid Token URI');
        console.log(mintFee);
        
        if(isDrip = false) {
            require( msg.value >= mintFee, 'You must spend more');
        }
        
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        tokenCount++;
        
        console.log('mint fee');
        console.log(mintFee);
        console.log('NFT mint successful');
    }

    function tokenURI(uint256 _tokenId) public view override returns(string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI set to a token that doesnt exist");

        return _tokenURIs[_tokenId];
    }

    function isTokenURIEmpty(string memory _test) pure public returns(bool) {
        bytes memory check = bytes(_test);

        if(check.length > 0) {
            return false;
        
        } else {
            return true;
        }
        
        // return check.length > 0 ? false : true;
    }
}