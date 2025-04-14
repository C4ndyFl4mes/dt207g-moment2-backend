# CV-API
Det här är ett REST API skriven i JavaScript med Express för att hantera olika CV-poster. Den har funktioner för CRUD.

## Länk
Webbsidan där API:et kan testas: ...

## Databas
API:et använder en Postgres databas som består av en tabell med följande kolumner:
<table>
    <tr>
        <td colspan="2">WorkExperiences</td>
    </tr>
    <tr>
        <td>ID</td>
        <td>SERIAL PRIMARY KEY</td>
    </tr>
    <tr>
        <td>CompanyName</td>
        <td>VARCHAR(75)</td>
    </tr>
    <tr>
        <td>JobTitle</td>
        <td>VARCHAR(50)</td>
    </tr>
    <tr>
        <td>Location</td>
        <td>VARCHAR(30)</td>
    </tr>
    <tr>
        <td>StartDate</td>
        <td>DATE</td>
    </tr>
    <tr>
        <td>EndDate</td>
        <td>DATE</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>VARCHAR(200)</td>
    </tr>
</table>

## Användning
<table>
  <tr>
    <th>Metod</th>
    <th>Ändpunkt</th>
    <th>Body</th>
    <th>Beskrivning</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/cv</td>
    <td>Tom</td>
    <td>Hämtar alla CV-poster</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/cv</td>
    <td>"companyname", "jobtitle", "location", "startdate", "enddate", "description"</td>
    <td>Lägger till en CV-post</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/cv</td>
    <td>"id", "companyname", "jobtitle", "location", "startdate", "enddate", "description"</td>
    <td>Uppdaterar en CV-post</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/cv</td>
    <td>"id"</td>
    <td>Raderar en CV-post</td>
  </tr>
</table>
