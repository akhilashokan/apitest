var formidable = require('formidable');
const { parse } = require("csv-parse");
const nodemailer = require('nodemailer')
const express = require("express")
const router = express.Router()
const sql = require('mysql')
const fs = require("fs");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
require('dotenv').config()
router.get("/newsletter", (req, res) => {
    res.sendFile(appDir + '/public/index.html')
})

router.post("/newsletter", (req, res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) throw err
        res.write('File uploaded');
        res.end();
        fs.createReadStream(files.csv.filepath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", async function (row) {
                let email = row[0]
                let newsletterContent = row[1]
                let newsletterName = row[2]
                check_user_exists(email, newsletterContent, newsletterName)
            })

    })
})

module.exports = router

function check_user_exists(email, content, name) {
    let con = sql.createConnection({
        host: "localhost",
        database: "testdb",
        user: 'root',
        password: ''
    })
    var query = 'SELECT * FROM `user` WHERE `email`="' + email + '"';
    con.connect((err) => {
        if (err) throw err
        con.query(query, (err, result) => {
            if (err) throw err;
            console.log(result == '');
            if (result == undefined || result == '') {
                console.error('User not found');
            } else {
                let FirstName = result[0].firstName;
                let LastName = result[0].lastName;
                let newContent = `${FirstName} ${LastName}, ${content}`;
                sendMail(email, newContent, name)
                //less secure option disabled by gmail
            }

        })
    })
}

function sendMail(email, content, name) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    })

    let options = {
        from: process.env.EMAIL,
        to: email,
        subject: name,
        text: content
    }
    transporter.sendMail(options, (err, result) => {
        if (err) throw err
        console.log("mail send", result);
    })
}