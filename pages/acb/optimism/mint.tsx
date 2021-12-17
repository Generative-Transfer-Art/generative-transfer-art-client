import { ethers } from "ethers"
import { useMemo, useState } from "react"
import dynamic from 'next/dynamic'
import AnimalColoringBookArtifact from "../../../contracts/OtterColoringBook.json";
import AnimalColoringBookEraserArtifact from "../../../contracts/AnimalColoringBookEraser.json";

const ConnectWallet = dynamic(
    () => import('../../../components/AnimalColoringBook/ConnectWallet'),
    { ssr: false }
  ) 

const _provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_OPTIMISM_JSON_RPC_PROVIDER);

const animalColoringBookContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_OPTIMISM_ANIMAL_COLORING_BOOK,
  AnimalColoringBookArtifact.abi,
  _provider
);

const animalColoringBookEraser = new ethers.Contract(
  process.env.NEXT_PUBLIC_OPTIMSIM_ANIMAL_COLORING_BOOK_ERASER,
  AnimalColoringBookEraserArtifact.abi,
  _provider
);

export default function OtterMint(){
    const [ account, setAccount] = useState(null)
    return(
        <div id="home-wrapper">
        <h1> MAKE SURE YOU ARE ON OPTIMISM NETWORK IN YOUR WALLET </h1>
        <ConnectWallet addressSetCallback={setAccount}/>
        {account == null ? '' :
        <Mint account={account} mintCallBack={() => {}}/>
        }
        <p>Warning! Use at your own risk. This is untested code. It is just for fun. There is no scarcity, anyone can mint forever.</p>
        </div>
    )
}

function Mint({account, mintCallBack}){
    const [transactionHash, setTransactionHash] = useState("")
    const [coloringBookID, setColoringBookId] = useState(null)
    const [tip, setTip] = useState('0')
    const [landed, setLanded] = useState(false)

    const handleChange = (e) => {
        setTip(e.target.value)
    }

    const contract = useMemo(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        return new ethers.Contract(
            process.env.NEXT_PUBLIC_OPTIMISM_ANIMAL_COLORING_BOOK,
            AnimalColoringBookArtifact.abi,
            provider.getSigner(0)
           );
    }, [])
  
    const mint = async () => {
      setTransactionHash("")
      setColoringBookId(null)
      console.log(ethers.utils.parseUnits(tip, 18))
      var options = { value: ethers.utils.parseUnits(tip, 18) };
      const t = await contract.mint(account, true, options)
      setTransactionHash(t.hash)
      t.wait().then((receipt) => {
          waitForEvent()
        })
        .catch(err => {
          console.log(err)
        })
    }
  
    const waitForEvent = async () => {
      const filter = contract.filters.Transfer(null, account)
        contract.once(filter, (from, to, id) => {
          setColoringBookId(id.toString())
            setLanded(true)
        }
      )
    }
  
    return (
      <fieldset className='animal-mint-box float-left'>
          <p> Minting is free, but you can leave a tip! </p>
          <div className='float-left gtap1-input'>
      <input className='short-address-input' placeholder='tip (ETH)' onChange={handleChange}/>
      </div>
      <button onClick={mint}> mint </button>
      <div>
      {
                    transactionHash == "" ? "" :
                <div>
                    <a target="_blank" href={process.env.NEXT_PUBLIC_OPTIMISM_ETHERSCAN_URL + "/tx/" +  transactionHash}> See transaction on Etherscan</a>
                    {landed ? <p> Success ! See it  <a href={`https://generative-transfer-art.vercel.app/acb/optimism/${coloringBookID}`}> here </a> </p> : <p>Waiting for tx...</p>}
                </div>
                }
      </div>
      </fieldset>
    )
  }
  