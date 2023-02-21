// *************************************************************************************************
// require statements and initial variable declaration 
// *************************************************************************************************
require('dotenv').config()
const express = require('express');
require('express-async-errors');
const app = express(); 
const cors = require('cors');
let node;
// *************************************************************************************************


// *************************************************************************************************
// function to load an instance of IPFS
// *************************************************************************************************
async function loadIpfs() {
    const IPFS  = await import('ipfs-core');
    const ipfs = await IPFS.create({ http: "http://localhost:5001" });
    // repo: "ok" + Math.random(),
    // node = ipfs;
    
    return ipfs
}
// *************************************************************************************************



async function addStringToHash(str) {
    const node = await loadIpfs();
    const { cid } = await node.add(str);
    
    await node.pin.add(cid);

    console.log(`Here is the CID ...  ${cid}`);

    return cid
}

async function addFileToHash(file) {
    // const content = await fs.promises.readFile(file); // read file contents returns Buffer 
    const { cid } = await node.add(file); // run add method returns hashed CID

    await node.pin.add(cid); // add the cid to pin the content. 
    console.log('Here is the file cid hashed -------> ', cid)

    return cid
}

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000'}));
app.use(express.urlencoded({ extended: false}));

app.get('/', async (req, res) => {
    return res.send(`<h1>Welcome to the backend application</h1>`)
})

app.post('/add-file', async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let image = req.body.image;
    const name = req.body.name;
    const description = req.body.description;
    let nftObj;
    
    console.log(req.body);
    // image = Buffer.from(image, 'base64')
    // image = JSON.parse(image)
    console.log(image, '<--- here is the image var');
    

    try {
        // let hash = await addFileToHash(image);

        nftObj = JSON.stringify({
            name : name,
            description : description,
            image: image
        });
        
        console.log(nftObj);

        let finalHash = await addStringToHash(nftObj);

        console.log(`https://gateway.ipfs.io/ipfs/${finalHash}`);
        next();
        return (res.send(`<h2>here is a link to the  hash https://gateway.ipfs.io/ipfs/${finalHash}</h2>`))

    } catch (error) {
        console.log(error);

        return error
    }
    
    
})

app.listen(8080, () => {
    console.log('server running on port 8080', );
})


/*
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
*/