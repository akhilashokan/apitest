const express = require("express")
const PORT = 3000
const app = express()
const sql = require('mysql')

app.get("/", (req, res) => {
    res.send("hello there")
})

app.post("/addUser", (req, res) => {
    const { firstName, lastName, email, age } = req.query
    if (firstName !== undefined && email !== undefined) {
        let newUser = {
            "First Name": firstName,
            "last Name": firstName,
            "Email": email,
            "Age": age
        }
        let con = sql.createConnection({
            host: "localhost",
            user: 'root',
            password: ''
        })


        // res.send(newUser)

    } else {
        res.send('Failed to add user')
    }

})

app.post("/newsletter")

app.listen(PORT, () => {
    console.log('running at port', PORT);
})