import { ethers } from "ethers";
import AnimalColoringBookDescriptorsArtifact from '../../contracts/AnimalColoringBookDescriptors.json'

export default function addressHSl(address: string) {
    const h = addressH(address)
    return `hsl(${h},100%,50%)`
}

export const addressH = (address: string) => {
    return ethers.BigNumber.from(ethers.utils.keccak256(address)).mod(360).toNumber()
}
