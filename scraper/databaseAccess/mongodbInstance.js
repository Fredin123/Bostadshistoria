import MongoClient from 'mongodb';

var _client;

class mongodbInstance {

    static async connect() {
        console.log("Init mongodb client");
        const uri = "mongodb://serverUser:gi90238uljkqwjknfrngvfsjld90ouyefrhldghilur4y7834y78dfgsbhjfewabhferkgu8o58754@localhost:27017/BostadsHistoria";
        _client = new MongoClient.MongoClient(uri);
        console.log("Await client connection");
        await _client.connect();
        console.log("Client connection done");
    }
    static getClient() {
        return _client;
    }

    static async close() {
        await _client.close();
    }
}

export default mongodbInstance;