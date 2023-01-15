const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const uuid = require('./public/assets/js/uuid');

const app = express();
const PORT = 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html'))); //Main landing page

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html'))); //Notes page

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
}); //API page for notes

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => err ? console.log(err) : console.log('Note added!'));
            }
        });

        res.status(201)
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT);