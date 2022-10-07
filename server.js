const express = require("express")
const PORT = 3000
const app = express()
const sql = require('mysql')
var formidable = require('formidable');
const fs = require("fs");
const { parse } = require("csv-parse");

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

app.get("/newsletter", (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post("/newsletter", (req, res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) throw err
        res.write('File uploaded');
        res.end();
        fs.createReadStream(files.csv.filepath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                console.log(row);
            })

    })
})

app.listen(PORT, () => {
    console.log('running at port', PORT);
})