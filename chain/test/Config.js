const hre = require('hardhat');
const assert = require('assert');

describe('Hardhat Runtime Enviroment Detected', function () {
    
    it('should have a config field', function () {
        assert.notEqual(hre.config, undefined)
    })
})