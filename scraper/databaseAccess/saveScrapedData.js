import fs from 'fs';
import FileType from 'file-type';
import mongodbInstance from './mongodbInstance.js';

class saveScrapedData {

    static async saveNewData(targetImages, description, streetName, price, properties, county, url) {
        await this.savePlace(targetImages, description, streetName, price, properties, county, url);

        fs.readdir(new URL("../images/", import.meta.url), (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(new URL("../images/" + file, import.meta.url), err => {
                    //if (err) console.log(err);
                });
            }
        });
        fs.readdir(new URL("../images/compressed/", import.meta.url), (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(new URL("../images/compressed/" + file, import.meta.url), err => {
                    //if (err) console.log(err);
                });
            }
        });
    }

    static async savePlace(targetImages, description, streetName, price, properties, county, url) {
        console.log("savePlace");
        var preLog = "";
        try{
            preLog = fs.readFileSync('SaveLog.txt',
            {encoding:'utf8', flag:'r'});
        }catch(err){

        }
        fs.writeFileSync("SaveLog.txt", preLog+"\n"+new Date()+"\n"+streetName+"\n"+properties+"\n--------------------------------------");
        let images = [];

        for(var i=0; i<targetImages.length; i++){
            var imageName = targetImages[i];
            try {
                //imageName = imageName.replace(".png", ".webp");
                let file;
                try {
                    file = fs.readFileSync(new URL("../images/compressed/" + imageName, import.meta.url));
                } catch (err) {
                    imageName = imageName.replace(".png", ".webp");
                    file = fs.readFileSync(new URL("../images/compressed/" + imageName, import.meta.url));
                }

                let mimeType = await FileType.fromBuffer(file);
                /*let tempBlob = new Blob([file], {type: mimeType})
                let text = await tempBlob.text();*/
                images.push({
                    'base64': Buffer.from(file).toString('base64'),
                    'type': mimeType
                });
            } catch (err) {
                console.log("Did not find image: ",imageName);
                //console.log(err);
            }
        }

        console.log("savePlace 2");
        try {
            console.log("Insert: ", escape(streetName));
            await mongodbInstance.getClient().db().collection("residenceHistory").insertOne({
                'description': escape(description),
                'streetName': escape(streetName),
                'price': escape(price),
                'created_on': new Date(),
                'properties': properties,
                'images': images,
                'county': escape(county),
                'url': url,
                'scrapeVerion': '1',

            });
        } catch (e) {
            console.error(e);
            await mongodbInstance.close();
        } finally {
            
        }

    }



};

export default saveScrapedData;