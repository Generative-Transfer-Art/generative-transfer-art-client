import dynamic from 'next/dynamic'
import React, { ChangeEvent, useState, useEffect, useMemo } from 'react';
import { ethers } from "ethers";
import AnimalColoringBookArtifact from "../../contracts/AnimalColoringBook.json";
import debounce from 'lodash/debounce';
import { sign } from 'crypto';

const ConnectWallet = dynamic(
    () => import('../../components/AnimalColoringBook/ConnectWallet'),
    { ssr: false }
  ) 

const WAIT_DURATION_IN_MILLISECONDS = 500

const _provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER);

const animalColoringBookContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_ANIMAL_COLORING_BOOK,
  AnimalColoringBookArtifact.abi,
  _provider
);

export default function ClaimSweaterView(){
    const [account, setAccount] = useState(null)
    const [isACBOwner, setIsACBOwner] = useState(false)

    const handleSetAccount = async (account) => {
        const balance = await animalColoringBookContract.balanceOf(account)
        setIsACBOwner(balance.gt(0))
        setAccount(account)
    }
    return(
        <div id='sweater-page'>
            <p>Any holder of a fully colored Animal Coloring Book NFT can claim a crew neck sweater with a cat, it looks like this</p>
            <img src='../acb_sweater.jpeg' />
            <ConnectWallet addressSetCallback={handleSetAccount}/>
            { account == null ?
                ''
                :
                <div>
                    { isACBOwner ? 
                        <InfoForm account={account} />
                        :
                        <p> address does not own any animal coloring books </p>
                    }
                    
                </div>
            }
        </div>
    )
}


const InfoForm = ({account}) => {
    const [tokenId, setTokenId] = useState('')
    const [addr1, setAddr1] = useState('')
    const [addr2, setAddr2] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [signature, setSignature] = useState('')
    const [variantId, setVariantId] = useState('')
    const [postal, setPostal] = useState('')
    const [responseError, setResponseError] = useState('')
    const [success, setSuccess] = useState(false)

    const getSignature = async () => {
        try {
            const msg = "I consent to have this mailling address stored and used for shipping Animal Coloring Book related items"
            const ethResult = await window.ethereum.request({
              method: 'personal_sign',
              params: [account, msg],
            });
            console.log(ethResult)
            setSignature(ethResult)
          } catch (err) {
            console.error(err);
          }
    }

    const isDisabled = () => {
        return addr1 == '' ||
        city == '' ||
        state == '' ||
        country == '' ||
        signature == ''
    }

    const submit = async () => {
        const data = {
            variantId: variantId, 
            address: account, 
            tokenId: tokenId,
            signature: signature,
            mailingInfo: {
                address1: addr1,
                address2: addr2,
                country: country, 
                state: state, 
                city: city, 
                postal: postal
            }
        }
        const response = await fetch('https://ACBSwag.wilsonc.repl.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status >= 400 && response.status < 600) {
              }
              return response.json();
        })
        .then((data) => {
            const e = data.error
            setResponseError(e)
            if(e == ''){
                setSuccess(true)
            }
        })
        .catch((error) => {
            console.log(error)
        })

    
        


    }

    return(
        <div id='info-form'>
            <TokenIDEntry account={account} setTokenId={setTokenId} />
            <br/>
            <Input placeholder={'address'} setValue={setAddr1}/>
            <Input placeholder={'address line 2 (optional)'} setValue={setAddr2}/>
            <Input placeholder={'city'} setValue={setCity}/>
            <Input placeholder={'state/province/prefecture'} setValue={setState}/>
            <Input placeholder={'country'} setValue={setCountry}/>
            <Input placeholder={'Postal/Zip code'} setValue={setPostal}/>
            <div>
                <p> size (unisex) </p>
            <SizePicker setVariantId={setVariantId} />
            </div>
            <br/>
            <button onClick={getSignature}> Sign Message </button>
            <button onClick={submit} disabled={isDisabled()}> Submit </button>
            <div>
                {responseError == '' ? '' : 
                <p className='error'>Server Error: {responseError}</p>
                }
            </div>
            <div>
                {
                    success ? 
                    <p> success! </p> : ''
                }
            </div>
            <div id='footer'></div>
        </div>
    )
}


const TokenIDEntry = ({account, setTokenId}) => {
    const [error, setError] = useState('')

    const handleValue = async (value) => {
        setError('')
        if(value == ''){
            return
        }
        try{
            var error = false
            const id = ethers.BigNumber.from(value)
            const owner = await animalColoringBookContract.ownerOf(id).catch((e) => {
                error = true
            })
            if (error){
                setError('invalid id')
                return
            }
            const isOwner = account == owner;
            if (!isOwner){
                setError('account does not own token')
                return
            }
            const history = await animalColoringBookContract.transferHistory(id).catch((e) => {
                error = true
            })
            const isColored = history.length == 4
            console.log(history)
            if(!isColored){
                setError('is not fully colored')
                return
            }

            setTokenId(value)
        } catch {
            setError('invalid id')
        }
    }

    return(
        <div>
        <Input placeholder={'token ID'} setValue={handleValue}/>
        <p>{error}</p>
        </div>
    )
}

const SizePicker = ({setVariantId}) => {
    const [values, setValues] = useState([])
    const handleChange = () => {

    }

    useEffect(() => {
        setValues([
            {value: '61698f25366b65', name: 'S'},
            {value: '61698f25366bb3', name: 'M'},
            {value: '61698f25366bf1', name: 'L'},
            {value: '61698f25366c27', name: 'XL'},
            {value: '61698f25366c63', name: '2XL'}
        ])
        setVariantId('61698f25366b65')
    }, [])

    return(
        <select onChange={handleChange}>
            { values.map((v) => {
                return(<option value={v.value}>
                    {v.name}
                </option>)
            })
            }
        </select>
    )
}

const Input = ({placeholder, setValue}) => {
    const [value, handleValue] = useState(null)

    const handleInput = (event) => {
        const v = event.target.value.trim()
        handleValue(v)
        setValue(v)
    }

    const debouncedHandleChange = useMemo(
        () =>
          debounce((event: ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value.trim());
          }, WAIT_DURATION_IN_MILLISECONDS),
        [setValue],
      );

    return(
        <div>
        <input placeholder={placeholder} onChange={debouncedHandleChange} />
        </div>
    )
}