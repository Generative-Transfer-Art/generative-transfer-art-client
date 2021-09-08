import React, { useState, useEffect } from 'react';
import { getSVG, getAnimalName, SmallAddressColorSquare } from '../AnimalImage'
import svgToMiniDataURI from 'mini-svg-data-uri';
import { ethers } from "ethers";

export default function SequentialAnimalPreview({contract, nftInfo, callback}) {


    return(
        <div id='sequential-preview-wrapper'>
            <div id='preview-explainer'>
                <h2 className='century'> Preview coloring</h2>
                <p> See how transferring to different addresses will color your image. Image is colored left to right: background, head, nose and mouth, and eyes. Transfers must be done in left to right order to match image shown below.</p>
            </div>
            <PreviewWrapper contract={contract} nftInfo={nftInfo} callback={callback} />
            
        </div>
    )
}

function PreviewWrapper({contract, nftInfo, callback}){
    const [addr1, setAddr1] = useState(nftInfo.transferHistory.length > 0 ? nftInfo.transferHistory[0] : null)
    const [addr2, setAddr2] = useState(nftInfo.transferHistory.length > 1 ? nftInfo.transferHistory[1] : null)
    const [addr3, setAddr3] = useState(nftInfo.transferHistory.length > 2 ? nftInfo.transferHistory[2] : null)
    const [addr4, setAddr4] = useState(nftInfo.transferHistory.length > 3 ? nftInfo.transferHistory[3] : null)
    const [history1, setHistory1] = useState(nftInfo.transferHistory)
    const [history2, setHistory2] = useState(nftInfo.transferHistory)
    const [history3, setHistory3] = useState(nftInfo.transferHistory)
    const [history4, setHistory4] = useState(nftInfo.transferHistory)

    const updateAddr1 = (address) => {
        setAddr1(address) 
        setHistory1([address])
        if(addr2 != null){
            setHistory2([address, addr2])
            if(addr3 != null){
                setHistory3([address, addr2, addr3])
                if(addr4 != null){
                    setHistory4([address, addr2, addr3, addr4])
                } else {
                    setHistory4([address, addr2, addr3])
                }
            } else {
                setHistory3([address, addr2])
                setHistory4([address, addr2])
            }
        } else {
            setHistory2([address])
            setHistory3([address])
            setHistory4([address])
        }
    }

    const updateAddr2 = (address) => {
        setAddr2(address) 
        setHistory2([addr1, address])
        if(addr3 != null){
            setHistory3([addr1, address, addr3])
            if(addr4 != null){
                setHistory4([addr1, address, addr3, addr4])
            } else {
                setHistory4([addr1, address, addr3])
            }
        } else {
            setHistory3([addr1, address])
            setHistory4([addr1, address])
        }
        
    }

    const updateAddr3 = (address) => {
        setAddr3(address) 
        setHistory3([addr1, addr2, address])
        if(addr4 != null){
            setHistory4([addr1, addr2, address, addr4])
        } else {
            setHistory4([addr1, addr2, address])
        }
    }

    const updateAddr4 = (address) => {
        setAddr4(address) 
        setHistory4([addr1, addr2, addr3, address])
    }


    return(
        <div>
            <AnimalPreviewItem 
            contract={contract}
            disabled={nftInfo.transferHistory.length > 0}
            nftInfo={nftInfo}
            history={history1}
            address={addr1}
            addressChangeHandler={updateAddr1}
            isNextTransfer={nftInfo.transferHistory.length == 0}
            callback={callback}
            />
            <AnimalPreviewItem 
            contract={contract}
            disabled={nftInfo.transferHistory.length > 1 || history2.length < 1}
            nftInfo={nftInfo}
            history={history2}
            address={addr2}
            addressChangeHandler={updateAddr2}
            isNextTransfer={nftInfo.transferHistory.length == 1}
            callback={callback}
            />
            <AnimalPreviewItem 
            contract={contract}
            disabled={nftInfo.transferHistory.length > 2 || history2.length < 2}
            nftInfo={nftInfo}
            history={history3}
            address={addr3}
            addressChangeHandler={updateAddr3}
            isNextTransfer={nftInfo.transferHistory.length == 2}
            callback={callback}
            />
            <AnimalPreviewItem 
            contract={contract}
            disabled={nftInfo.transferHistory.length > 3 || history3.length < 3}
            nftInfo={nftInfo}
            history={history4}
            address={addr4}
            addressChangeHandler={updateAddr4}
            isNextTransfer={nftInfo.transferHistory.length == 3}
            callback={callback}
            />
        </div>
    )
}

function AnimalPreviewItem({contract, disabled, nftInfo, history, address, addressChangeHandler, isNextTransfer, callback}) {
    const [localAddress, setLocalAddress] = useState(address)
    const [error, setError] = useState(false)
    const [transactionHash, setTransactionHash] = useState("")
    const [landed, setLanded] = useState(false)

    const handleChange = (event) => {
        setError(false)
        const address = event.target.value
        setLocalAddress(address)
        if(!ethers.utils.isAddress(address)){
            setError(true)
            return
        }
        addressChangeHandler(address)
    }

    const transfer = async () => {
        setTransactionHash("")
        var options = { gasLimit: 200000, value: ethers.utils.parseUnits("0.2", 18) };
        const t = await contract.transferFrom(nftInfo.owner, address, nftInfo.id, {gasLimit: 85000})
        setTransactionHash(t.hash)
        t.wait().then((receipt) => {
            waitForEvent()

          })
          .catch(err => {
            console.log(err)
          })
      }
    
    const waitForEvent = async () => {
        const filter = contract.filters.Transfer(null, address)
        contract.once(filter, (from, to, id) => {
            callback()
            setLanded(true)
        })
    }
    


    return(
        <div className='sequential-review-item'>   
            <div className='sequential-review-vertical-items'>
               
                <img className='image-preview' src={svgToMiniDataURI(getSVG(nftInfo.animalType, history))} /> 
                <div className='addr-input'> 
                    {address==null ? '' : <SmallAddressColorSquare address={address} /> }
                    <input className='float-left short-address-input' disabled={disabled} placeholder={'Enter address to see color'} value={localAddress} onChange={handleChange} /> 
                </div>
                {error ? <p className='error'> invalid address </p>: <br/> }
                {address==null || !isNextTransfer || contract == null ||  transactionHash != "" ? '' : <button onClick={transfer} className='btn'> Transfer</button> }
                {
                    transactionHash == "" ? "" :
                    <div>
                        <a target="_blank" href={process.env.NEXT_PUBLIC_ETHERSCAN_URL + "/tx/" +  transactionHash}> Etherscan</a>
                        {landed ? '' : <p>Waiting for tx...</p>}
                    </div>
                }
            </div>
        </div>
)
}