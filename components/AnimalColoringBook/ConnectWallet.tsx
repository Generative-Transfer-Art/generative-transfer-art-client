import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { SmallAddressColorSquare } from './AnimalImage'

declare global {
    interface Window {
        ethereum:any;
    }
}

export default function ConnectAddress({addressSetCallback}){
    const [account, setAccount] = useState(null)
    const [providerAvailable, setProviderAvailable] = useState(false)
  
    const getAccount = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      var account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
      addressSetCallback(account)
      window.ethereum.on('accountsChanged', function (accounts) {
        console.log("accounts changed")
        account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
        addressSetCallback(account)
      })
    }
  
    const setup = async () => {
        if(window.ethereum == null){
          setProviderAvailable(false)
          return
        }
        setProviderAvailable(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
    }
  
    useState(() => {
      setup()
    })
  
    return(
      <div id='connect-address-wrapper'>
        { providerAvailable ? 
        <div>
          {account == null? 
          <div onClick={getAccount} id='connect-address-button'> Connect Address </div>
          : <div className='float-right'> 
            <SmallAddressColorSquare address={account} />
            <p className='float-left century'> {account} </p>
          </div>
          }
        </div>
        : 
        <div id='use-metamask'> Please use <a href="https://metamask.io/" target="_blank"> Metamask </a> + <a href="https://www.google.com/chrome/" target="_blank"> Chrome </a> to connect </div>
        }
      </div>
    )
  }