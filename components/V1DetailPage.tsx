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
            <h2> #{nftInfo.id.toString()}  {nftInfo.copyOf == 0 ? "" : "(copy of #" + nftInfo.id.toString() + ")"} </h2>
                <div id="v1-media">
                    <Media media={nftInfo.mediaUrl} mediaMimeType={nftInfo.mediaMimeType} autoPlay={false}/>   
                </div> 
        </div>
    )
}

// function Interaction