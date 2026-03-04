const express = require("express");
const { BlobServiceClient } = require("@azure/storage-blob");
 
const app = express();
app.use(express.static(__dirname));
app.use(express.json());
 
const PORT = process.env.PORT || 3000;
const connectionString = process.env.STORAGE_STRING;
 
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});
 
app.post("/upload", async (req, res) => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
 
        const containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists();
        const blobName = `sample-${Date.now()}.txt`;
 
        const blobClient = containerClient.getBlockBlobClient(blobName);
 
        const content = "Hello from Azure!";
        await blobClient.upload(content, content.length);
 
        res.send("File uploaded successfully!");
    } catch (err) {
        res.status(500).send(err);
    }
});
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
