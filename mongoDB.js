import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGO_URI;
let dbCollection = null;
const docName = "petcount";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connect() {
    try {
        // Connect the client to the server
        await client.connect();
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB");

        // Get collection
        const database = client.db('petfaadil');
        dbCollection = database.collection('petfaadil');
    } catch (e) {
        await client.close();
        console.error(e);
    }
}

// Updates the petcount in the database with the given value
export async function updatePetCount(petcount) {
    if (dbCollection == null) {
        await connect();
    }

    const filter = { docName: docName };
    const updateDoc = {
        $set: { petcount: petcount }
    };
    const options = { upsert: true };       // insert a document if doesn't exist

    await dbCollection.updateOne(filter, updateDoc, options);
    console.log("Updated database with petcount: " + petcount);
}

// Returns the petcount from the database. Used for initial pet count when bot starts
export async function getPetCount() {
    if (dbCollection == null) {
        await connect();
    }

    const filter = { docName: docName };
    const res = await dbCollection.findOne(filter)
    return res.petcount;
}