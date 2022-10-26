var formidable = require('formidable');
const { parse } = require("csv-parse");
const nodemailer = require('nodemailer')
const express = require("express")
const router = express.Router()
const sql = require('mysql2/promise')
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
                let found = await check_user_exists(email)
                appendAndSend(found, newsletterContent, newsletterName)
            })

    })
})

module.exports = router

async function check_user_exists(email) {
    let con = await sql.createConnection({
        host: "localhost",
        database: "testdb",
        user: 'root',
        password: ''
    })
    const [rows, fields] = await con.execute('SELECT * FROM `users` WHERE `email`=?', [email])
    return rows
}

function appendAndSend(userData, newsletterContent, newsletterName) {
    if (userData == '') return
    let { firstName, lastName, email, age } = userData[0];
    let newContent = `${firstName} ${lastName}, ${newsletterContent}`;
    sendMail(email, newContent, newsletterName)
}

function sendMail(email, content, name) {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.",
        port: 2525,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })
    // transporter.verify(function (error, success) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Server is ready to take our messages');
    //     }
    // });

    let options = {
        from: process.env.EMAIL,
        to: email,
        subject: name,
        text: content
    }
    transporter.sendMail(options, async (err, result) => {
        if (err) {
            await addToSendQueue(options, email, content, name)
            throw err
        }
        console.log("mail send", result);
    })
}

async function addToSendQueue(options, email, newContent, newsletterName) {
    let con = await sql.createConnection({
        host: "localhost",
        database: "testdb",
        user: 'root',
        password: ''
    })
    await con.execute("CREATE TABLE IF NOT EXISTS queue (id INT AUTO_INCREMENT,email VARCHAR(30) NOT NULL,content VARCHAR(225) NOT NULL,letterName VARCHAR(30),options VARCHAR(225),PRIMARY KEY(id))")
    await con.execute("INSERT INTO `queue`(`email`, `content`, `letterName`,`options`) VALUES (?,?,?,?)", [email, newContent, newsletterName, JSON.stringify(options)])
    await con.end()
    console.log('added to queue');
}