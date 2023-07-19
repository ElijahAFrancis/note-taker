const express = require('express');
const path = require('path');
const port = 3001;
const app = express();
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

app.listen(port, () =>
  console.info(`Example app listening at http://localhost:${port} 🚀`)
);