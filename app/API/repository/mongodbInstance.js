import MongoClient from 'mongodb';

var _client;

class mongodbInstance {

    static async connect() {
        try{
            console.log("Init mongodb client");
            const uri = "mongodb://serverUser:gi90238uljkqwjknfrngvfsjld90ouyefrhldghilur4y7834y78dfgsbhjfewabhferkgu8o58754@127.0.0.1:27017/BostadsHistoria";
            _client = new MongoClient.MongoClient(uri);
            console.log("Await client connection");
            await _client.connect();
            console.log("Client connection done");
        }catch(err){
            console.log("ERROR: ",err);
            _client.close();
        }
        
    }
    static getClient() {
        return _client;
    }

    static async close() {
        await _client.close();
    }
}

export default mongodbInstance;