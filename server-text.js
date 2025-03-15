import { MongoClient } from "mongodb";

const uri = "mongodb://192.168.230.49:27017";
const client = new MongoClient(uri, {
    connectTimeoutMS: 30000,        // Increase timeout to 30 seconds
    socketTimeoutMS: 45000,         // Increase socket timeout
    serverSelectionTimeoutMS: 30000, // Increase server selection timeout
    family: 4,                      // Force IPv4
    directConnection: true          // Try direct connection
});

async function connect() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await client.connect();
        console.log("Connected successfully!");
        
        const db = client.db("yelp");
        
        // Verify connection with a ping
        await db.command({ ping: 1 });
        console.log("Database ping successful!");
        
        return db;
    } catch (err) {
        console.error("Connection failed with details:");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Full error:", err);
        throw err;
    }
}

// Test the connection
const testConnection = async () => {
    try {
        const db = await connect();
        console.log("Connection test successful!");
    } catch (error) {
        console.error("Connection test failed:", error);
    }
};

testConnection();

export default connect;
