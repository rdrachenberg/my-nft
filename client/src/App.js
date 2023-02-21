import { useEffect, useState} from 'react';
import './App.css';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig, useAccount, useDisconnect } from 'wagmi'
import { bsc } from 'wagmi/chains'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from './helpers/toaster';

import Navbar from './components/Navbar';
import { PhotoEditorSDK } from './components/PhotoEditer';
import { Upload } from './components/Upload'

if(!process.env.REACT_APP_PROJECT_ID) {
    Toaster('fail','You need a project id');
    Toaster('info', 'Please get a project id from wallet connect and include in your .env file')
} else {
    Toaster('success', 'New Project ID Identified Here');
    Toaster('success', 'Cleared to proceed 🚀', 1000);
    // showAlertSuccess('Project ID Identified');
    // showAlertSuccess('Cleared to proceed 🚀', 1000);
}

const projectId = process.env.REACT_APP_PROJECT_ID;

const chains = [bsc];

const { provider } = configureChains(chains, [walletConnectProvider({ projectId })]);
const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ version: '1', appName: 'My-NFT', chains, projectId}),
    provider
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  const [activateEdit, setActivateEdit] = useState(false);
  const [loggedIn, setLoggedIn] =  useState(false);
  const [editorToggle, setEditorToggle] = useState(false);
  const {address, isConnected} = useAccount();
  
  const activateEditor = () => {
    setActivateEdit(!activateEdit);
  }

  const accountLoggedIn = () => {
    setLoggedIn(!loggedIn);
    console.log(loggedIn, 'loggedIn var');
    return loggedIn
  }

  // console.log(localStorage.getItem('wagmi.store'))
  // let account = JSON.parse(localStorage.getItem('wagmi.store')).state.data.account;
  // console.log(account)
  // useEffect(() => {
  //   let account = JSON.parse(localStorage.getItem('wagmi.store')).state.data.account;
  //   if(account) {
  //     console.log(account)
  //   }

  // }, [])
  
  useEffect(() => {
    if(isConnected) { 
        Toaster('success', `Wallet connected ${address}`);
    
      } else {
      Toaster('info', 'Please connect your wallet', 2000)
    }
  
    
  }, [isConnected, address])
  
  
  return (
    <div className="App">
      
      <WagmiConfig client={wagmiClient}>
      <Navbar Web3Button={Web3Button} accountLoggedIn={accountLoggedIn}/>
        { isConnected ? 
          <div>
            
            <div className='upload'>
              <Upload address={address}/>
            </div>
            <div>
              { activateEdit ? 
                <div><PhotoEditorSDK /></div>
              :
                <></>
              }
            </div>
          </div>
          
        :
          <div>
              <h1>.......</h1>
              <h2>Thanks for visiing My-NFT</h2>
            <h3>Please connect with your wallet</h3>
          
          </div>
        } 
        
        </WagmiConfig>
        
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        <ToastContainer />
        
    </div>
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