var amqp = require('amqplib/callback_api');

const express = require("express")
require('dotenv').config();

const PORT = process.env.PORT || 3000
const app = express()

const user = require("./routes/user")
app.use('/', user)

const newsletter = require("./routes/newsletter")
app.use('/', newsletter)

app.get("/", (req, res) => {
    res.send("hello there")
})

app.listen(PORT, () => {
    console.log('running at port', PORT);
})