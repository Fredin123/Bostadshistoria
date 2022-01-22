import express  from 'express';
//import path = require('path');
import dataRetriever from './repository/dataRetriever.js';
import open from 'open';
import mongodbInstance from './repository/mongodbInstance.js';
const app = express();
const port = 4202;

(async function(){

    await mongodbInstance.connect();

    console.log("Continue");
    app.get('/api/getStreet', (req, res) => {
        
        dataRetriever.getDataFromStreetNameAndCloseLocationName(req.query.street, req.query.county).then(data => {
            res.send(JSON.stringify(data));
        });
        
    })
    
    
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
        open(`http://localhost:${port}`);
    })
    
})();
