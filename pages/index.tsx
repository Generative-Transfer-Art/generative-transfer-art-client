import Head from 'next/head'
import dynamic from 'next/dynamic'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import AnimalColoringBookArtifact from "../contracts/AnimalColoringBook.json";
import AnimalColoringBookEraserArtifact from "../contracts/AnimalColoringBookEraser.json";
import getNFTInfo from '../lib/getNFTInfo';
import SequentialAnimalPreview from '../components/AnimalColoringBook/SequentialAnimalPreview'
import { gtap1SnapShot } from '../lib/AnimalColoringBook/gtap1Snapshot'
import MerkleTree from '../lib/AnimalColoringBook/merkleTree'
// import MerkleTree from '../lib/AnimalColoringBook/Merkle2'


const ConnectWallet = dynamic(
    () => import('../components/AnimalColoringBook/ConnectWallet'),
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

const toBuffer = (address) => {
  return Buffer.from(
    ethers.utils.solidityKeccak256(['address'], [address]).substr(2),
    'hex'
  )
}

export default function Home(){
  const [web3Contract, setWeb3Contract] = useState(null)
  const [projectState, setProjectState] = useState(null)
  const [isEarlyMintEligable, setIsEarlyMintEligable] = useState(false)
  const [account, setAccount] = useState(null)
  const [merkleTree, setMerkleTree] = useState(null)
  const [merkleProof, setMerkleProof] = useState(null)
  const [holderMintCount, setHolderMintCount] = useState(null)

  // const elements = gtap1SnapShot.addresses.map(m =>ethers.utils.keccak256(m))
  // elements.sort(Buffer.compare)
  // const merkleTree = new MerkleTree(gtap1SnapShot.addresses.map(m => ethers.utils.getAddress(m)));
  

  const getProjectState = async () => {
    const minted = await animalColoringBookContract.totalSupply()
    const publicStartBlock = await animalColoringBookContract.publicMintintingOpenBlock()
    const curBlock = await _provider.getBlockNumber();
    var state = {
      minted: minted.toString(),
      remaining: ethers.BigNumber.from(1000).sub(minted).toString(),
      publicStartBlock: publicStartBlock.toString(),
      curBlock: curBlock.toString()
    }
    setProjectState(state);
  }

  const setup = () => {
    const merkleTree = new MerkleTree(gtap1SnapShot.addresses.map(m => {
      console.log(m)
      return toBuffer(m)
    }))
    console.log('root')
    console.log(merkleTree.getHexRoot())
    setMerkleTree(merkleTree)
    getProjectState()
  }

  useEffect(() => {
    setup()
  }, [])

  

  

  const addressSetCallback = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setWeb3Contract(web3AnimalColoringBook(provider))
    setIsEarlyMintEligable(gtap1SnapShot.addresses.includes(address))
    setAccount(address)
    if(isEarlyMintEligable){
      setMerkleProof(merkleTree.getHexProof(toBuffer(address)))
    }
    const count = await animalColoringBookContract.gtapHolderMintCount(address)
    setHolderMintCount(count.toString())
  }

  const web3AnimalColoringBook = (provider) => {
    return new ethers.Contract(
    process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK,
    AnimalColoringBookArtifact.abi,
    provider.getSigner(0)
   );
  }

  return (
   
   <div id="home-wrapper">
     <Head>
        <title>{"Generative Transfer Art"}</title>
        <link
            rel="preload"
            href="/fonts/CenturySchl-Roma.ttf"
            as="font"
            crossOrigin=""
          />
      </Head>
      <ConnectWallet addressSetCallback={addressSetCallback}/>
      
    <h1 className="century">  Animal Coloring Book </h1>
    <p className="century"> This is a Generative Transfer Art project, building off of <a href="https://opensea.io/collection/wgtap1-og">GTAP1</a>. Each NFT can be one of six Animals, but each begins as a blank canvas. The first four times the NFT is transferred, a color is filled in based on the recipient's address. On the fourth transfer, the Animal's mood is revealed - the coloring and animation of its eyes.  The 10x10 SVG art and animation are generated and stored entirely on-chain.</p>
    <SequentialAnimalPreview />
    <MintingSection info={projectState} />
    <br/>
    { account == null ? 
    <p className="century blue"> Connect address to see minting options</p>
    :
    <div>
    {projectState  == null ? ''
    : 
    <div>
      { isEarlyMintEligable ? 
      <p className="century blue"> You are eligable for early minting. You can mint 2 Animal Coloring Books and additional 1 for free if you own a GTAP1 original.</p>
      :
    <EligabilityExplainer info={projectState} />
    }
    </div>
    }
    <br/>
    {account == null ? "" :
    <div>
      <div id='mint-box-wrapper'>
        <MintAnimal account={account} merkleProof={merkleProof} contract={web3Contract} mintCallBack={getProjectState}/>
        <MintAnimalAndEraser account={account} merkleProof={merkleProof} contract={web3Contract} mintCallBack={getProjectState}/>
        <br/>
      </div>
      <GTAP1OG account={account} contract={web3Contract} mintCallBack={getProjectState}/>
    </div>
    }
    </div>
    }
   </div>
      
  )
}

function GTAP1OG({account, contract, mintCallBack}){
  const [transactionHash, setTransactionHash] = useState("")
  const [coloringBookID, setColoringBookId] = useState(null)
  const [eraserID, setEraserID] = useState(null)
  const [value, setValue] = useState("")

  const handleChange = (event) => {
    setValue(event.target.value)
}

  const mint = async () => {
    setTransactionHash("")
    setColoringBookId(null)
    const t = await contract.gtap1OGHolderMint(account, value.trim())
    setTransactionHash(t.hash)
    t.wait().then((receipt) => {
        waitForEvent()
        mintCallBack()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const waitForEvent = async () => {
    const filter = contract.filters.Transfer(null, account)
      contract.once(filter, (from, to, id) => {
        setColoringBookId(id.toString())
      }
    )
    const eraserFilter = animalColoringBookEraser.filters.Transfer(null, account)
      contract.once(eraserFilter, (from, to, id) => {
        setEraserID(id.toString())
      }
    )
  }

  return(
    <div id='gtap1-og-wrapper'>
    <h2 className='century'> GTAP1 Original Holders </h2>
    <p className='century'>To holders of GTAP1 originals, thank you for experimenting! We’re saving an animal and eraser for you. Enter the token ID if you have one to claim.</p>
    <div>
     <div className='float-left gtap1-input'>
      <input className='short-address-input' value={value} placeholder='TokenID' onChange={handleChange}/> 
      </div>
      <div className='gtap-mint-button' onClick={mint}> Mint Animal + Eraser </div>
    </div>
    {
      transactionHash == "" ? "" :
      <a target="_blank" href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>
    }

    {
      coloringBookID == null ? 
      <div>
      {
        transactionHash == "" ? "" :
        "Waiting for transaction to land on chain..."
      }
      </div>
      :
      <div> 
        <p > Successfully minted Animal Coloring Book #{coloringBookID} - 
        <a target="_blank" href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK + "/" +  coloringBookID}> View Animal Coloring Book On OpenSea </a> </p>
        {
          eraserID == null ? "" :
          <p >Successfully minted Eraser #{coloringBookID} - 
          <a target="_blank" href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK_ERASER + "/" +  eraserID}> View Eraser On OpenSea </a></p>
        }
      </div>
      
    }
    </div>
  )
}

function MintAnimal({account, merkleProof, contract, mintCallBack}){
  const [transactionHash, setTransactionHash] = useState("")
  const [coloringBookID, setColoringBookId] = useState(null)

  const mint = async () => {
    setTransactionHash("")
    setColoringBookId(null)
    const t = await contract.gtap1HolderMint(account, true, merkleProof, {value: ethers.utils.parseUnits("0.3", 18)})
    setTransactionHash(t.hash)
    t.wait().then((receipt) => {
        waitForEvent()
        mintCallBack()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const waitForEvent = async () => {
    const filter = contract.filters.Transfer(null, account)
      contract.once(filter, (from, to, id) => {
        setColoringBookId(id.toString())
      }
    )
  }

  return (
    <fieldset className='animal-mint-box float-left'>
    <legend> <h3 className='century'> Animal</h3> </legend>
    <div className='images'> 
    <img src="mystery.svg" />
    </div>
    <div className='mint-button' onClick={mint}> Mint for 0.2 ETH </div>
    {
      transactionHash == "" ? "" :
      <a target="_blank" href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>
    }

    {
      coloringBookID == null ? 
      <div>
      {
        transactionHash == "" ? "" :
        "Waiting for transaction to land on chain..."
      }
      </div>
      :
      <div> 
        <p > Successfully minted Animal Coloring Book #{coloringBookID} - 
        <a target="_blank" href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK + "/" +  coloringBookID}> View Animal Coloring Book On OpenSea </a> </p>
      </div>
    }
    </fieldset>
  )
}

function MintAnimalAndEraser({account, merkleProof, contract, mintCallBack}){
  const [transactionHash, setTransactionHash] = useState("")
  const [coloringBookID, setColoringBookId] = useState(null)
  const [eraserID, setEraserID] = useState(null)

  const mint = async () => {
    setTransactionHash("")
    setColoringBookId(null)
    const t = await contract.gtap1HolderMint(account, true, merkleProof, {value: ethers.utils.parseUnits("0.3", 18)})
    setTransactionHash(t.hash)
    t.wait().then((receipt) => {
        waitForEvent()
        mintCallBack()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const waitForEvent = async () => {
    const filter = contract.filters.Transfer(null, account)
      contract.once(filter, (from, to, id) => {
        setColoringBookId(id.toString())
      }
    )
    const eraserFilter = animalColoringBookEraser.filters.Transfer(null, account)
      contract.once(eraserFilter, (from, to, id) => {
        setEraserID(id.toString())
      }
    )
  }

  return (
    <fieldset className='animal-mint-box float-left'>
    <legend> <h3 className='century'> Animal + Eraser</h3> </legend>
    <div className='images'> 
    <img className='float-left' src="mystery.svg" />
    <img className='float-left' src="ERASER.svg" />
    </div>
    <div className='mint-button' onClick={mint}> Mint for 0.3 ETH </div>
    {
      transactionHash == "" ? "" :
      <a target="_blank" href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>
    }

    {
      coloringBookID == null ? 
      <div>
      {
        transactionHash == "" ? "" :
        "Waiting for transaction to land on chain..."
      }
      </div>
      :
      <div> 
        <p > Successfully minted Animal Coloring Book #{coloringBookID} - 
        <a target="_blank" href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK + "/" +  coloringBookID}> View Animal Coloring Book On OpenSea </a> </p>
        {
          eraserID == null ? "" :
          <p >Successfully minted Eraser #{coloringBookID} - 
          <a target="_blank" href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK_ERASER + "/" +  eraserID}> View Eraser On OpenSea </a></p>
        }
      </div>
      
    }
    </fieldset>
  )
}


function EligabilityExplainer({info}){
  return(
    <div>
      {parseInt(info.curBlock) >= parseInt(info.publicStartBlock) ? '' :
        <p className="century blue"> Minting is currently limited to GTAP1 holders (Snapshot taken 10PM ET August 29). The address you are connected with is not eligible for early minting. Public minting will start at block {info.publicStartBlock}, roughly 11PM ET August 29.</p>
      }
    </div>
  )
}



function MintingSection({info}){
  
  return(
    <div>
      <h2 className="century">  Minting </h2>
      { info == null ? '' : <h3 className="century"> {info.minted} of 1000 minted </h3> }
      <p className="century"> Minting will give you a brand new Animal in a blank state. When minting, you have the option to purchase an Eraser as well. The Eraser is a separate, one-time use NFT that can be used to clear all the colors from any Animal you own. Erasers can only be created when minting Animals and will not be available once minting is over. </p>
    </div>

  )
}

// function MintController({mintFee, mintCallBack}) {
//   const [artTransferContractWeb3, setArtTransferContractWeb3] = React.useState(null)
//   const [providerAvailable, setProviderAvailable] = useState(null)
//   const [account, setAccount] = React.useState(null)
//   const [transactionHash, setTransactionHash] = useState("")
//   const [id, setId] = useState(null)

//   const setup = async () => {
//     if(window.ethereum == null){
//       setProviderAvailable(false)
//       return
//     }
//     setProviderAvailable(true)

//     const provider = new ethers.providers.Web3Provider(window.ethereum)
//     setArtTransferContractWeb3(createWeb3ArtTransfers(provider))
//   }

//   const createWeb3ArtTransfers = (provider) => {
//     return new ethers.Contract(
//      process.env.NEXT_PUBLIC_CONTRACT,
//      TransferArtArtifact.abi,
//      provider.getSigner(0)
//    );
//   }

//   const getAccount = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = accounts[0]
//     setAccount(account)
//     window.ethereum.on('accountsChanged', function (accounts) {
//       console.log("accounts changed")
//       setAccount(accounts[0])
//     })
//   }

//   const mint = async () => {
//     setTransactionHash("")
//     setId(null)
//     const t = await artTransferContractWeb3.mint(account, {value: ethers.utils.parseUnits(mintFee, 18)})
//     setTransactionHash(t.hash)
//     t.wait().then((receipt) => {
//         waitForEvent()
//         mintCallBack()
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }

//   const waitForEvent = async () => {
//     const filter = transferArtContract.filters.Transfer(null, account)
//     console.log(filter)
//     transferArtContract.once(filter, (from, to, id) => {
//       console.log("id!")
//       console.log(id.toString())
//       loadMedia(id)
//       setId(id.toString())
      
//     }
//     )
//   }

//   const loadMedia = async (id) => {
//     var x = await getNFTInfo({Contract: transferArtContract, tokenId: id})
//     console.log(x)
//   }

//   useEffect(() => {
//     setup()
//   }, [])

//   return(
//     <div>
//       {
//       account != null ? 
//       <div className="btn" onClick={mint}> <img src="mint_button.svg" /> </div>:
//       <div>
//         {
//           providerAvailable == null ? 
//           ""
//           :
//           <div>
//           { providerAvailable ? 
//           <div className="btn" onClick={getAccount}> <img src="connect_wallet.svg" /> </div> : 
//           "In order to mint, please use Chrome + Metamask"
//         } 
//         </div>
//         }
//       </div>
//       }
//       {
//         transactionHash == "" ? "" :
//         <a target="_blank" href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>

//       }

//       {
//         id == null ? 
//         <div>
//         {
//           transactionHash == "" ? "" :
//           "Waiting for transaction to land on chain..."
//         }
//         </div>
//         :
//         <div> 
//           Successfully minted #{id} - 
//           <a target="_blank" href={process.env.NEXT_PUBLIC_OPENSEA_URL + "/assets/" +  process.env.NEXT_PUBLIC_CONTRACT + "/" +  id}> View On OpenSea </a>
//         </div>

//       }
//     </div>
//   )
// }

