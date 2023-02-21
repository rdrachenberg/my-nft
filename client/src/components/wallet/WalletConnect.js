import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Button, Web3Modal, Web3NetworkSwitch } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { bsc } from 'wagmi/chains'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//* Create toast alert handlers 
    //* ********************************************************************************************
    const showAlertSuccess = (message, delay) => {
        toast.success(message, {delay: delay});
    }

    const showAlertFail = (message) => {
        toast.error(message);
    }

    const showAlertInfo = (message) => {
        toast.info(message);
    }

if(!process.env.REACT_APP_PROJECT_ID) {
    showAlertFail('You need a project id');
    showAlertInfo('Please get a project id from wallet connect and include in your .env file')
} else {
    showAlertSuccess('Project ID Identified');
    showAlertSuccess('Cleared to proceed 🚀', 1000);
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

export default function WalletConnect() {
    return (
        <div>
            <WagmiConfig client={wagmiClient}>
                <Web3Button />
                <br/>
                <Web3NetworkSwitch/>
                <br/>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
            <ToastContainer />
        </div>
    )
}