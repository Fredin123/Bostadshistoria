import imagemin from 'imagemin';
import imageminMozJpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import dataRetrieve from '../databaseAccess/dataRetrieve.js';


export default class scraperInstructions{

    static async clickApproveButton(page){
        try{
            console.log("Click approve button");
            await page.waitForSelector('.hcl-button');
            await page.$$eval('.hcl-button', elements => {
                const element = elements.find(element => element.innerHTML === 'Jag samtycker');
                if(element != undefined && element != null){
                    element.click();
                }
            });
        }catch(err){
            console.log("Error clicking approve button. Skipping");
        }
    }

    static async clickCloseButton(page){
        console.log("click close button");
        await page.waitForSelector('.sticky-subscription-button__close');
        await page.$$eval('.sticky-subscription-button__close', elements => {
            elements.forEach(element => {
                element.click();
            });
        });
    }

    static async getNextNewStreet(page, county){
        var linkTexts = await page.$$eval('.listing-card__address',
            elements=> elements.map(item=>item.textContent))
        
        let newStreetIndex = -1;
        let targetStreet = "";
        if(linkTexts.length <= 1){
            return -1;
        }
        for(var linkI=1; linkI<linkTexts.length; linkI++){
            let streetTitle = linkTexts[linkI];
            let firstIndex = 0;
            for(var i = 0; i<streetTitle.length; i++){
                if(streetTitle[i] != ' ' && streetTitle[i] != '\n'){
                    firstIndex = i;
                    break;
                }
            }
            let sliceOne = streetTitle.substring(firstIndex);
            let street = sliceOne.substring(0, sliceOne.indexOf('\n'));
            let documents = await dataRetrieve.getDataFromStreetNameAndCloseLocationName(street, county);
            //console.log("Found documents: ",documents);
            if(documents.length == 0){
                targetStreet = street;
                newStreetIndex = linkI;
                break;
            }
        }

        return {streetName: targetStreet, index: newStreetIndex};
    }

    static async clickListingStreet(page, itemNumber){
        console.log("Click listing item to open new tab");
        
        //
        let func = new Function('elements', 'let buttonsClicked = 0;'
            +'elements.forEach(element => {'
                +'if(buttonsClicked == '+itemNumber+'){'
                    +'element.click();'
                    +'buttonsClicked++;'
                +'}'
                +'buttonsClicked++;'
            +'});'); 
        await page.$$eval('.listing-card__images-container', func);
        
    }

    static async clickSlide(page){
        await page.waitForTimeout(70)
        await page.waitForSelector(".fa-chevron-right");
            await page.$$eval('.fa-chevron-right', elements => {
                elements.forEach(element => {
                    element.click();
                });
            });
        
        let randomMs = Math.random()*100;
        await page.waitForTimeout(70 + randomMs);
    }


    static async compressImages(){
        const files = await imagemin(['images/*.{jpg,png}'], {
            destination: 'images/compressed',
            plugins: [
                imageminMozJpeg({quality: 40}),
                imageminPngquant({
                    quality: [0.35, 0.4]
                })
            ]
        });
    }

}