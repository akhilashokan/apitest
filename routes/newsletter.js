var formidable = require('formidable');
const { parse } = require("csv-parse");
const express = require("express")
const router = express.Router()
const sql = require('mysql')
const fs = require("fs");

const { dirname } = require('path');
const appDir = dirname(require.main.filename);

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
            .on("data", function (row) {
                console.log(row);

            })

    })
})

module.exports = router