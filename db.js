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

module.exports.selectImage = (imageId) => {
    return db.query(
        `
            SELECT * FROM images
            WHERE id = $1
        `,
        [imageId]
    );
};

module.exports.insertImage = (title, description, username, url) => {
    return db.query(
        `
            INSERT INTO images (title, description, username, url)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        [title, description, username, url]
    );
};

module.exports.insertComment = (username, commentText, imageId) => {
    return db.query(
        `
            INSERT INTO comments (username, comment_text, image_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `,
        [username, commentText, imageId]
    );
};
