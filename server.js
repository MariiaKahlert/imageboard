const {
    selectAllImages,
    selectImage,
    insertImage,
    selectComments,
    insertComment,
} = require("./db");
const { upload } = require("./s3");
const { s3Url } = require("./config.json");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const express = require("express");
const app = express();

// Middlewares

app.use(express.static("public"));
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

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

app.get("/images", (req, res) => {
    selectAllImages()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log(err));
});

app.get("/images/:imageId", (req, res) => {
    selectImage(req.params.imageId)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => console.log(err));
});

app.post("/upload", uploader.single("file"), upload, (req, res) => {
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

app.get("/comments/:imageId", (req, res) => {
    selectComments(req.params.imageId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log(err));
});

app.post("/comment", (req, res) => {
    const { username, comment_text: commentText, image_id: imageId } = req.body;
    insertComment(username, commentText, imageId)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => console.log(err));
});

app.listen(8080, () => console.log("Server listening on port 8080"));
