import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from 'react';
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';

import { ethers } from "ethers";

import './App.css';

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  
  function toastMessage(text) {
    toast.info(text)  ;
  }
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState('');

  //contract goerli testnet
  const addressContract = '0x3059F1260795A8457f8Cf426A6cf17D12731DFca'
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

  let contractDeployed = null;
  let contractDeployedSigner = null;
  
  function getProvider(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, abi, provider)
      contractDeployedSigner = new ethers.Contract(addressContract, abi, provider.getSigner());
    }
    return provider;
  }

  async function handleSave(){
    getProvider();
    const resp = await contractDeployedSigner.setName(name);
    console.log(resp)
    toastMessage('Name updated. Wait some seconds to get name again.')
  }

  async function connectMetaMask (){
    if(typeof window.ethereum !== "undefined"){
        try
        {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            setConnected(true)
        }
        catch (error) {
            console.log(error);
            setConnected(false)
        }
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
    }
    else {
        setConnected(false)
        toastMessage("Conect your metamask")
      }
  }

  async function getTokens (){
    // const tokens = await Promisse.all{
    //   p1, 
    //   p2, 
    //   p3
    // }
    // console.log(tokens)
  }


  async function getValue(){
    getProvider();
    const name = await contractDeployed.name();
    toastMessage (`The name in blockchain is ${name}`)
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Simple smart contract" />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
        <span>Save your name in blockchain</span>
        {connected ? (
          <div className='divHorizontal'>
            <span>Type your name below to save in blockchain</span>
            <input type='text'value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleSave}>Save in blockchain</button>
          </div>
          ) : (
            <button onClick={connectMetaMask}>Conect your wallet</button>
          )}
        <div className='divHorizontal'>
            <button onClick={getValue}>Get name in blockchain</button>
        </div>
      </WRContent>
      <WRTools react={true} truffle={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;
