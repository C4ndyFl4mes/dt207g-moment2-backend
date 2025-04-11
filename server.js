const { Client } = require("pg");
const express = require("express");
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


const db_client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

db_client.connect((error) => {
    if (error) {
        console.error(error);
    } else {
        console.log("Ansluten till databasen");
    }
});

app.get('/cv', async (req, res) => {
    const data = await getCVRows();
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({error: "Kunde inte hitta information."});
        return;
    }
});

async function getCVRows() {
    try {
        const results = await db_client.query(`SELECT * FROM WorkExperiences;`);
        if (results.rows.length === 0) {
            return null;
        }
        return results.rows;
    } catch (error) {
        console.error(error);
    }
}





app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});