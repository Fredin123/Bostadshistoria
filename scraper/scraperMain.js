import express from 'express';
const app = express();
import saveScrapedData from './databaseAccess/saveScrapedData.js';
import scraperInformation from './scraperHelper/scraperInformation.js';
import scraper from './scrapeRepo/scraper.js';
import logger from './logger.js';
import puppeteer from 'puppeteer';
import mongodbInstance from './databaseAccess/mongodbInstance.js';
const port = 8080;

const browser = await puppeteer.launch({
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
    ]
});




await mongodbInstance.connect();

let numberOfScrapesThisSession = 0;
let previousNumberOfScrapesThisSession = 0;
setInterval(() => {
    if (numberOfScrapesThisSession == previousNumberOfScrapesThisSession) {
        logger.getLogger().log({
            level: 'error',
            message: "No new scrapes has saved data in over 3 days. something is wrong",
        });
    }
    previousNumberOfScrapesThisSession = numberOfScrapesThisSession;
}, 3600000 * 24 * 3);

let index = 0;
scrape(scraperInformation.locationsAndUrl[index]);

var tries = 0;

async function scrape(location) {
    let scrapedData = null;
    try {
        scrapedData = await scraper.scrapeStart(location, browser);
    } catch (err) {
        console.log("Error when scraping. Closing and opening again.", err);
        //try close browser
        try {
            await browser.close();
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--single-process'
                ]
            });
        } catch (err2) {

        }
    }
    if (scrapedData != null) {
        tries = 0;
        if (scrapedData.status == 200 || scrapedData.status == 201
            || scrapedData.status == 202 || scrapedData.status == 203
            || scrapedData.status == 204 || scrapedData.status == 205
            || scrapedData.status == 206) {
            numberOfScrapesThisSession++;
            await saveScrapedData.saveNewData(
                scrapedData.targetImages,
                scrapedData.description,
                scrapedData.streetName,
                scrapedData.price,
                scrapedData.properties,
                location[0/*county*/],
                scrapedData.url);
            console.log("Saved scraped data complete. Sleep 20 seconds");
            setTimeout(() => {
                index++;
                if (index >= scraperInformation.locationsAndUrl.length) {
                    index = 0;
                }
                if (scraperInformation.locationsAndUrl[index] != undefined) {
                    scrape(scraperInformation.locationsAndUrl[index]);
                }
            }, 20000);
        } else if (scrapedData.status == 403 || scrapedData.status == 503) {
            let currentDate = new Date();
            logger.getLogger().log({
                level: 'info',
                message: currentDate + ": Waiting for 2 days",
            });
            //Try again in 2 days
            process.exit();
            setTimeout(() => {
                index++;
                if (index >= craperInformation.locationsAndUrl.length) {
                    index = 0;
                }
                if (scraperInformation.locationsAndUrl[index] != undefined) {
                    scrape(scraperInformation.locationsAndUrl[index]);
                }
            }, 3600000 * 24 * 2);
        }
    } else {
        index++;
        if (index >= scraperInformation.locationsAndUrl.length) {
            index = 0;
            setTimeout(() => {
                scrape(scraperInformation.locationsAndUrl[index]);
            }, 1000 * 60 * tries);
            if (tries > 0) {
                console.log("Did not find any new data. Sleeping for " + tries + " minutes");
            }
            tries++;
            if (tries > 10) {
                process.exit();
            }
        } else {
            if (scraperInformation.locationsAndUrl[index] != undefined) {
                scrape(scraperInformation.locationsAndUrl[index]);
            }
        }
    }
}

