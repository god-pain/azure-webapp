const express = require("express");
const { BlobServiceClient } = require("@azure/storage-blob");

const app = express();
app.use(express.json());

const PORT = 3000;

// ❗ Put your Azure Storage connection string here
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

// ❗ Your container name
const containerName = "samples";

let containerClient;

// Initialize Azure Blob Storage once
(async () => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists();
        console.log(`Container ready: ${containerName}`);
    } catch (err) {
        console.error("Error initializing Azure Blob:", err);
        process.exit(1);
    }
})();

app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});

app.post("/upload", async (req, res) => {
    try {
        const text = "Hello from Azure!";
        const buffer = Buffer.from(text, "utf8");

        const blobName = `sample-${Date.now()}.txt`;
        const blobClient = containerClient.getBlockBlobClient(blobName);

        await blobClient.upload(buffer, buffer.length, {
            blobHTTPHeaders: { blobContentType: "text/plain" },
        });

        res.json({
            message: "File uploaded successfully!",
            blobName: blobName,
            url: blobClient.url
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
