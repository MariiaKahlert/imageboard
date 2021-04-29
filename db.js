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
