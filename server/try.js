//////
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Models = require('./model/file');
const cors = require('cors');
const compressImages = require("compress-images");
const formidable = require("express-formidable");
const fileSystem = require("fs");
//npm install pngquant-bin@6.0.1 gifsicle@5.2.1 compress-images fs
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
app.use(formidable());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/multer-mongodb')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get('/upload', (req, res) => {
  Models.find()
    .then(resp => res.status(200).json(resp))
    .catch(err => res.status(400).json(err));
});



app.post("/compressImage", function (request, result) {
  const image = request.files.file;
  if (image.size > 0) {

    if (image.type == "image/png" || image.type == "image/jpeg") {
      // var file_final ='';
      fileSystem.readFile(image.path, function (error, data) {
        if (error) throw error
        const filePath = "temp-uploads/" + (new Date().getTime()) + "-" + image.name
        const compressedFilePath = "uploads/"
        const compression = 20

        fileSystem.writeFile(filePath, data, async function (error) {
          if (error) throw error

          compressImages(filePath, compressedFilePath, { compress_force: false, statistic: true, autoupdate: true }, false,
            { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
            { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
            { svg: { engine: "svgo", command: "--multipass" } },
            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
            async function (error, completed, statistic) {
              console.log(error)
              const relativePath = path.relative('uploads/', statistic.path_out_new);
              console.log(relativePath)
              ////// seve it to the database
              Models.create({ image: relativePath })
                .then(res => console.log('res: ',res))
                .catch(err => {
                  console.error(err.message);
                  result.status(500).send('Internal Server Error');
                });
              fileSystem.unlink(filePath, function (error) {
                if (error) throw error
              })
            }
          )

          result.send("File has been compressed and saved.")
        })

        fileSystem.unlink(image.path, function (error) {
          if (error) throw error
        })
      })
    }
    else {
      console.log("Please select an image")
      result.send("Please select an image")
    }
  } else {
    result.send("Please select an image")
  }
})


