const express = require("express")
const router = express.Router()
const sql = require('mysql2')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.use(express.urlencoded({ extended: true }));

router.post("/addUser", jsonParser, (req, res) => {
    const { firstName, lastName, email, age } = req.body
    if (firstName != undefined && email != undefined && lastName != undefined && age !== undefined) {
        let con = sql.createConnection({
            host: "localhost",
            database: "testdb",
            user: 'root',
            password: ''
        })
        var query = "INSERT INTO `users`(`firstName`, `lastName`, `email`, `age`) VALUES (" + `"${firstName}","${lastName}","${email}","${age}") `
        con.connect((err) => {
            if (err) throw err
            con.query(query, (err, result) => {
                if (err) {
                    res.send("Failed to add user")
                    throw err
                }
                res.status(200)
                res.send("new user added")
            })
        })
    } else {
        res.send('Failed to add user')
    }
})

module.exports = router