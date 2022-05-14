import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  /**
   * Create a varaible here that holds the contract address after you deploy!
   */

  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0x6DB8ebb4290393a01BCC7Bdf00d1Ac106F254d72";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();


        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      console.log(accounts);

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const [waveMessage, setWaveMessage] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target[0].value);

    
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(waveMessage, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);
        setIsLoading(true);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        
        setIsLoading(false);
        getAllWaves();
        alert("Mining Successful!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="hello">👋</span> Hey there!
        </div>

        <div className="bio">
          I am Ryuzaki and I am Machine Learning and BlockChain enthusiast. Connect your Ethereum wallet and wave at me!
        </div>

        <form onSubmit={handleSubmit} style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <div className="mb-3 my-3">
                <input type="text" className="form-control" onChange={(e) => setWaveMessage(e.target.value)} placeholder="Send me a message"/>
            </div>
            <button type="submit" className="waveButton btn btn-primary"  onClick={wave}>
              Wave at Me
            </button>
        </form>

        <br/>
        {isLoading &&
          <div className="spinner-border" role="status" style={{marginLeft:"47%"}}>
            <span className="sr-only"></span>
          </div>
        }
        

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ marginTop: "16px", padding: "8px",border:"2px solid #A6A6A6" }}>
              
              <div style={{ fontSize: "1rem",  padding: "0px", color: "#A6A6A6" }}>From: {wave.address}</div>
              <div style={{ fontSize: "1rem",  padding: "0px", color: "#A6A6A6"}}>{wave.timestamp.toString().slice(4,25)}</div>
              <div style={{ fontSize: "1.4rem", paddingTop: "3px",paddingBottom: "4px", color:"#4F4F4F " }}> {wave.message}</div>
              
              
            </div>)
        })}
        <br/>
        <br/>
        <br/>
      </div>
    </div>
  );
}

export default App
