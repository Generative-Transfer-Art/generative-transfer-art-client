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
    const [web3EraserContract, setWeb3EraserContract] = useState(null)
    const [account, setAccount] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [hasEraser, setHasEraser] = useState(false)

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
        const eraser = await animalColoringBookContract.eraserContract()

        setNftInfo(info)
    }

    useEffect(()=> {
        getInfo()
    }, [id])

    const addressSetCallback = async (address) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setWeb3Contract(web3AnimalColoringBook(provider))
        setWeb3EraserContract(web3AnimalColoringBookEraser(provider))
        setAccount(address)
        const owner = await animalColoringBookContract.ownerOf(id + "")
        setIsOwner(address == owner)
        const eraserCount = await animalColoringBookEraser.balanceOf(address)
        setHasEraser(parseInt(eraserCount.toString()) > 0)
      }
    
      const web3AnimalColoringBook = (provider) => {
        return new ethers.Contract(
        process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK,
        AnimalColoringBookArtifact.abi,
        provider.getSigner(0)
       );
      }

      const web3AnimalColoringBookEraser = (provider) => {
        return new ethers.Contract(
        process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK_ERASER,
        AnimalColoringBookEraserArtifact.abi,
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
            {nftInfo == null || !isOwner ? '' : <SequentialAnimalPreview contract={web3Contract} nftInfo={nftInfo} callback={getInfo}/>}
            {nftInfo != null && hasEraser && isOwner ? <Erase eraserContract={web3EraserContract} coloringBookContract={web3Contract} nftInfo={nftInfo} callback={getInfo}/> : ''}
            <div id='footer'></div>
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

function Erase({eraserContract, coloringBookContract, nftInfo, callback}){
    const [id, setId] = useState(null)
    const [approveDisabled, setApprovedDisabled] = useState(true)
    const [eraseDisabled, setEraseDisabled] = useState(true)
    const [doNotOwnError, setDoNotOwnError] = useState(false)
    const [invalidIDError, setInvalidIDError] = useState(false)
    const [transactionHash, setTransactionHash] = useState("")
    const [landed, setLanded] = useState(false)

    const handleChange = async (event) => {
        setId(event.target.value.trim())
    }

    const update = async (id) => {
        if(id==null){
            return
        }
        reset()
        setApprovedDisabled(true)
        setEraseDisabled(true)
        if (id == ''){
            return
        }
        var error = false
        const owner = await animalColoringBookEraser.ownerOf(id).catch((e) => {
            error = true
        })
        if (error){
            setInvalidIDError(true)
            return
        }
        const isOwner = nftInfo.owner == owner;
        setDoNotOwnError(!isOwner)
        if (!isOwner){
            return
        }
        const approved = await animalColoringBookEraser.getApproved(id)
        const isApproved = approved.includes(process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK)
        if (!isApproved) {
            setApprovedDisabled(false)
            return
        }
        setEraseDisabled(false)
    }

    const reset = () => {
        setDoNotOwnError(false)
        setInvalidIDError(false)
    }

    useEffect(() => {
        const timeOutId = setTimeout(() => update(id), 500);
        return () => clearTimeout(timeOutId);
      }, [id]);

    const approve = async () => {
        setTransactionHash("")
    
        const t = await eraserContract.approve(process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK, id)
        setTransactionHash(t.hash)
        t.wait().then((receipt) => {
            waitForApproval()

        })
        .catch(err => {
        console.log(err)
        })
    }

    const waitForApproval = async () => {
        const filter = eraserContract.filters.Approval(nftInfo.owner, process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK, ethers.BigNumber.from(id))
        eraserContract.once(filter, (from, to, tokenID) => {
            setApprovedDisabled(true)
            setEraseDisabled(false)
            setLanded(true)
        })
    }

    const erase = async () => {
        setTransactionHash("")
        setLanded(false)
    
        const t = await coloringBookContract.erase(nftInfo.id, ethers.BigNumber.from(id))
        setTransactionHash(t.hash)
        t.wait().then((receipt) => {
            waitForErase()

        })
        .catch(err => {
        console.log(err)
        })
    }

    const waitForErase = async () => {
        const filter = eraserContract.filters.Transfer(nftInfo.owner, null, ethers.BigNumber.from(id))
        eraserContract.once(filter, (from, to, tokenID) => {
            setLanded(true)
            callback()
            
        })
    }

    return(
        <div>
            <fieldset id='eraser-fieldset'>
                <legend> <h3 className='century'> Erase </h3> </legend>
                <p> Animal Coloring Book Erasers can be used to erase an Animal Coloring Book, clearing all colors and mood. The animal type is unaffected. The eraser will be burned in the process and can never be used again.</p>
                <input placeholder="Enter eraser ID #" onChange={handleChange} onFocus={reset}/>
                <button className='btn small-space' disabled={approveDisabled} onClick={approve}> approve animal coloring book to burn eraser </button>
                <button className='btn small-space' disabled={eraseDisabled} onClick={erase}> erase </button>
                <br/>
                {doNotOwnError ? <p>You do not own this eraser</p> : ''}
                {invalidIDError ? <p>Invalid eraser ID</p> : ''}
                {
                    transactionHash == "" ? "" :
                <div>
                    <a target="_blank" href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>
                    {landed ? '' : <p>Waiting for tx...</p>}
                </div>
                }
            </fieldset>
            
        </div>
    )
}
