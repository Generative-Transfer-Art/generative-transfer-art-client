import React, { useState, useEffect } from 'react';
import getNFTInfo from '../lib/getNFTInfo';
import { ethers } from "ethers";
import TransferArtArtifact from "../contracts/TransferArt.json";
import Media from './Media';

const _provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER);

const transferArtContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT,
      TransferArtArtifact.abi,
      _provider
    );

export default function V1DetailPage({id}){
    const [nftInfo, setNftInfo] = useState(null)

    const getInfo = async () => {
        if (id == undefined) {
            return 
        }
        var info = await getNFTInfo({Contract: transferArtContract, tokenId: ethers.BigNumber.from(id + "")})
        const copyOf = await transferArtContract.copyOf(id + "")
        const owner = await transferArtContract.ownerOf(id + "")
        info["copyOf"] = copyOf
        info["owner"] = owner

        setNftInfo(info)
    }

    useEffect(()=> {
        getInfo()
    }, [id])

    return(
        <div id="v1-detail-wrapper"> 
            {nftInfo == null ? "" :
            <DetailLoaded nftInfo={nftInfo} />
            }
        </div>
    )
}

function DetailLoaded({nftInfo}) {
    const [artTransferContractWeb3, setArtTransferContractWeb3] = React.useState(null)
    const [providerAvailable, setProviderAvailable] = useState(null)
    const [account, setAccount] = useState(null)

    const getAccount = async () => {
        const accounts = await window.ethereum.send('eth_requestAccounts');
        const account = accounts.result[0]
        setAccount(account)
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log("accounts changed")
          setAccount(accounts[0])
        })
    }

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

    useEffect(()=> {
        setup()
    }, [])

    return(
        <div>
            <h2> #{nftInfo.id.toString()}  {nftInfo.copyOf == 0 ? "" : "(copy of #" + nftInfo.copyOf.toString() + ")"} </h2>
                <div id="v1-media">
                    <Media media={nftInfo.mediaUrl} mediaMimeType={nftInfo.mediaMimeType} autoPlay={false}/>   
                </div> 
                <AddressInput />
        </div>
    )
}

function AddressInput(){
    const [address, setAddress] = useState("")
    const [isError, setError] = React.useState(false)
    const [cssProperties, setCssProperties] = useState({})

    const handleChange = (event) => {
        const a = event.target.value
        setAddress(a)

        if(!ethers.utils.isAddress(a)){
            setError(true)
            return
        }
        updateCSS(a)
        
    }

    const handlePaste = (event) => {
        const a = event.clipboardData.getData('Text')
        setAddress(a)

        if(!ethers.utils.isAddress(a)){
            setError(true)
            return
        }
        updateCSS(a)
    }

    const updateCSS = async (address) => {
        const [r,g,b,a] = await transferArtContract.addressRgba(address);
        console.log(r)
        var properties = {}
        properties['--r'] = parseInt(r)
        properties['--g'] = parseInt(g)
        properties['--b'] = parseInt(b)
        properties['--a'] = parseFloat(a)
        setCssProperties(properties)

    }

      const clearErrors = () => {
        setError(false)
      }

      return(
          <div >
              <br/>
        <input id="address-input" onFocus={clearErrors} placeholder='Enter address to check color' value={address} onChange={handleChange} onPaste={handlePaste}/>
        <div>
        {
            Object.keys(cssProperties).length == 0 ? "" :
            <ShowColorRect cssProperties={cssProperties} />
        }
        </div>
        </div>
      )
}

function ShowColorRect({cssProperties}){
    return (
        <div>
            <p> Address color: rgba({cssProperties['--r']},{cssProperties['--g']},{cssProperties['--b']},{Math.max(1,cssProperties['--a'])}) </p>
            <div id="show-color-rect" style={cssProperties} > </div>
        </div>
    )
}

// function Interaction