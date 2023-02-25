//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import 'hardhat/console.sol';

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Art is ERC721 {

    uint256 public tokenCount;

    mapping (uint256 => string) private _tokenURIs;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        tokenCount = 1;
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual  {
        require( _exists(_tokenId),"ERC721Metadata: URI set to a token that doesnt exist");
        
        _tokenURIs[_tokenId] = _tokenURI;
    }

    function mint(string memory _tokenURI) public {
        require(!isTokenURIEmpty(_tokenURI), 'You must provide a valid Token URI');
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        tokenCount++;
        
        console.log('mint function finished');
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