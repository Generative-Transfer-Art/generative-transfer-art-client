import React, { useState, useEffect } from 'react';
import { getSVG, getAnimalName, SmallAddressColorSquare } from '../AnimalImage'
import svgToMiniDataURI from 'mini-svg-data-uri';
import { ethers } from "ethers";

export default function SequentialAnimalPreview({type, history}) {
    const [animalType, setAnimalType] = useState(type);
    const [addr1, setAddr1] = useState("0x3E9bAE8AF3699730307f3096D4DF547e58Bd6e6F")
    const [addr2, setAddr2] = useState("0xc0A874CB3042E8f557819124c665ab6F34174Fca")
    const [addr3, setAddr3] = useState("0x80AEA4EEed34806a038841656C2EDe5F0dC45e95")
    const [addr4, setAddr4] = useState("0x491fd53e5E0D8b4A5F28d008856060Cda5380aaf")


    return(
        <div id='sequential-preview-wrapper'>
            <div id='preview-explainer'>
                <h2 className='century'> Preview coloring</h2>
                <p> See how transferring to different addresses will color your image. Image is colored left to right: background, head, nose and mouth, and eyes. Transfers must be done in left to right order to match image shown below.</p>
            </div>
            <PreviewWrapper animalType={animalType} history={history} length={history.length} />
            
        </div>
    )
}

function PreviewWrapper({animalType, history, length}){
    const [addr1, setAddr1] = useState(length > 0 ? history[0] : null)
    const [addr2, setAddr2] = useState(length > 1 ? history[1] : null)
    const [addr3, setAddr3] = useState(length > 2 ? history[2] : null)
    const [addr4, setAddr4] = useState(length > 3 ? history[3] : null)
    const [history1, setHistory1] = useState(history)
    const [history2, setHistory2] = useState(history)
    const [history3, setHistory3] = useState(history)
    const [history4, setHistory4] = useState(history)

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
            disabled={length > 0}
            animalType={animalType}
            history={history1}
            address={addr1}
            addressChangeHandler={updateAddr1}
            />
            <AnimalPreviewItem 
            disabled={length > 1 || history2.length < 1}
            animalType={animalType}
            history={history2}
            address={addr2}
            addressChangeHandler={updateAddr2}
            />
            <AnimalPreviewItem 
            disabled={length > 2 || history2.length < 2}
            animalType={animalType}
            history={history3}
            address={addr3}
            addressChangeHandler={updateAddr3}
            />
            <AnimalPreviewItem 
            disabled={length > 3 || history3.length < 3}
            animalType={animalType}
            history={history4}
            address={addr4}
            addressChangeHandler={updateAddr4}
            />
        </div>
    )
}

function AnimalPreviewItem({disabled, animalType, history, address, addressChangeHandler}) {
    const [localAddress, setLocalAddress] = useState(address)
    const [error, setError] = useState(false)

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


    return(
        <div className='sequential-review-item'>   
            <div className='sequential-review-vertical-items'>
               
                <img className='image-preview' src={svgToMiniDataURI(getSVG(animalType, history))} /> 
                <div className='addr-input'> 
                    {address==null ? '' : <SmallAddressColorSquare address={address} /> }
                    <input className='float-left short-address-input' disabled={disabled} placeholder={'Enter address to see color'} value={localAddress} onChange={handleChange} /> 
                </div>
                {error ? <p className='error'> invalid address </p>: <br/> }
            </div>
        </div>
)
}