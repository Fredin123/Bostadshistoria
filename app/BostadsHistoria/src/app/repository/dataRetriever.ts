import axios from "axios";


class dataRetriever{
    
    static getStreetData(street: string, county: string){
      return new Promise((resolve, reject) => {
        console.log('/api/getStreet?street='+street+'&county='+county);
        axios.get('/api/getStreet?street='+street+'&county='+county)
        .then(function (response) {
          // handle success
          //console.log(response);
          resolve(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          reject(error);
        })
        .then(function () {
          // always executed
        });
      });
    }

}

export default dataRetriever;