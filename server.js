const express = require('express');
const path = require('path');
const port = 3001;
const app = express();
const notes = require('./db/db.json');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => res.status(200).json(notes));

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the new object to add to notes
    const newNote = {
      title,
      text,
      id: newId
    };
    console.log(`newnote: ${newNote}`);

    // Write the string to the file
    fs.readFile('./db/db.json', function (err, data) {
      var json = JSON.parse(data);
      json.push(newNote);    
      fs.writeFile('./db/db.json', JSON.stringify(json), function(err){
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
      });
  })

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.listen(port, () =>
  console.info(`Example app listening at http://localhost:${port} 🚀`)
);