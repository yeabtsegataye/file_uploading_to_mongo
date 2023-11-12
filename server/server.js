const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Models = require('./model/file')
const cors =require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))

// Connect to MongoDB
mongoose.connect('mongodb://localhost/multer-mongodb')
  .then(()=>{
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err))
/////////
const storage = multer.diskStorage({
  destination: (req,file, cb)=>{
    cb(null, 'uploads')
  },
  filename: (req, file, cb)=>{
    cb(null, file.fieldname + "_"+Date.now()+ path.extname(file.originalname))
  }
});
/////////
const upload = multer({ storage: storage });
// Create a Mongoose model for storing files in MongoDB
app.use((req, res, next)=>{
  console.log(req.path,req.method)
  next();
})
/////
app.get('/upload',(req,res)=>{
  Models.find()
    .then(resp=>res.status(200).json(resp))
    .catch(err=>res.status(400).json(err))
})
/////////
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  
  if (file) {
    // If a file is uploaded
    try {
      Models.create({ image: file.filename })
        .then(result => res.status(200).json(result))
        .catch(err => {
          console.error(err.message);
          res.status(400).json({ error: err.message });
        });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  } else {
    // If no file is uploaded
    res.status(400).json({ error: 'No file uploaded.' });
  }
});



