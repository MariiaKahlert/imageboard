const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.selectAllImages = () => {
    return db.query(
        `
            SELECT * FROM images
            ORDER BY created_at DESC
        `
    );
};

module.exports.insertImage = (title, description, username, url) => {
    return db.query(
        `
            INSERT INTO images
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        [title, description, username, url]
    );
};
