import helperFunctions from './helperFunctions.js';
import mongodbInstance from './mongodbInstance.js';

class dataRetriever{
    static async getDataFromStreetNameAndCloseLocationName(streetName, counties) {
        if(counties.indexOf(",") == -1){
            return await dataRetriever.getStreetDataOne(streetName, counties);
        }

        let countiesArr = counties.split(",");

        console.log("countiesArr: ",countiesArr);
        let streetsDataReturn = [];
        for(var i=0; i<countiesArr.length; i++){
            let county = countiesArr[i];
            console.log("county: ",county);
            if(county.length > 2){
                console.log("Spliced county: ",county);
                let streetsData = await dataRetriever.getStreetDataOne(streetName, county);
                streetsData.forEach(data => {
                    streetsDataReturn.push(data); 
                });
            }else{
                console.log("Error");
            }
        }
        
        return streetsDataReturn;
    }

    static async getStreetDataOne(streetName, county){
        try {
            streetName = helperFunctions.cleanString(streetName);
            county = helperFunctions.cleanString(county);

            let findQuery = {
                
            };
            
            await mongoInstance.getClient().db().collection("residenceHistory").createIndex( { type: 1},
                { collation: { locale: 'en', strength: 2 } } )

            if(streetName != ""){
                findQuery['streetName'] = {'$regex': escape(streetName), '$options': 'i'};//"källom 257";
            }
            if(county != null && county != "" && county != "null"){
                findQuery['county'] = escape(county);
            }
            console.log("findQuery: ",findQuery);
            var documents = await mongoInstance.getClient().db().collection("residenceHistory").find(findQuery).collation( { locale: 'en', strength: 2 } ).toArray();
            let uniquePair = [];
            documents.forEach(document => {
                if(uniquePair.indexOf(document.streetName+",-,"+document.county) == -1){
                    uniquePair.push(document.streetName+",-,"+document.county);
                }
            });

            let grouped = [];
            uniquePair.forEach(pair => {
                let street = pair.substring(0, pair.indexOf(",-,"));
                let county = pair.substring(pair.indexOf(",-,")+3);
                let groupItems = [];

                documents.forEach(item => {
                    if(item.streetName == street && item.county == county){
                        groupItems.push(item);
                    }
                });
                grouped.push(groupItems);
            });
            console.log(grouped);
            /*await documents.forEach(async document => {
                await document.images.forEach(async image => {
                    let constructedBlob = new Blob([image.binary], image.type.mime);
                    let base64 = await dataRetriever.blobToBase64(constructedBlob);
                    image.base64 = base64;
                    delete image.binary;
                });
            });*/
            

            return grouped;

        } catch (e) {
            console.error(e);
            await mongoInstance.getClient().close();
        } finally {
            
        }

        return [];
    }

    static async blobToBase64(){
        return new Promise(resolve => {
            var reader = new FileReader();
            reader.readAsDataURL(constructedBlob);
            reader.onloadend = function () {
                var base64String = reader.result;
                resolve(base64String);
            }
        });
    }
}

export default dataRetriever;