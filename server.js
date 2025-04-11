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
        res.status(404).json({ error: "Kunde inte hitta information." });
        return;
    }
});

app.post('/cv', async (req, res) => {
    const newData = [["Företagsnamn", req.body.companyname], ["Arbetsuppgift", req.body.jobtitle], ["Plats", req.body.location], ["Start datum", req.body.startdate], ["Slut datum", req.body.enddate], ["Beskrivning", req.body.description]];

    const emptyFields = newData.filter(data => data[1] === "" || !data[1]);
    const emptyFieldsError = { header: "Följande fält är tomma: " };
    if (emptyFields.length > 0) {
        for (let i = 0; i < emptyFields.length; i++) {
            if (i == 0) {
                emptyFieldsError.message = emptyFields[i][0];
            } else if (i > 0 && i < emptyFields.length - 1) {
                emptyFieldsError.message += `, ${emptyFields[i][0]}`;
            } else if (i === emptyFields.length - 1) {
                emptyFieldsError.message += ` och ${emptyFields[i][0]}`;
            }
        }
        res.status(400).json({ valid: false, message: emptyFieldsError });
        return;
    } else {
        const r = await addCVRow(newData[0][1], newData[1][1], newData[2][1], newData[3][1], newData[4][1], newData[5][1]);
        if (r) {
            res.status(200).json( {valid: true,  message: "Ny information lades till."} );
        } else {
            res.status(400).json( {valid: false, message: "Kunde inte lägga till ny information."});
        }
    }
});

async function addCVRow(companyname, jobtitle, location, startdate, enddate, description) {
    try {
        const results = await db_client.query(`
            INSERT INTO WorkExperiences (companyname, jobtitle, location, startdate, enddate, description)    
            VALUES ($1, $2, $3, $4, $5, $6);
        `, [companyname, jobtitle, location, startdate, enddate, description]);
        if (!results) {
            return null;
        }
        console.log(results);
        return results;
    } catch (error) {
        console.error(error);
    }
}

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