const express = require("express");
const cors = require('cors')

const app = express();
const port = 3000;
const httpPort = 443
const fs =require("fs")
const bodyParser = require('body-parser')
app.use(cors())
const https = require('https')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/status", (req, res) => {
    console.log(req)
    res.send("Backend Alive");
});

app.get('/links', (req, res) => {
    const links = fs.readFileSync("./links.json", { encoding: 'utf8', flag: 'r' })
    console.log(links)
    res.status(200).json(links)
})

app.post('/links', (req, res) => {
    if (!req.body.issueId || !req.body.reqId) {
        res.status(400).send("error")
        return
    }
    const newLink = req.body
    let linkList = JSON.parse(fs.readFileSync("./links.json"))
    linkList.push(newLink)

    const stringifiedList = JSON.stringify(linkList)

    fs.writeFileSync("./links.json", stringifiedList)

    res.status(201).send("Added a link")
})

const sslKeys = {
    keys: fs.readFileSync('./.cert/cert-key.pem'),
    cert: fs.readFileSync('./.cert/cert.pem')
}
https.createServer(sslKeys, app).listen(httpPort, () => {
    console.log(`Listening to port ${httpPort}`)
})


// app.listen(port, () => {
//     console.log(`Listening port ${port}`);
// });