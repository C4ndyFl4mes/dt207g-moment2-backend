const { Client } = require("pg");
const cors = require('cors');
const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());



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

/**
 * Den här anonyma funktionen anropar getCVRows() och hanterar ett fel.
 */
app.get('/cv', async (req, res) => {
    const data = await getCVRows();
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json({ error: "Kunde inte hitta information." });
        return;
    }
});

/**
 * Den här anonyma funktionen kontrollerar de fält som har skickats till servern, returnerar felmeddelanden vid fel. Anropar addCVRow och skickar fel om det gick fel, bra mening.
 */
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
        if (await addCVRow(newData[0][1], newData[1][1], newData[2][1], newData[3][1], newData[4][1], newData[5][1])) {
            res.status(200).json( {valid: true,  message: "Ny information lades till."} );
        } else {
            res.status(400).json( {valid: false, message: "Kunde inte lägga till ny information."});
        }
    }
});

/**
 * Gör samma sak som ovan med kontrollering, men anropar istället editCVRow().
 */
app.put('/cv', async (req, res) => {
    const newData = [["Företagsnamn", req.body.companyname], ["Arbetsuppgift", req.body.jobtitle], ["Plats", req.body.location], ["Start datum", req.body.startdate], ["Slut datum", req.body.enddate], ["Beskrivning", req.body.description]];
    const cvID = req.body.id;
    // Tomma fält hanteras på samma sätt som vid post. Skulle ha gjort en funktion, men jag tror jag har råkat skriva dum kod så ifall jag har tid listar jag ut det.
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
        if (await editCVRow(cvID, newData[0][1], newData[1][1], newData[2][1], newData[3][1], newData[4][1], newData[5][1])) {
            res.status(200).json( {valid: true,  message: "Information uppdaterades."} );
        } else {
            res.status(400).json( {valid: false, message: "Kunde inte uppdatera information."});
        }
    }
});

/**
 * Kontrollerar om id inte är undefined/null eller tom sträng.
 */
app.delete('/cv', async (req, res) => {
    if (req.body.id || req.body.id != "") {
        if (await deleteCVRow(req.body.id)) {
            res.status(200).json( {valid: true,  message: "Information raderades."} );
        } else {
            res.status(400).json( {valid: false, message: "Kunde inte radera information."});
        }
    }
});

/**
 * Raderar en rad från databasen beroende på id.
 * @param {number} id - unik nummer för en rad. 
 * @returns {object}
 */
async function deleteCVRow(id) {
    try {
        const results = await db_client.query(`DELETE FROM WorkExperiences WHERE id = $1`, [id]);
        if (!results) {
            return null;
        }
        return results;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Ändrar en rad i databasen beroende på id, alla parametrar är vad de heter.
 * @param {number} id - ett unik nummer för en rad.
 * @param {string} companyname
 * @param {string} jobtitle 
 * @param {string} location 
 * @param {string} startdate 
 * @param {string} enddate 
 * @param {string} description 
 * @returns {object}
 */
async function editCVRow(id, companyname, jobtitle, location, startdate, enddate, description) {
    try {
        const results = await db_client.query(
            `UPDATE WorkExperiences SET companyname = $1, jobtitle = $2, location = $3, startdate = $4, enddate = $5, description = $6 WHERE id = $7`,
            [companyname, jobtitle, location, startdate, enddate, description, id]
        );
        if (!results) {
            return null;
        }
        return results;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Lägger till en rad i databasen med informationen från parametrarna, alla parametrar är vad de heter.
 * @param {string} companyname 
 * @param {string} jobtitle 
 * @param {string} location 
 * @param {string} startdate 
 * @param {string} enddate 
 * @param {string} description 
 * @returns {object}
 */
async function addCVRow(companyname, jobtitle, location, startdate, enddate, description) {
    try {
        const results = await db_client.query(`
            INSERT INTO WorkExperiences (companyname, jobtitle, location, startdate, enddate, description)    
            VALUES ($1, $2, $3, $4, $5, $6);
        `, [companyname, jobtitle, location, startdate, enddate, description]);
        if (!results) {
            return null;
        }
        return results;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Läser rader från databasen.
 * @returns {array} - en array av objekt.
 */
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