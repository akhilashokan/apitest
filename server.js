const express = require("express")
const PORT = 3000
const app = express()
const sql = require('mysql')

app.get("/", (req, res) => {
    res.send("hello there")
})

app.post("/addUser", (req, res) => {
    const { firstName, lastName, email, age } = req.query

    if (firstName !== '' && email !== '' && lastName !== '' && age !== '') {
        let con = sql.createConnection({
            host: "localhost",
            database: "testdb",
            user: 'root',
            password: ''
        })
        var query = "INSERT INTO `user`(`firstName`, `lastName`, `email`, `age`) VALUES (" + `"${firstName}","${lastName}","${email}","${age}") `
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

app.post("/newsletter")

app.listen(PORT, () => {
    console.log('running at port', PORT);
})