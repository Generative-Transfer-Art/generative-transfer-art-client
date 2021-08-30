import { ethers } from "ethers";

export default function addressHSl(address: string) {
    const h = addressH(address)
    return `hsl(${h},100%,50%)`
}

export function addressH(address: string) {
    return parseInt(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(address))) % 360
}