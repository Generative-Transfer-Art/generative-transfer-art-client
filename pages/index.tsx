import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import TransferArtArtifact from "../contracts/TransferArt.json";
import getNFTInfo from '../lib/getNFTInfo';

const _provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER);

const transferArtContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT,
      TransferArtArtifact.abi,
      _provider
    );

declare global {
    interface Window {
        ethereum:any;
    }
}

export default function Home(){
  const [projectState, setProjectState] = useState(null)
  const [account, setAccount] = useState(null)

  const getProjectState = async () => {
    var mintPrice = await transferArtContract.mintFeeWei() 
    var mintPriceString = ethers.utils.formatEther(mintPrice).toString()
    var minted = await transferArtContract.originals()
    var state = {
      mintPrice: mintPriceString,
      minted: minted.toString(),
      remaining: ethers.BigNumber.from(64).sub(minted).toString()
    }
    setProjectState(state);
  }

  const getAccount = async () => {
    const accounts = await window.ethereum.send('eth_requestAccounts');
    const account = accounts.result[0]
    setAccount(account)
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log("accounts changed")
      setAccount(accounts[0])
    })
  }

  useEffect(() => {
    getProjectState()
  }, [])

  return (
   
   <div id="home-wrapper">
     <Head>
        <title>{"Generative Transfer Art"}</title>
      </Head>
     <img src="generative_1_title.svg" />
   { projectState == null ?
   <div id="project-details"> 
   Loading...
   </div>: 
   <div>
    <div id="project-details">
      <p>
        Current mint price: {projectState.mintPrice} ETH
      </p>
      <p>
        Minted: {projectState.minted}
      </p>
      <p>
      Remaining: {projectState.remaining}
      
      </p>
      </div>
      {
        parseInt(projectState.remaining) > 0 ? 
        <MintController mintFee={projectState.mintPrice} mintCallBack={getProjectState}/> : ""
      }
    </div>
    }
   </div>
      
  )
}

function MintController({mintFee, mintCallBack}) {
  const [artTransferContractWeb3, setArtTransferContractWeb3] = React.useState(null)
  const [providerAvailable, setProviderAvailable] = useState(null)
  const [account, setAccount] = React.useState(null)
  const [transactionHash, setTransactionHash] = useState("")
  const [id, setId] = useState(null)

  const setup = async () => {
    if(window.ethereum == null){
      setProviderAvailable(false)
      return
    }
    setProviderAvailable(true)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setArtTransferContractWeb3(createWeb3ArtTransfers(provider))
  }

  const createWeb3ArtTransfers = (provider) => {
    return new ethers.Contract(
     process.env.NEXT_PUBLIC_CONTRACT,
     TransferArtArtifact.abi,
     provider.getSigner(0)
   );
  }

  const getAccount = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0]
    setAccount(account)
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log("accounts changed")
      setAccount(accounts[0])
    })
  }

  const mint = async () => {
    setTransactionHash("")
    setId(null)
    const t = await artTransferContractWeb3.mint(account, {value: ethers.utils.parseUnits(mintFee, 18)})
    setTransactionHash(t.hash)
    t.wait().then((receipt) => {
        waitForEvent()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const waitForEvent = async () => {
    const filter = transferArtContract.filters.Transfer(null, account)
    console.log(filter)
    transferArtContract.once(filter, (from, to, id) => {
      console.log("id!")
      console.log(id.toString())
      loadMedia(id)
      setId(id.toString())
      
    }
    )
  }

  const loadMedia = async (id) => {
    var x = await getNFTInfo({Contract: transferArtContract, tokenId: id})
    console.log(x)
  }

  useEffect(() => {
    setup()
  }, [])

  return(
    <div>
      {
      account != null ? 
      <div className="btn" onClick={mint}> <img src="mint_button.svg" /> </div>:
      <div>
        {
          providerAvailable == null ? 
          ""
          :
          <div>
          { providerAvailable ? 
          <div className="btn" onClick={getAccount}> <img src="connect_wallet.svg" /> </div> : 
          "In order to mint, please use Chrome + Metamask"
        } 
        </div>
        }
      </div>
      }
      {
        transactionHash == "" ? "" :
        <a href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>

      }

      {
        id == null ? "" :
        <div> 
          Successfully minted #{id} - 
          <a href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_CONTRACT + "/" +  id}> View On Open Sea </a>
        </div>

      }
    </div>
  )
}



