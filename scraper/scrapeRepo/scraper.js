import getNewPageWhenLoaded from '../scraperHelper/newTabHandler.js';
import extractPlaceData from '../scraperHelper/extractPlaceData.js';
import scraperInstructions from './scraperInstructions.js'
import scraperInformation from '../scraperHelper/scraperInformation.js';

export default class scraper{

    static async scrapeStart(locationAndUri, browser){
        console.log("\n\n----------------------------\n\nStart scraping: ", locationAndUri);

        let targetImages = [];
        
        //const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage();
            
        let randomInRange = scraper.getRandomInt(0, scraperInformation.userAgents.length-1);
        let currentUserAgent = scraperInformation.userAgents[randomInRange];
        //console.log("user id: ",randomInRange);
        page.setUserAgent(currentUserAgent);

        
        let response = await page.goto(locationAndUri[1], {waitUntil: 'load', timeout: 0});
        let statusCode = response.status();

        if(scraper.isHeaderCorrect(statusCode)){
            await page.waitForTimeout(250);
        
            await scraperInstructions.clickApproveButton(page);

            await page.waitForTimeout(120);

            //await scraperInstructions.clickCloseButton(page);

            let streetAndIndex = await scraperInstructions.getNextNewStreet(page, locationAndUri[0]);

            
            if(streetAndIndex.index != -1 && streetAndIndex.index != undefined){
                console.log("street index: ", streetAndIndex.index);
                await scraperInstructions.clickListingStreet(page, streetAndIndex.index);

                const newPagePromise = getNewPageWhenLoaded(browser, targetImages, currentUserAgent);
                const newPage = await newPagePromise;
        
                var content = await newPage.content();
                let description = extractPlaceData.getDescription(content);
                let streetName = streetAndIndex.streetName;//extractPlaceData.getStreetName(content);
                let price = extractPlaceData.getStreetPrice(content);
                let properties = extractPlaceData.getProperties(content);
                let url = newPage.url();
        
                for(var i=0; i<32; i++){
                    try{
                        await scraperInstructions.clickSlide(newPage);
                    }catch(err){
                        console.log("Eval wait for fa-chevron-right failed. Skipping clicking slides.");
                        break;
                    }
                }
        
                await newPage.waitForTimeout(400);

                await newPage.close();

                await page.close();
        
                await scraperInstructions.compressImages();
        
                
                return {
                    status: statusCode,
                    description: description,
                    streetName: streetName,
                    price: price,
                    properties: properties,
                    targetImages: targetImages,
                    url: url
                }
            }else{
                await page.close();
            }
        }else{
            //await browser.close();
            await page.close();
            return {
                statusCode: statusCode
            }
        }
        
        
        return null;
    }


    static async isHeaderCorrect(status){
        console.log("status: ",status);
        if(status == 200 || status == 201 
            || status == 202 || status == 203 
            || status == 204 || status == 205
            || status == 206){
            return true;
        }
        return false;
    }


    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}