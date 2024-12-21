const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Render the upload form
app.get('/', (req, res) => {
  res.render('index');
});

// Handle single file upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.send(`File uploaded successfully! <a href="/uploads/${req.file.filename}">View File</a> <a href="/">Upload another file</a>`);
});

// Handle multiple file upload
app.post('/upload-multiple', upload.array('files', 10), (req, res) => {  // limit to 10 files
  const fileLinks = req.files.map(file => `<a href="/uploads/${file.filename}">${file.filename}</a>`).join('<br>');
  res.send(`Files uploaded successfully! <br>${fileLinks} <br><a href="/">Upload more files</a>`);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
