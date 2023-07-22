// declaring variables
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//set default page to index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//set /notes path to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//reads db.json in /db when a /api/notes get request is made
app.get('/api/notes', (req, res) => {
  notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  return res.json(notes);
});

//gets requested note from db.json
app.get('/api/notes/:id', (req, res) => {
  let requestedId = req.params.id;
  notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  // Iterate through notes to see if selected note exists
  for (let i = 0; i < notes.length; i++) {
    if (requestedId === notes[i].id) {
      return res.json(notes[i]);
    }
  }

  // Return a message if the note doesn't exist in our DB
  return res.json('No match found');
});

//deletes selected note from db.json
app.delete('/api/notes/:id', (req, res) => {
  notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  let requestedId = req.params.id;
  // Iterate through the notes to see if selected note exists
  for (let i = 0; i < notes.length; i++) {
    if (requestedId === notes[i].id) {
      notes.splice(i, 1);
      fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) {
        console.log(err);
        } else {
          console.log(fs.readFileSync('./db/db.json'))
        }
      });
      return res.json(notes);
    }
  }

  // Return a message if the note doesn't exist in our DB
  return res.json('No match found');
});


//adds new note to db.json
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
      id: uuidv4()
    };
    console.log(`newnote: ${newNote}`);

    // Write the string to the file
    fs.readFile('./db/db.json', function (err, data) {
      var json = JSON.parse(data);
      json.push(newNote);    
      fs.writeFile('./db/db.json', JSON.stringify(json), function(err){
        if (err) throw err;
        console.log(fs.readFileSync('./db/db.json'));
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