const { Client } = require("pg");
require("dotenv").config();

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

db_client.query(`
    DROP TABLE IF EXISTS WorkExperiences; 
   
    CREATE TABLE WorkExperiences(
        id SERIAL PRIMARY KEY,
        companyname VARCHAR(75),
        jobtitle VARCHAR(50),
        location VARCHAR(30),
        startdate DATE,
        enddate DATE,
        description VARCHAR(200)
   );
`);

db_client.query(`
    INSERT INTO WorkExperiences (companyname, jobtitle, location, startdate, enddate, description) VALUES
    ('Test1', 'Städare', 'Stockholm', '2025-04-11', '2025-04-12', 'Städar i Test1s lokaler.'),
    ('Test2', 'Lokalvårdare', 'Stockholm', '2025-04-13', '2025-04-14', 'Städar i Test2s lokaler.'); 
`);