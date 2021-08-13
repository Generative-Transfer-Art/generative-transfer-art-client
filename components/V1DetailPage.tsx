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

declare global {
    interface Window {
        ethereum:any;
    }
}

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
            <DetailLoaded nftInfo={nftInfo} refresh={getInfo} />
            }
        </div>
    )
}

function DetailLoaded({nftInfo, refresh}) {
    const [artTransferContractWeb3, setArtTransferContractWeb3] = React.useState(null)
    const [providerAvailable, setProviderAvailable] = useState(null)
    const [account, setAccount] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [toAddress, setToAddress] = useState("")

    const getAccount = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        var account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
        setIsOwner(account == nftInfo.owner)
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log("accounts changed")
          account = ethers.utils.getAddress(accounts[0])
          setAccount(account)
          setIsOwner(account == nftInfo.owner)
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
                <br/>
                <div> Owned by {nftInfo.owner} </div>
                <br/>
                {
                    account == null ? 
                    <div> 
                        { providerAvailable ? 
                            <div className="btn" onClick={getAccount}> <img src="../connect_wallet.svg" /> </div> : 
                            "In order to connect, please use Chrome + Metamask"
                            } 
                    </div> : 
                    <div>
                    <div> Connected with {account.slice(0, 5)}...</div>
                    </div>
                }
                

                <AddressInput address={toAddress} setAddress={setToAddress}/>
                <br/>
                {toAddress == "" || !ethers.utils.isAddress(toAddress) || !isOwner ? "" : <TransferButton from={account} to={toAddress} id={nftInfo.id} contract={artTransferContractWeb3} refresh={refresh}/>}
        </div>
    )
}

function AddressInput({address, setAddress}){
    const [isError, setError] = React.useState(false)
    const [cssProperties, setCssProperties] = useState({})

    const handleChange = (event) => {
        const a = event.target.value
        console.log("here")
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
        <input id="address-input" onFocus={clearErrors} placeholder='Enter address to check color' value={address} onChange={handleChange}/>
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

function TransferButton({from, to, id, contract, refresh}){
    const [transactionHash, setTransactionHash] = useState("")
    const [success, setSuccess] = useState(false)

    const transfer = async () => {
        setTransactionHash("")
        const t = await contract.transferFrom(from, to, id)
        setTransactionHash(t.hash)
        t.wait().then((receipt) => {
            waitForEvent()
            refresh()
          })
          .catch(err => {
            console.log(err)
          })
      }
    
      const waitForEvent = async () => {
        const filter = transferArtContract.filters.Transfer(from, to)
        console.log(filter)
        transferArtContract.once(filter, (from, to, id) => {
            setSuccess(true)
            refresh()
          
        }
        )
      }

      return(
            <div>
            { success ? "" : <button className="btn" onClick={transfer}> trasfer to {to.slice(0, 5)}...</button> }

            {
                transactionHash == "" ? "" :
                <a target="_blank" href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>
            }

            {
                success ? 
                <div> 
                Successfully transferred
                </div>
                :
                <div>
                {
                transactionHash == "" ? "" :
                "Waiting for transaction to land on chain..."
                }
                </div>

            }
          </div>
      )
}

// function Interaction