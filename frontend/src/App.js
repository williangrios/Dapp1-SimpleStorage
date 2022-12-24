import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter, { async } from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import Button from "react-bootstrap/Button";

import { format6FirstsAnd6LastsChar } from "./utils";
import meta from "./assets/metamask.png";

function App() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [user, setUser] = useState({});
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  //contract goerli testnet
  const contractAddress = '0x3059F1260795A8457f8Cf426A6cf17D12731DFca'
  //abi
  const abi = [
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "setName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  function toastMessage(text) {
    toast.info(text)  ;
  }
  
  async function handleConnectWallet (){
    try {
      setLoading(true)
      let prov =  new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);

      let userAcc = await prov.send('eth_requestAccounts', []);
      setUser({account: userAcc[0], connected: true});

      const contrSig = new ethers.Contract(contractAddress, abi, prov.getSigner())
      setSigner( contrSig)

    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false);
    }
  }

    

  useEffect(() => {
    
    async function getData() {
      try {
        const {ethereum} = window;
        if (!ethereum){
          toastMessage('Metamask not detected');
        }
  
        const goerliChainId = "0x5";
        const currentChainId = await window.ethereum.request({method: 'eth_chainId'})
        if (goerliChainId != currentChainId){
          toastMessage('Change to goerli testnet')
        }    
      } catch (error) {
        toastMessage(error.reason)        
      }
      
    }

    getData()  
    
  }, [])
  
  async function isConnected(){
    if (!user.connected){
      toastMessage('You are not connected!')
      return false;
    }
    return true;
  }

  async function handleDisconnect(){
    try {
      setUser({});
      setSigner(null);
      setProvider(null);
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  async function handleSave(){
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.setName(name);
      await resp.wait();
      toastMessage('Name updated. Thanks for waiting.')  
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }
  
  async function getValue(){
    try {
      if (!isConnected()) {
        return;
      }
      const resp = await signer.name();
      toastMessage (`The name in blockchain is ${resp}`)  
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Simple smart contract" image={true} />
      <WRInfo chain="Goerli" testnet={true} />
      <WRContent>
        {loading && 
          <h1>Loading....</h1>
        }
        { !user.connected ?<>
            <Button className="commands" variant="btn btn-primary" onClick={handleConnectWallet}>
              <img src={meta} alt="metamask" width="30px" height="30px"/>Connect to Metamask
            </Button></>
          : <>
            <label>Welcome {format6FirstsAnd6LastsChar(user.account)}</label>
            <button className="btn btn-primary commands" onClick={handleDisconnect}>Disconnect</button>
          </>
        }
        <hr/>
        <h2>Save your name in blockchain</h2>
        <label>Type your name below to save in blockchain</label>
        <input className="commands" type='text'value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn btn-primary commands" onClick={handleSave}>Save in blockchain</button>        
        <hr/>
        <button className="btn btn-primary commands" onClick={getValue}>Get name in blockchain</button>
      </WRContent>
      <WRTools react={true} truffle={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;
