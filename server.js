
// const ipfsClient = require('ipfs-http-client');
const express = require('express');
require('express-async-errors');

const mime = require('mime');
const fs = require('fs');
const path = require('path');

const app = express(); 

async function loadIpfs() {
    const IPFS  = await import('ipfs-core');
    // const ipfs = await IPFS.create({http: 'http://localhost:5001'});
    const ipfs = await IPFS.create({repo: "ok" + Math.random(), http: "http://localhost:5001" });
    
    return ipfs
}

async function addStringToHash(str, node) {
    node = await loadIpfs();
    const { cid } = await node.add(str);

    return cid
}

async function addFileToHash(file) {
    let node = await loadIpfs();

    const content = await fs.promises.readFile(file);
    const type = mime.getType(file);
    console.log(type);
    const { cid } = await node.add(content);

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
        const loader = await loadIpfs();
        const cid = await addStringToHash(body, loader);

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
    console.log(data, '<--- here is the data var');

    try {
        let hash = await addFileToHash(data);

        // console.log(res);


        return (res.send(`<h2>here is a link to the  hash http://gateway.ipfs.io/ipfs/${hash}</h2>`))

    } catch (error) {
        console.log(error);

        return error
    }
})

app.listen(8080, () => {
    console.log('server running on port 8080', );
})