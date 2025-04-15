# CV-API
Det här är ett REST API skriven i JavaScript med Express för att hantera olika CV-poster. Den har funktioner för CRUD.

## Länk
Webbsidan där API:et kan testas: [CV Webbplats](https://dt207g-m0ment2-frontend.netlify.app/)

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
API:et har fyra olika metoder: `GET`, `POST`, `PUT` och `DELETE`. `GET` kan inte hämta enskild CV-post utan den hämtar hela listan. `POST`, `PUT` och `DELETE` använder body i anropet för de olika egenskaperna/kolumner beskrivna ovan. `DELETE` skulle nog ha passat bättre med en
param istället, men jag tänkte inte på det.
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
Error meddelanden skickas i detta format:

```json
{
    "valid": false,
    "message": {
        "header": "Rubrik",
        "message": "Förtydligande"
    }
}
```
### Exempel
Uppdatera en rad. Där `this.URL` är addressen till API:et och `this.header` är enbart `{"content-type": "application/json"};`
```ts
const resp: Response | null = await fetch(this.URL, {
    method: "PUT",
    headers: this.header,
    body: JSON.stringify(item)
});
if (!resp) {
    return {valid: false, message: {header: "Respons fel", message: "Fick ingen respons vid ändring."}};
}
const validation: IError = await resp.json();
```
