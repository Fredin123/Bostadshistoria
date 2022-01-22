import helperFunctions from  '../helperFunctions.js';


function getFromTagClass(fullText, firstPart, lastPart){
    let startIndex = fullText.indexOf(firstPart);
    let spliceOne = fullText.substring(startIndex);
    let streetEndIndex = spliceOne.indexOf(lastPart)
    let spliceTwo = spliceOne.substring(firstPart.length, streetEndIndex);

    return spliceTwo;
}


var extractPlaceData = {

    getDescription: (htmlText) => {
        let r = getFromTagClass(htmlText, '<div class="property-description js-property-description property-description--long">', '</div>');
        return helperFunctions.cleanString(r.replace('<p>','').replace('</p>',''));
    },


    getStreetName: (htmlText) => {
        let r = getFromTagClass(htmlText, '<h1 class=\"qa-property-heading hcl-heading hcl-heading--size2\">', '</h1>');
        return helperFunctions.cleanString(r);
    },

    getcounty: (htmlText) => {
        let r = getFromTagClass(htmlText, '<h1 class="qa-property-heading hcl-heading hcl-heading--size2">', '</h1>');
        return helperFunctions.cleanString(r);
    },

    getStreetPrice: (htmlText) => {
        let r = getFromTagClass(htmlText, '<p class="property-info__price qa-property-price">', '</p>');
        return helperFunctions.cleanString(r);
    },

    getProperties: (htmlText) => {
        let r = getFromTagClass(htmlText, 'dataLayer = [', '\n');
        return helperFunctions.cleanString("["+r);
    }

}

export default extractPlaceData;