// *************************************************************************************************
// require statements and initial variable declaration 
// *************************************************************************************************
const express = require('express');
require('express-async-errors');
const fs = require('fs');
const app = express(); 
let node;
// *************************************************************************************************


// *************************************************************************************************
// function to load an instance of IPFS
// *************************************************************************************************
async function loadIpfs() {
    const IPFS  = await import('ipfs-core');
    const ipfs = await IPFS.create({repo: "ok" + Math.random(), http: "http://localhost:5001" });
    
    node = ipfs;
    
    return ipfs
}
// *************************************************************************************************

loadIpfs();

async function addStringToHash(str) {
    const { cid } = await node.add(str);
    
    await node.pin.add(cid);

    return cid
}

async function addFileToHash(file) {
    const content = await fs.promises.readFile(file); // read file contents returns Buffer 
    const { cid } = await node.add(content); // run add method returns hashed CID

    await node.pin.add(cid); // add the cid to pin the content. 
    console.log('Here is the file cid hashed -------> ', cid)

    return cid
}

app.use(express.json());

app.get('/', async (req, res) => {
    return res.send(`<h1>Welcome to the backend application</h1>`)
})

app.post('/add-text', async (req, res) => {
    const body = JSON.stringify(req.body);
    
    try {
        const cid = await addStringToHash(body);
        console.log(`This text: ${body}, was sent to the hasher`);
        console.log(`Here is the CID hash on ipfs  ${cid}`);

        return res.send(`<h2>here is a link to the  hash http://gateway.ipfs.io/ipfs/${cid}</h2>`);
        
    } catch (error) {
        console.log(error);

        return error
    }
})

app.post('/add-file', async (req, res) => {
    const data = req.body.image;
    const name = req.body.name;
    
    const description = req.body.description;
    let nftObj;
    // console.log(data, '<--- here is the data var');

    try {
        let hash = await addFileToHash(data);

        nftObj = JSON.stringify({
            name : name,
            description : description,
            image: `http://gateway.ipfs.io/ipfs/${hash}`
        });
        
        console.log(nftObj);

        let finalHash = await addStringToHash(nftObj);

        console.log(finalHash);

        return (res.send(`<h2>here is a link to the  hash https://gateway.ipfs.io/ipfs/${finalHash}</h2>`))

    } catch (error) {
        console.log(error);

        return error
    }
})

app.listen(8080, () => {
    console.log('server running on port 8080', );
})