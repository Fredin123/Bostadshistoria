import fs from 'fs';


const getNewPageWhenLoaded =  async (browser, imageNameContainer, currentUserAgent) => {
    return new Promise(x =>
        browser.on('targetcreated', async target => {
            if (target.type() === 'page') {
                const newPage = await target.page();
                newPage.setUserAgent(currentUserAgent);
                newPage.on('response', async response => {
                    const url = response.url();
                    let status = response.status();
                    if ((status < 300 || status > 399) && response.request().resourceType() === 'image') {
                        response.buffer().then(file => {

                            const fileName = url.split('/').pop();
                            
                            if(fileName.indexOf(".jpg") != -1 || fileName.indexOf(".jpeg") != -1
                                    || fileName.indexOf(".png") != -1){
                                imageNameContainer.push(fileName);
                                const filePath = new URL("../images/"+fileName, import.meta.url);
                                const writeStream = fs.createWriteStream(filePath);
                                writeStream.write(file);
                                writeStream.close();
                            }
                        });
                    }
                });
                const newPagePromise = new Promise(y =>
                    newPage.once('domcontentloaded', () => y(newPage))
                );
                const isPageLoaded = await newPage.evaluate(
                    () => document.readyState
                );
                return isPageLoaded.match('complete|interactive')
                    ? x(newPage)
                    : x(newPagePromise);
            }
        })
    );
};


export default getNewPageWhenLoaded;