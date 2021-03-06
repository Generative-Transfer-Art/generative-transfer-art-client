import React, { useState, useEffect } from 'react';
import { getSVG, getAnimalName, SmallAddressColorSquare } from './AnimalImage'
import svgToMiniDataURI from 'mini-svg-data-uri';
import { ethers } from "ethers";
import {addressH} from '../../lib/AnimalColoringBook/addressHSL';

export default function SequentialAnimalPreview() {
    const [animalType, setAnimalType] = useState(1);
    const [addr1, setAddr1] = useState("0x3E9bAE8AF3699730307f3096D4DF547e58Bd6e6F")
    const [addr2, setAddr2] = useState("0xc0A874CB3042E8f557819124c665ab6F34174Fca")
    const [addr3, setAddr3] = useState("0x80AEA4EEed34806a038841656C2EDe5F0dC45e95")
    const [addr4, setAddr4] = useState("0x491fd53e5E0D8b4A5F28d008856060Cda5380aaf")

    const toggleAnimal = () => {
        var n = Math.floor((Math.random() * 6 ) + 1)
        while(n == animalType){
            n = Math.floor((Math.random() * 6 ) + 1)
        }
        setAnimalType(n)
    }

    const newAddresses = () => {
        setAddr1(ethers.Wallet.createRandom().address)
        setAddr2(ethers.Wallet.createRandom().address)
        setAddr3(ethers.Wallet.createRandom().address)
        setAddr4(ethers.Wallet.createRandom().address)
        console.log('updated')
    }

    return(
        <div id='sequential-preview-wrapper'>
            <div id='preview-explainer'>
            <p className="century">Paste an address into any step to test its color. The furthest left image represents the coloring after the first transfer, the second to the left the coloring after the second transfer, and so on. </p>
            <p className='century text-btn' onClick={toggleAnimal}> Try a different animal. </p>
    
            </div>
            <PreviewWrapper animalType={animalType} address1={addr1} address2={addr2} address3={addr3} address4={addr4} />
            
        </div>
    )
}

function PreviewWrapper({animalType, address1, address2, address3, address4}){
    const [addr1, setAddr1] = useState(address1)
    const [addr2, setAddr2] = useState(address2)
    const [addr3, setAddr3] = useState(address3)
    const [addr4, setAddr4] = useState(address4)
    const [history1, setHistory1] = useState([addr1])
    const [history2, setHistory2] = useState([addr1, addr2])
    const [history3, setHistory3] = useState([addr1, addr2, addr3])
    const [history4, setHistory4] = useState([addr1, addr2, addr3, addr4])

    const updateAddr1 = (address) => {
        setAddr1(address) 
        setHistory1([address])
        setHistory2([address, addr2])
        setHistory3([address, addr2, addr3])
        setHistory4([address, addr2, addr3, addr4])
    }

    const updateAddr2 = (address) => {
        setAddr2(address) 
        setHistory2([addr1, address])
        setHistory3([addr1, address, addr3])
        setHistory4([addr1, address, addr3, addr4])
    }

    const updateAddr3 = (address) => {
        setAddr3(address) 
        setHistory3([addr1, addr2, address])
        setHistory4([addr1, addr2, address, addr4])
    }

    const updateAddr4 = (address) => {
        setAddr4(address) 
        setHistory4([addr1, addr2, addr3, address])
    }

    useEffect(() => {

    }, [address1, address2, address3, address4])


    return(
        <div>
            <AnimalPreviewItem 
            animalType={animalType}
            history={history1}
            address={addr1}
            addressChangeHandler={updateAddr1}
            />
            <AnimalPreviewItem 
            animalType={animalType}
            history={history2}
            address={addr2}
            addressChangeHandler={updateAddr2}
            />
            <AnimalPreviewItem 
            animalType={animalType}
            history={history3}
            address={addr3}
            addressChangeHandler={updateAddr3}
            />
            <AnimalPreviewItem 
            animalType={animalType}
            history={history4}
            address={addr4}
            addressChangeHandler={updateAddr4}
            />
        </div>
    )
}

function AnimalPreviewItem({animalType, history, address, addressChangeHandler}) {
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
        console.log("here")
        addressChangeHandler(address)
    }


    return(
        <div className='sequential-review-item'>   
            <div className='sequential-review-vertical-items'>
                <img className='image-preview' src={svgToMiniDataURI(getSVG(animalType, history))} /> 
                <div className='addr-input'> 
                    <SmallAddressColorSquare address={address} />
                    <input className='float-left short-address-input' value={localAddress} onChange={handleChange} /> 
                </div>
                {error ? <p className='error'> invalid address </p>: <br/> }
            </div>
        </div>
)
}