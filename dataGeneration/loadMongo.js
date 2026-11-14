import "dotenv/config";
import { MongoClient } from "mongodb";
import { generateUsers } from "./generateUser.js";
import { generateMedia } from "./generateMedia.js";
import { generateAllLoans } from "./generateLoans.js";

const uri = process.env.MONGODB_URI;
const db = process.env.DB_NAME;
if (!uri) throw new Error("MONGODB_URI is not set. Check your .env file.");
if (!db) throw new Error("DB_NAME is not set. Check your .env file.");
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Select database and collection
    const database = client.db(db);
    const userCollection = database.collection("users");
    const mediaCollection = database.collection("media");
    const loanCollection = database.collection("loans");
    await mediaCollection.deleteMany({});
    await userCollection.deleteMany({});
    await loanCollection.deleteMany({});

    // --- Bulk Load ---
    const users = await generateUsers(50);
    const userResult = await userCollection.insertMany(users);
    console.log(`${userResult.insertedCount} user documents were inserted.`);

    const media = generateMedia(1000, users);
    const mediaResult = await mediaCollection.insertMany(media);
    console.log(`${mediaResult.insertedCount} media documents were inserted.`);

    const loanResult = await loanCollection.insertMany(generateAllLoans(media));
    console.log(`${loanResult.insertedCount} loan documents were inserted.`);
  } catch (error) {
    console.error("Error loading data into MongoDB:", error);
  } finally {
    // Ensure the client closes when you finish
    await client.close();
  }
}

run();
