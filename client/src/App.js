import { useEffect, useState, createContext} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig, useAccount, useDisconnect } from 'wagmi'
import { bsc, localhost } from 'wagmi/chains'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from './helpers/toaster';

import Navbar from './components/Navbar';
import { PhotoEditorSDK } from './components/PhotoEditer';
import { Upload } from './components/Upload';
import { Home } from './components/Home';
import { Welcome } from './components/Welcome';
import { About } from './components/About';



setTimeout(() => {
  if(!process.env.REACT_APP_PROJECT_ID) {
    Toaster('fail','You need a project id');
    Toaster('info', 'Please get a project id from wallet connect and include in your .env file')
  }  

}, 6000);
 

const projectId = process.env.REACT_APP_PROJECT_ID;
// const localhost = process.env.REACT_APP_RPC_URL.toString();
// console.log(localhost);
const localOrMain = localhost ? localhost : bsc
const chains = [localOrMain];

const { provider } = configureChains(chains, [walletConnectProvider({ projectId })]);
const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ version: '2', appName: 'My-NFT', chains, projectId}),
    provider
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  const [collection, setCollection] = useState([]);
  const [activateEdit, setActivateEdit] = useState(false);
  const [loggedIn, setLoggedIn] =  useState(false);
  const [editorToggle, setEditorToggle] = useState(false);
  const {address, isConnected} = useAccount();
  const [dripSentToVault, setDripSentToVault] = useState(0);
  
  const activateEditor = () => {
    setActivateEdit(!activateEdit);
  }

  const accountLoggedIn = () => {
    setLoggedIn(!loggedIn);
    console.log(loggedIn, 'loggedIn var');
    return loggedIn
  }

  const handleDripChange = () => {
    setDripSentToVault(dripSentToVault);
    return dripSentToVault
  }
  
  useEffect(() => {
    if(isConnected) { 
        // Toaster('success', `Wallet connected`);
        // handleDripChange();
      } else {  
        Toaster('fail', 'Wallet disonnected')
      } 
  }, [isConnected, setDripSentToVault, dripSentToVault]);

  
  return (
    <Router>
      <div className="App">
        
          <WagmiConfig client={wagmiClient}>
            <Navbar Web3Button={Web3Button} accountLoggedIn={accountLoggedIn} isConnected={isConnected}/>
            {isConnected ? 
              <Routes dripSentToVault={dripSentToVault}>
                <Route path='/' element={<Home account={address} dripSentToVault={dripSentToVault} />} />
                <Route path='/upload' element={<Upload address={address} setDripSentToVault={setDripSentToVault} dripSentToVault={dripSentToVault} onChange={handleDripChange}/>} />
                <Route path='/about' element={<About />} />
              </Routes>
              
              :
              <Routes>
                
                <Route path='*' element={<Welcome />}>

                </Route>
              </Routes>
            }
            { activateEdit ? 
              <div><PhotoEditorSDK /></div>
            :
              <></>
            }
          </WagmiConfig>
          
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        <ToastContainer /> 
      </div>
    </Router>
  );
}

export default App;
/**
 * 
 *   { editorToggle ? 
          <div>
            <button onClick={activateEditor}>Activate Editor</button>
          </div>
        : 
          <></>
        }
 */