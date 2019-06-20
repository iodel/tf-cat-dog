const sharp = require('sharp');

const fs = require('fs');

const paths = ['PetImages/Cat', 'PetImages/Dog'];

paths.forEach(
    path => {
        fs.readdir(path, (err, files) => {
            if (err) {
                throw (err);
            }
            files.forEach(fileName => {
                if (fileName.endsWith('.jpg')) {
                    sharp(path + '/' + fileName).resize(150, 150).toFile(`${path}/resized-150/${fileName}`, (err, info) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        });
    }
);



