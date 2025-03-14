import 'dotenv/config';
import fs from 'fs';
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Collection, Document, MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri)
	throw new Error("Mongo URI environemnt variable is not defined");
const mongoClient = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});
const docName = "petcount";
let dbCollection: Collection<Document> | undefined = await connect();
if (!dbCollection)
	throw new Error('Failed to connect to database.')


const faadilImages: AttachmentBuilder[] = [];
const folderName = './assets/faadilImages';
fs.readdirSync(folderName).forEach((file) => {
	const path = `${folderName}/${file}`;
	faadilImages.push(new AttachmentBuilder(path));
});

let faadilPetCount = await getPetCount();	// get initial pet count from database

const petfaadilCommand = {
	data: new SlashCommandBuilder()
		.setName('petfaadil')
		.setDescription('Pets faadil c:'),

	async execute(interaction: CommandInteraction) {
		if (faadilPetCount == null) {
			throw new Error("faadilPetCount didn't get retrieved from the database");
		}
		faadilPetCount++;
		let reply = `faadil has been pet ${faadilPetCount} ${faadilPetCount === 1 ? 'time' : 'times'}`;
		let imgNum = Math.floor(Math.random() * 6);
		await interaction.reply({
			content: reply,
			files: [faadilImages[imgNum]]
		});
		await updatePetCount(faadilPetCount);		// update database
	},
};

/** Updates the petcount in the database with petcount. */
export async function updatePetCount(petcount: number) {
	if (!dbCollection)
		throw new Error('Failed to connect to database.')

	if (dbCollection == null) {
		let newDbCollection = await connect();
		if (!newDbCollection) throw new Error("Failed to connect to database");
		dbCollection = newDbCollection;
	}

	const filter = { docName: docName };
	const updateDoc = {
		$set: { petcount: petcount }
	};
	const options = { upsert: true };       // insert a document if doesn't exist

	await dbCollection.updateOne(filter, updateDoc, options);
	console.log("Updated database with petcount: " + petcount);
}

/** Returns the current petcount in the database. */
export async function getPetCount() {
	if (!dbCollection)
		throw new Error('Failed to connect to database.')

	const filter = { docName: docName };
	const res = await dbCollection.findOne(filter);
	if (res == null) {
		throw new Error();
	}
	return res.petcount;
}

/** Connects to the MongoDB database. */
async function connect() {
	try {
		// Connect the client to the server
		await mongoClient.connect();

		// Send a ping to confirm a successful connection
		await mongoClient.db("admin").command({ ping: 1 });
		console.log("Connected to MongoDB");

		// Get collection
		const database = mongoClient.db('petfaadil');
		return database.collection('petfaadil');
	} catch (e) {
		await mongoClient.close();
		console.error(e);
	}
}

export default petfaadilCommand;