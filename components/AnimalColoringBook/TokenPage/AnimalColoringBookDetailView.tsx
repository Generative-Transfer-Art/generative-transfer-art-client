import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import getNFTInfo from '../../../lib/getNFTInfo';
import { ethers } from "ethers";
import Media from '../../Media';
import AnimalColoringBookArtifact from "../../../contracts/AnimalColoringBook.json";
import AnimalColoringBookEraserArtifact from "../../../contracts/AnimalColoringBookEraser.json";
import SequentialAnimalPreview from './AnimalPreview';
import { info } from 'console';

const ConnectWallet = dynamic(
    () => import('../ConnectWallet'),
    { ssr: false }
  ) 

const _provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER);

const animalColoringBookContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK,
  AnimalColoringBookArtifact.abi,
  _provider
);

const animalColoringBookEraser = new ethers.Contract(
  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK_ERASER,
  AnimalColoringBookEraserArtifact.abi,
  _provider
);


export default function AnimalColoringBookDetailView({id}){
    const [nftInfo, setNftInfo] = useState(null)
    const [web3Contract, setWeb3Contract] = useState(null)
    const [account, setAccount] = useState(null)

    const getInfo = async () => {
        if (id == undefined) {
            return 
        }
        var info = await getNFTInfo({Contract: animalColoringBookContract, tokenId: ethers.BigNumber.from(id + "")})
        const owner = await animalColoringBookContract.ownerOf(id + "")
        const transferHistory = await animalColoringBookContract.transferHistory(id + "")
        const [animalType, mood] = await animalColoringBookContract.animalInfo(id + "")
        info["owner"] = owner
        info['transferHistory'] = transferHistory
        info['animalType'] = animalType

        setNftInfo(info)
    }

    useEffect(()=> {
        getInfo()
    }, [id])

    const addressSetCallback = async (address) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setWeb3Contract(web3AnimalColoringBook(provider))
        setAccount(address)
      }
    
      const web3AnimalColoringBook = (provider) => {
        return new ethers.Contract(
        process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK,
        AnimalColoringBookArtifact.abi,
        provider.getSigner(0)
       );
      }

    return(
        <div>
             <div className='float-left'>
                 <Link href='/'> ← Animal Coloring Book </Link>
            </div>
             <ConnectWallet addressSetCallback={addressSetCallback}/>
            {nftInfo == null ? '' : <NFTInfo info={nftInfo} />}
            {nftInfo == null ? '' : <SequentialAnimalPreview type={nftInfo.animalType} history={nftInfo.transferHistory} />}
        </div>
    )
}

function NFTInfo({info}) {
    return(
        <div id='animal-detail-info-wrapper'>
            <div id='animal-coloring-book-image'>
                <Media media={info.mediaUrl} mediaMimeType={info.mediaMimeType} autoPlay={false}/>   
            </div>
            <fieldset >
    <legend> <h3 className='century'> {info.name}</h3> </legend>
            <p className='century'> Owned by {info.owner.slice(0,8)}...</p>
            <p><a target="_blank" href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK + "/" +  info.id}> View on OpenSea </a></p>
            
            <ColoringTransferHistory history={info.transferHistory} />
            </fieldset>
            
        </div>
        
    )
}

function ColoringTransferHistory({history}){
    const items = history.map((h,i) => {
        return <p className='century'> {i + 1}: {h.slice(0,8)}... </p>
    })

    return(
        <div id='transfer-history'>
            <p className='century'> Coloring transfer history</p>
            {items}
        </div>
    )
}
