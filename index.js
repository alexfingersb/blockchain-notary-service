const express = require('express')
const bodyParser = require('body-parser')
const blockchainRoute = require('./model/blockchain/blockchainRoute')
const app = express()
const port = 8000

app.use(bodyParser.json('json'));
app.use('/', blockchainRoute)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.toString() });
})


app.listen(port, () => console.log(`Server listening on port ${port}!`))