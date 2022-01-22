import helperFunctions from '../helperFunctions.js';
import mongodbInstance from './mongodbInstance.js';


class dataRetrieve{

    static async getDataFromStreetNameAndCloseLocationName(streetName, county) {
        console.log("getDataFromStreetNameAndCloseLocationName");
        
        
        try {
            
            streetName = helperFunctions.cleanString(streetName);
            county = helperFunctions.cleanString(county);
            let futureDate = new Date();
            futureDate.setDate(futureDate.getDate()+2);
            let pastDate = new Date();
            pastDate.setDate(pastDate.getDate()-3);

            let query = {
                "streetName": escape(streetName),
                'county': escape(county),
                'created_on': {
                    $gte: pastDate,
                    $lt: futureDate
                }
            };
            console.log("Find: ", escape(streetName));
            var documents = await mongodbInstance.getClient().db().collection("residenceHistory").find(query).toArray();
            if(documents.length > 0){
                console.log("Found data");
            }else{
                console.log("Found no data");
            }
            return documents;

        } catch (e) {
            console.error(e);
            await mongodbInstance.close();
        } finally {
            
        }

        return [];
    }


};

export default dataRetrieve;