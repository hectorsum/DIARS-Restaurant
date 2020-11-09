const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        let extArray = file.mimetype.split("/");
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0');
        var yyyy = date.getFullYear();
        var fullDate = dd + '-' + mm + '-' + yyyy;
        file.originalname = uuid.v4() + '-' + fullDate + '.' + extArray[1];
        cb(null, file.originalname);
    }
});

const uploadImage = multer({
    storage,
    limit: { fileSize: 1000000 }
}).single('image');

module.exports = uploadImage;