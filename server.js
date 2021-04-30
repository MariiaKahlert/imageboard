const { selectAllImages, insertImage } = require("./db");
const { upload } = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { s3Url } = require("./config.json");
const express = require("express");
const app = express();

app.use(express.static("public"));

// Beginning of the code required to upload files

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// End of the code required to upload files

app.use("/images", (req, res) => {
    selectAllImages()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log(err));
});

app.post("/upload", uploader.single("file"), upload, (req, res) => {
    console.log("Upload worked!");
    if (req.file) {
        const { title, description, username } = req.body;
        const { filename } = req.file;
        const fullUrl = s3Url + filename;
        insertImage(title, description, username, fullUrl)
            .then((result) => {
                res.json(result.rows[0]);
            })
            .catch((err) => console.log(err));
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Server listening on port 8080"));
