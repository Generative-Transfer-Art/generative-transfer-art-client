import addressHSL, {addressH} from '../../lib/AnimalColoringBook/addressHSL';
import svgToMiniDataURI from 'mini-svg-data-uri';
import { useState } from 'react';
import { setupMaster } from 'cluster';

export default function AnimalImage({animalType, transferHistory}) {
        const svg = getSVG(animalType, transferHistory)
        return(
            <img src={svgToMiniDataURI(svg)} />
        )
}

export function getSVG(animalType, transferHistory){
    return `
        <svg version="1.1" shape-rendering="optimizeSpeed" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 10 10" width="300" height="300" xml:space="preserve">
        ${getSVGStyles(transferHistory)}
        ${getAnimalSVG(animalType)}
        </svg>
        `
}

export function SmallAddressColorSquare({address}){
    let cssProperties = {}
    cssProperties['--h-value'] = addressH(address)

    return(
        <div style={cssProperties} className='float-left small-address-color'> </div>
    )
}
      
function getSVGStyles(history){
    const color1 = history.length > 0 ? addressHSL(history[0]) :  '#ffffff'
    const color2 = history.length > 1 ? addressHSL(history[1]) :  '#ffffff'
    const color3 = history.length > 2 ? addressHSL(history[2]) :  history.length > 1 ? color2 : '#ffffff'
    const color4 = history.length > 3 ? addressHSL(history[3]) :  history.length > 1 ? color2 : '#ffffff'
    const color5 = history.length < 4 ? color2 : '#ffffff'
    
    return `
    <style type="text/css">
        rect{width: 1px; height: 1px;}
        .l{width: 2px; height: 1px;}
        .c1{fill: ${color2}}
        .c2{fill: ${color3}}
        .c3{fill: ${color4}}
        .c4{fill: ${color1}}
        .c5{fill: ${color5}}
        </style>
    `
}
      
function getAnimalSVG(animalType){
    switch(animalType){
        case 1:
            return catSVG()
            break;
        case 2:
            return bunnySVG()
            break;
        case 3:
            return mouseSVG()
            break;
        case 4:
            return skullSVG()
            break;
        case 5:
            return unicornSVG()
            break;
        case 6:
            return creatorSVG()
            break;
    }
}

export function getAnimalName(animalType){
    switch(animalType){
        case 1:
            return "Cat"
            break;
        case 2:
            return "Bunny"
            break;
        case 3:
            return "Mouse"
            break;
        case 4:
            return "Skull"
            break;
        case 5:
            return "Unicorn"
            break;
        case 6:
            return "Creator"
            break;
    }
}
      
function creatorSVG(){
    return `<rect x="0" y="0" class="c4 s"/><rect x="1" y="0" class="c4 s"/><rect x="2" y="0" class="c4 s"/><rect x="3" y="0" class="c4 s"/><rect x="4" y="0" class="c4 s"/><rect x="5" y="0" class="c4 s"/><rect x="6" y="0" class="c4 s"/><rect x="7" y="0" class="c4 s"/><rect x="8" y="0" class="c4 s"/><rect x="9" y="0" class="c4 s"/><rect x="0" y="1" class="c4 s"/><rect x="1" y="1" class="c4 s"/><rect x="2" y="1" class="c1 s"/><rect x="3" y="1" class="c1 s"/><rect x="4" y="1" class="c1 s"/><rect x="5" y="1" class="c1 s"/><rect x="6" y="1" class="c1 s"/><rect x="7" y="1" class="c1 s"/><rect x="8" y="1" class="c4 s"/><rect x="9" y="1" class="c4 s"/><rect x="0" y="2" class="c4 s"/><rect x="1" y="2" class="c1 s"/><rect x="2" y="2" class="c1 s"/><rect x="3" y="2" class="c1 s"/><rect x="4" y="2" class="c1 s"/><rect x="5" y="2" class="c1 s"/><rect x="6" y="2" class="c1 s"/><rect x="7" y="2" class="c1 s"/><rect x="8" y="2" class="c1 s"/><rect x="9" y="2" class="c4 s"/><rect x="0" y="3" class="c4 s"/><rect x="1" y="3" class="c1 s"/><rect x="2" y="3" class="c1 s"/><rect x="3" y="3" class="c1 s"/><rect x="4" y="3" class="c1 s"/><rect x="5" y="3" class="c1 s"/><rect x="6" y="3" class="c1 s"/><rect x="7" y="3" class="c1 s"/><rect x="8" y="3" class="c1 s"/><rect x="9" y="3" class="c4 s"/><rect x="0" y="4" class="c4 s"/><rect x="1" y="4" class="c5 s"/><rect x="2" y="4" class="c5 s"/><rect x="3" y="4" class="c1 s"/><rect x="4" y="4" class="c1 s"/><rect x="5" y="4" class="c1 s"/><rect x="6" y="4" class="c5 s"/><rect x="7" y="4" class="c5 s"/><rect x="8" y="4" class="c1 s"/><rect x="9" y="4" class="c1 s"/><rect x="0" y="5" class="c4 s"/><rect x="1" y="5" class="c5 s"/><rect x="2" y="5" class="c5 s"/><rect x="3" y="5" class="c2 s"/><rect x="4" y="5" class="c1 s"/><rect x="5" y="5" class="c1 s"/><rect x="6" y="5" class="c5 s"/><rect x="7" y="5" class="c5 s"/><rect x="8" y="5" class="c1 s"/><rect x="9" y="5" class="c1 s"/><rect x="0" y="6" class="c4 s"/><rect x="1" y="6" class="c1 s"/><rect x="2" y="6" class="c1 s"/><rect x="3" y="6" class="c2 s"/><rect x="4" y="6" class="c1 s"/><rect x="5" y="6" class="c1 s"/><rect x="6" y="6" class="c1 s"/><rect x="7" y="6" class="c1 s"/><rect x="8" y="6" class="c1 s"/><rect x="9" y="6" class="c1 s"/><rect x="0" y="7" class="c4 s"/><rect x="1" y="7" class="c1 s"/><rect x="2" y="7" class="c1 s"/><rect x="3" y="7" class="c2 s"/><rect x="4" y="7" class="c1 s"/><rect x="5" y="7" class="c1 s"/><rect x="6" y="7" class="c1 s"/><rect x="7" y="7" class="c1 s"/><rect x="8" y="7" class="c1 s"/><rect x="9" y="7" class="c4 s"/><rect x="0" y="8" class="c4 s"/><rect x="1" y="8" class="c4 s"/><rect x="2" y="8" class="c1 s"/><rect x="3" y="8" class="c2 s"/><rect x="4" y="8" class="c2 s"/><rect x="5" y="8" class="c1 s"/><rect x="6" y="8" class="c1 s"/><rect x="7" y="8" class="c2 s"/><rect x="8" y="8" class="c1 s"/><rect x="9" y="8" class="c4 s"/><rect x="0" y="9" class="c4 s"/><rect x="1" y="9" class="c4 s"/><rect x="2" y="9" class="c1 s"/><rect x="3" y="9" class="c1 s"/><rect x="4" y="9" class="c1 s"/><rect x="5" y="9" class="c1 s"/><rect x="6" y="9" class="c2 s"/><rect x="7" y="9" class="c1 s"/><rect x="8" y="9" class="c1 s"/><rect x="9" y="9" class="c4 s"/><g id="eye-location" transform="translate(1,4)"><rect x="0" y="0" class="c3"/><rect x="5" y="0" class="c3"/></g>`
}

function unicornSVG(){
    return `<rect x="0" y="0" class="c4"/><rect x="1" y="0" class="c2"/><rect x="2" y="0" class="c2"/><rect x="3" y="0" class="c4"/><rect x="4" y="0" class="c4"/><rect x="5" y="0" class="c4"/><rect x="6" y="0" class="c4"/><rect x="7" y="0" class="c4"/><rect x="8" y="0" class="c4"/><rect x="9" y="0" class="c4"/><rect x="0" y="1" class="c4"/><rect x="1" y="1" class="c4"/><rect x="2" y="1" class="c2"/><rect x="3" y="1" class="c2"/><rect x="4" y="1" class="c4"/><rect x="5" y="1" class="c4"/><rect x="6" y="1" class="c4"/><rect x="7" y="1" class="c4"/><rect x="8" y="1" class="c4"/><rect x="9" y="1" class="c4"/><rect x="0" y="2" class="c4"/><rect x="1" y="2" class="c4"/><rect x="2" y="2" class="c2"/><rect x="3" y="2" class="c2"/><rect x="4" y="2" class="c2"/><rect x="5" y="2" class="c4"/><rect x="6" y="2" class="c4"/><rect x="7" y="2" class="c4"/><rect x="8" y="2" class="c4"/><rect x="9" y="2" class="c4"/><rect x="0" y="3" class="c4"/><rect x="1" y="3" class="c4"/><rect x="2" y="3" class="c4"/><rect x="3" y="3" class="c2"/><rect x="4" y="3" class="c2"/><rect x="5" y="3" class="c2"/><rect x="6" y="3" class="c4"/><rect x="7" y="3" class="c4"/><rect x="8" y="3" class="c4"/><rect x="9" y="3" class="c4"/><rect x="0" y="4" class="c1"/><rect x="1" y="4" class="c4"/><rect x="2" y="4" class="c1"/><rect x="3" y="4" class="c2"/><rect x="4" y="4" class="c2"/><rect x="5" y="4" class="c1"/><rect x="6" y="4" class="c1"/><rect x="7" y="4" class="c1"/><rect x="8" y="4" class="c4"/><rect x="9" y="4" class="c1"/><rect x="0" y="5" class="c4"/><rect x="1" y="5" class="c1"/><rect x="2" y="5" class="c1"/><rect x="3" y="5" class="c1"/><rect x="4" y="5" class="c1"/><rect x="5" y="5" class="c1"/><rect x="6" y="5" class="c1"/><rect x="7" y="5" class="c1"/><rect x="8" y="5" class="c1"/><rect x="9" y="5" class="c4"/><rect x="0" y="6" class="c4"/><rect x="1" y="6" class="c5"/><rect x="2" y="6" class="c5"/><rect x="3" y="6" class="c1"/><rect x="4" y="6" class="c1"/><rect x="5" y="6" class="c1"/><rect x="6" y="6" class="c5"/><rect x="7" y="6" class="c5"/><rect x="8" y="6" class="c1"/><rect x="9" y="6" class="c4"/><rect x="0" y="7" class="c4"/><rect x="1" y="7" class="c5"/><rect x="2" y="7" class="c5"/><rect x="3" y="7" class="c1"/><rect x="4" y="7" class="c1"/><rect x="5" y="7" class="c1"/><rect x="6" y="7" class="c5"/><rect x="7" y="7" class="c5"/><rect x="8" y="7" class="c1"/><rect x="9" y="7" class="c4"/><rect x="0" y="8" class="c4"/><rect x="1" y="8" class="c1"/><rect x="2" y="8" class="c1"/><rect x="3" y="8" class="c1"/><rect x="4" y="8" class="c1"/><rect x="5" y="8" class="c1"/><rect x="6" y="8" class="c1"/><rect x="7" y="8" class="c1"/><rect x="8" y="8" class="c1"/><rect x="9" y="8" class="c4"/><rect x="0" y="9" class="c4"/><rect x="1" y="9" class="c2"/><rect x="2" y="9" class="c1"/><rect x="3" y="9" class="c1"/><rect x="4" y="9" class="c2"/><rect x="5" y="9" class="c1"/><rect x="6" y="9" class="c1"/><rect x="7" y="9" class="c1"/><rect x="8" y="9" class="c1"/><rect x="9" y="9" class="c4"/><g id="eye-location" transform="translate(1,6)"><rect x="0" y="0" class="c3"/><rect x="5" y="0" class="c3"/></g>`
}

function skullSVG(){
    return `<rect x="0" y="0" class="c4 s"/><rect x="1" y="0" class="c4 s"/><rect x="2" y="0" class="c4 s"/><rect x="3" y="0" class="c4 s"/><rect x="4" y="0" class="c4 s"/><rect x="5" y="0" class="c4 s"/><rect x="6" y="0" class="c4 s"/><rect x="7" y="0" class="c4 s"/><rect x="8" y="0" class="c4 s"/><rect x="9" y="0" class="c4 s"/><rect x="0" y="1" class="c4 s"/><rect x="1" y="1" class="c4 s"/><rect x="2" y="1" class="c1 s"/><rect x="3" y="1" class="c1 s"/><rect x="4" y="1" class="c1 s"/><rect x="5" y="1" class="c1 s"/><rect x="6" y="1" class="c1 s"/><rect x="7" y="1" class="c4 s"/><rect x="8" y="1" class="c4 s"/><rect x="9" y="1" class="c4 s"/><rect x="0" y="2" class="c4 s"/><rect x="1" y="2" class="c1 s"/><rect x="2" y="2" class="c1 s"/><rect x="3" y="2" class="c1 s"/><rect x="4" y="2" class="c1 s"/><rect x="5" y="2" class="c1 s"/><rect x="6" y="2" class="c1 s"/><rect x="7" y="2" class="c1 s"/><rect x="8" y="2" class="c4 s"/><rect x="9" y="2" class="c4 s"/><rect x="0" y="3" class="c1 s"/><rect x="1" y="3" class="c1 s"/><rect x="2" y="3" class="c1 s"/><rect x="3" y="3" class="c1 s"/><rect x="4" y="3" class="c1 s"/><rect x="5" y="3" class="c1 s"/><rect x="6" y="3" class="c1 s"/><rect x="7" y="3" class="c1 s"/><rect x="8" y="3" class="c1 s"/><rect x="9" y="3" class="c4 s"/><rect x="0" y="4" class="c1 s"/><rect x="1" y="4" class="c1 s"/><rect x="2" y="4" class="c5 s"/><rect x="3" y="4" class="c5 s"/><rect x="4" y="4" class="c1 s"/><rect x="5" y="4" class="c1 s"/><rect x="6" y="4" class="c1 s"/><rect x="7" y="4" class="c5 s"/><rect x="8" y="4" class="c5 s"/><rect x="9" y="4" class="c4 s"/><rect x="0" y="5" class="c1 s"/><rect x="1" y="5" class="c1 s"/><rect x="2" y="5" class="c5 s"/><rect x="3" y="5" class="c5 s"/><rect x="4" y="5" class="c1 s"/><rect x="5" y="5" class="c1 s"/><rect x="6" y="5" class="c1 s"/><rect x="7" y="5" class="c5 s"/><rect x="8" y="5" class="c5 s"/><rect x="9" y="5" class="c4 s"/><rect x="0" y="6" class="c1 s"/><rect x="1" y="6" class="c1 s"/><rect x="2" y="6" class="c1 s"/><rect x="3" y="6" class="c1 s"/><rect x="4" y="6" class="c1 s"/><rect x="5" y="6" class="c2 s"/><rect x="6" y="6" class="c1 s"/><rect x="7" y="6" class="c1 s"/><rect x="8" y="6" class="c1 s"/><rect x="9" y="6" class="c4 s"/><rect x="0" y="7" class="c4 s"/><rect x="1" y="7" class="c1 s"/><rect x="2" y="7" class="c1 s"/><rect x="3" y="7" class="c1 s"/><rect x="4" y="7" class="c2 s"/><rect x="5" y="7" class="c1 s"/><rect x="6" y="7" class="c2 s"/><rect x="7" y="7" class="c1 s"/><rect x="8" y="7" class="c4 s"/><rect x="9" y="7" class="c4 s"/><rect x="0" y="8" class="c4 s"/><rect x="1" y="8" class="c4 s"/><rect x="2" y="8" class="c1 s"/><rect x="3" y="8" class="c1 s"/><rect x="4" y="8" class="c1 s"/><rect x="5" y="8" class="c1 s"/><rect x="6" y="8" class="c1 s"/><rect x="7" y="8" class="c1 s"/><rect x="8" y="8" class="c4 s"/><rect x="9" y="8" class="c4 s"/><rect x="0" y="9" class="c4 s"/><rect x="1" y="9" class="c4 s"/><rect x="2" y="9" class="c1 s"/><rect x="3" y="9" class="c2 s"/><rect x="4" y="9" class="c1 s"/><rect x="5" y="9" class="c2 s"/><rect x="6" y="9" class="c1 s"/><rect x="7" y="9" class="c2 s"/><rect x="8" y="9" class="c4 s"/><rect x="9" y="9" class="c4 s"/><g id="eye-location" transform="translate(2,4)"><rect x="0" y="0" class="c3"/><rect x="5" y="0" class="c3"/></g>`
}

function catSVG(){
    return `<rect x="0" y="0" class="c4 s"/><rect x="1" y="0" class="c1 s"/><rect x="2" y="0" class="c4 s"/><rect x="3" y="0" class="c4 s"/><rect x="4" y="0" class="c4 s"/><rect x="5" y="0" class="c4 s"/><rect x="6" y="0" class="c4 s"/><rect x="7" y="0" class="c4 s"/><rect x="8" y="0" class="c1 s"/><rect x="9" y="0" class="c4 s"/><rect x="0" y="1" class="c4 s"/><rect x="1" y="1" class="c1 s"/><rect x="2" y="1" class="c1 s"/><rect x="3" y="1" class="c4 s"/><rect x="4" y="1" class="c4 s"/><rect x="5" y="1" class="c4 s"/><rect x="6" y="1" class="c4 s"/><rect x="7" y="1" class="c1 s"/><rect x="8" y="1" class="c1 s"/><rect x="9" y="1" class="c4 s"/><rect x="0" y="2" class="c4 s"/><rect x="1" y="2" class="c1 s"/><rect x="2" y="2" class="c1 s"/><rect x="3" y="2" class="c1 s"/><rect x="4" y="2" class="c1 s"/><rect x="5" y="2" class="c1 s"/><rect x="6" y="2" class="c1 s"/><rect x="7" y="2" class="c1 s"/><rect x="8" y="2" class="c1 s"/><rect x="9" y="2" class="c4 s"/><rect x="0" y="3" class="c4 s"/><rect x="1" y="3" class="c1 s"/><rect x="2" y="3" class="c1 s"/><rect x="3" y="3" class="c1 s"/><rect x="4" y="3" class="c1 s"/><rect x="5" y="3" class="c1 s"/><rect x="6" y="3" class="c1 s"/><rect x="7" y="3" class="c1 s"/><rect x="8" y="3" class="c1 s"/><rect x="9" y="3" class="c4 s"/><rect x="0" y="4" class="c4 s"/><rect x="1" y="4" class="c1 s"/><rect x="2" y="4" class="c5 s"/><rect x="3" y="4" class="c5 s"/><rect x="4" y="4" class="c1 s"/><rect x="5" y="4" class="c1 s"/><rect x="6" y="4" class="c1 s"/><rect x="7" y="4" class="c5 s"/><rect x="8" y="4" class="c5 s"/><rect x="9" y="4" class="c4 s"/><rect x="0" y="5" class="c1 s"/><rect x="1" y="5" class="c1 s"/><rect x="2" y="5" class="c5 s"/><rect x="3" y="5" class="c5 s"/><rect x="4" y="5" class="c1 s"/><rect x="5" y="5" class="c1 s"/><rect x="6" y="5" class="c1 s"/><rect x="7" y="5" class="c5 s"/><rect x="8" y="5" class="c5 s"/><rect x="9" y="5" class="c1 s"/><rect x="0" y="6" class="c4 s"/><rect x="1" y="6" class="c1 s"/><rect x="2" y="6" class="c1 s"/><rect x="3" y="6" class="c1 s"/><rect x="4" y="6" class="c2 s"/><rect x="5" y="6" class="c2 s"/><rect x="6" y="6" class="c2 s"/><rect x="7" y="6" class="c1 s"/><rect x="8" y="6" class="c1 s"/><rect x="9" y="6" class="c4 s"/><rect x="0" y="7" class="c1 s"/><rect x="1" y="7" class="c1 s"/><rect x="2" y="7" class="c1 s"/><rect x="3" y="7" class="c1 s"/><rect x="4" y="7" class="c1 s"/><rect x="5" y="7" class="c2 s"/><rect x="6" y="7" class="c1 s"/><rect x="7" y="7" class="c1 s"/><rect x="8" y="7" class="c1 s"/><rect x="9" y="7" class="c1 s"/><rect x="0" y="8" class="c4 s"/><rect x="1" y="8" class="c1 s"/><rect x="2" y="8" class="c1 s"/><rect x="3" y="8" class="c2 s"/><rect x="4" y="8" class="c2 s"/><rect x="5" y="8" class="c1 s"/><rect x="6" y="8" class="c2 s"/><rect x="7" y="8" class="c2 s"/><rect x="8" y="8" class="c1 s"/><rect x="9" y="8" class="c4 s"/><rect x="0" y="9" class="c4 s"/><rect x="1" y="9" class="c4 s"/><rect x="2" y="9" class="c1 s"/><rect x="3" y="9" class="c1 s"/><rect x="4" y="9" class="c1 s"/><rect x="5" y="9" class="c1 s"/><rect x="6" y="9" class="c1 s"/><rect x="7" y="9" class="c1 s"/><rect x="8" y="9" class="c4 s"/><rect x="9" y="9" class="c4 s"/><g id="eye-location" transform="translate(2,4)"><rect x="0" y="0" class="c3"/><rect x="5" y="0" class="c3"/></g>`
}

function mouseSVG(){
    return `<rect x="0" y="0" class="c4 s"/><rect x="1" y="0" class="c1 s"/><rect x="2" y="0" class="c1 s"/><rect x="3" y="0" class="c4 s"/><rect x="4" y="0" class="c4 s"/><rect x="5" y="0" class="c4 s"/><rect x="6" y="0" class="c4 s"/><rect x="7" y="0" class="c1 s"/><rect x="8" y="0" class="c1 s"/><rect x="9" y="0" class="c4 s"/><rect x="0" y="1" class="c1 s"/><rect x="1" y="1" class="c1 s"/><rect x="2" y="1" class="c1 s"/><rect x="3" y="1" class="c1 s"/><rect x="4" y="1" class="c4 s"/><rect x="5" y="1" class="c4 s"/><rect x="6" y="1" class="c1 s"/><rect x="7" y="1" class="c1 s"/><rect x="8" y="1" class="c1 s"/><rect x="9" y="1" class="c1 s"/><rect x="0" y="2" class="c1 s"/><rect x="1" y="2" class="c1 s"/><rect x="2" y="2" class="c1 s"/><rect x="3" y="2" class="c1 s"/><rect x="4" y="2" class="c4 s"/><rect x="5" y="2" class="c4 s"/><rect x="6" y="2" class="c1 s"/><rect x="7" y="2" class="c1 s"/><rect x="8" y="2" class="c1 s"/><rect x="9" y="2" class="c1 s"/><rect x="0" y="3" class="c1 s"/><rect x="1" y="3" class="c1 s"/><rect x="2" y="3" class="c1 s"/><rect x="3" y="3" class="c1 s"/><rect x="4" y="3" class="c1 s"/><rect x="5" y="3" class="c1 s"/><rect x="6" y="3" class="c1 s"/><rect x="7" y="3" class="c1 s"/><rect x="8" y="3" class="c1 s"/><rect x="9" y="3" class="c4 s"/><rect x="0" y="4" class="c4 s"/><rect x="1" y="4" class="c5 s"/><rect x="2" y="4" class="c5 s"/><rect x="3" y="4" class="c1 s"/><rect x="4" y="4" class="c1 s"/><rect x="5" y="4" class="c1 s"/><rect x="6" y="4" class="c5 s"/><rect x="7" y="4" class="c5 s"/><rect x="8" y="4" class="c4 s"/><rect x="9" y="4" class="c4 s"/><rect x="0" y="5" class="c4 s"/><rect x="1" y="5" class="c5 s"/><rect x="2" y="5" class="c5 s"/><rect x="3" y="5" class="c1 s"/><rect x="4" y="5" class="c1 s"/><rect x="5" y="5" class="c1 s"/><rect x="6" y="5" class="c5 s"/><rect x="7" y="5" class="c5 s"/><rect x="8" y="5" class="c1 s"/><rect x="9" y="5" class="c4 s"/><rect x="0" y="6" class="c4 s"/><rect x="1" y="6" class="c1 s"/><rect x="2" y="6" class="c1 s"/><rect x="3" y="6" class="c2 s"/><rect x="4" y="6" class="c1 s"/><rect x="5" y="6" class="c1 s"/><rect x="6" y="6" class="c1 s"/><rect x="7" y="6" class="c1 s"/><rect x="8" y="6" class="c1 s"/><rect x="9" y="6" class="c4 s"/><rect x="0" y="7" class="c4 s"/><rect x="1" y="7" class="c1 s"/><rect x="2" y="7" class="c1 s"/><rect x="3" y="7" class="c1 s"/><rect x="4" y="7" class="c1 s"/><rect x="5" y="7" class="c1 s"/><rect x="6" y="7" class="c1 s"/><rect x="7" y="7" class="c1 s"/><rect x="8" y="7" class="c1 s"/><rect x="9" y="7" class="c4 s"/><rect x="0" y="8" class="c4 s"/><rect x="1" y="8" class="c4 s"/><rect x="2" y="8" class="c1 s"/><rect x="3" y="8" class="c2 s"/><rect x="4" y="8" class="c2 s"/><rect x="5" y="8" class="c1 s"/><rect x="6" y="8" class="c1 s"/><rect x="7" y="8" class="c1 s"/><rect x="8" y="8" class="c4 s"/><rect x="9" y="8" class="c4 s"/><rect x="0" y="9" class="c4 s"/><rect x="1" y="9" class="c4 s"/><rect x="2" y="9" class="c4 s"/><rect x="3" y="9" class="c1 s"/><rect x="4" y="9" class="c1 s"/><rect x="5" y="9" class="c1 s"/><rect x="6" y="9" class="c1 s"/><rect x="7" y="9" class="c4 s"/><rect x="8" y="9" class="c4 s"/><rect x="9" y="9" class="c4 s"/><g id="eye-location" transform="translate(1,4)"><rect x="0" y="0" class="c3"/><rect x="5" y="0" class="c3"/></g>`
}

function bunnySVG(){
    return `<rect x="0" y="0" class="c1 s"/><rect x="1" y="0" class="c1 s"/><rect x="2" y="0" class="c1 s"/><rect x="3" y="0" class="c4 s"/><rect x="4" y="0" class="c4 s"/><rect x="5" y="0" class="c1 s"/><rect x="6" y="0" class="c1 s"/><rect x="7" y="0" class="c1 s"/><rect x="8" y="0" class="c4 s"/><rect x="9" y="0" class="c4 s"/><rect x="0" y="1" class="c4 s"/><rect x="1" y="1" class="c1 s"/><rect x="2" y="1" class="c1 s"/><rect x="3" y="1" class="c1 s"/><rect x="4" y="1" class="c4 s"/><rect x="5" y="1" class="c4 s"/><rect x="6" y="1" class="c1 s"/><rect x="7" y="1" class="c1 s"/><rect x="8" y="1" class="c1 s"/><rect x="9" y="1" class="c4 s"/><rect x="0" y="2" class="c4 s"/><rect x="1" y="2" class="c4 s"/><rect x="2" y="2" class="c1 s"/><rect x="3" y="2" class="c1 s"/><rect x="4" y="2" class="c4 s"/><rect x="5" y="2" class="c4 s"/><rect x="6" y="2" class="c4 s"/><rect x="7" y="2" class="c1 s"/><rect x="8" y="2" class="c1 s"/><rect x="9" y="2" class="c4 s"/><rect x="0" y="3" class="c4 s"/><rect x="1" y="3" class="c1 s"/><rect x="2" y="3" class="c1 s"/><rect x="3" y="3" class="c1 s"/><rect x="4" y="3" class="c1 s"/><rect x="5" y="3" class="c1 s"/><rect x="6" y="3" class="c1 s"/><rect x="7" y="3" class="c1 s"/><rect x="8" y="3" class="c1 s"/><rect x="9" y="3" class="c4 s"/><rect x="0" y="4" class="c4 s"/><rect x="1" y="4" class="c5 s"/><rect x="2" y="4" class="c5 s"/><rect x="3" y="4" class="c1 s"/><rect x="4" y="4" class="c1 s"/><rect x="5" y="4" class="c1 s"/><rect x="6" y="4" class="c5 s"/><rect x="7" y="4" class="c5 s"/><rect x="8" y="4" class="c1 s"/><rect x="9" y="4" class="c4 s"/><rect x="0" y="5" class="c1 s"/><rect x="1" y="5" class="c5 s"/><rect x="2" y="5" class="c5 s"/><rect x="3" y="5" class="c1 s"/><rect x="4" y="5" class="c1 s"/><rect x="5" y="5" class="c1 s"/><rect x="6" y="5" class="c5 s"/><rect x="7" y="5" class="c5 s"/><rect x="8" y="5" class="c1 s"/><rect x="9" y="5" class="c1 s"/><rect x="0" y="6" class="c1 s"/><rect x="1" y="6" class="c1 s"/><rect x="2" y="6" class="c1 s"/><rect x="3" y="6" class="c2 s"/><rect x="4" y="6" class="c1 s"/><rect x="5" y="6" class="c2 s"/><rect x="6" y="6" class="c1 s"/><rect x="7" y="6" class="c1 s"/><rect x="8" y="6" class="c1 s"/><rect x="9" y="6" class="c1 s"/><rect x="0" y="7" class="c1 s"/><rect x="1" y="7" class="c1 s"/><rect x="2" y="7" class="c1 s"/><rect x="3" y="7" class="c1 s"/><rect x="4" y="7" class="c2 s"/><rect x="5" y="7" class="c1 s"/><rect x="6" y="7" class="c1 s"/><rect x="7" y="7" class="c1 s"/><rect x="8" y="7" class="c1 s"/><rect x="9" y="7" class="c1 s"/><rect x="0" y="8" class="c4 s"/><rect x="1" y="8" class="c1 s"/><rect x="2" y="8" class="c2 s"/><rect x="3" y="8" class="c2 s"/><rect x="4" y="8" class="c1 s"/><rect x="5" y="8" class="c2 s"/><rect x="6" y="8" class="c2 s"/><rect x="7" y="8" class="c1 s"/><rect x="8" y="8" class="c1 s"/><rect x="9" y="8" class="c4 s"/><rect x="0" y="9" class="c4 s"/><rect x="1" y="9" class="c4 s"/><rect x="2" y="9" class="c1 s"/><rect x="3" y="9" class="c1 s"/><rect x="4" y="9" class="c1 s"/><rect x="5" y="9" class="c1 s"/><rect x="6" y="9" class="c1 s"/><rect x="7" y="9" class="c1 s"/><rect x="8" y="9" class="c4 s"/><rect x="9" y="9" class="c4 s"/><g id="eye-location" transform="translate(1,4)"><rect x="0" y="0" class="c3"/><rect x="5" y="0" class="c3"/></g>`
}
