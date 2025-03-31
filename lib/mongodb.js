// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);

// export async function connectToDatabase() {
//     if (!client.topology || !client.topology.isConnected()) {
//         await client.connect();
//     }
//     return client.db("storage"); // Your database name
// }


import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not defined in environment variables");

let client;
let db;

export async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db("storage"); // Ensure the correct database name
    }
    return { db, client }; // Return both db and client
}
