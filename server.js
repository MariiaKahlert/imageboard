const { selectAllImages } = require("./db");
const express = require("express");
const app = express();

app.use(express.static("public"));

app.use("/images", (req, res) => {
    selectAllImages()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log(err));
});

app.listen(8080, () => console.log("Server listening on port 8080"));
