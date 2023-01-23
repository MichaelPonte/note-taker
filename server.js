const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const uuid = require('./docs/assets/js/uuid');

const PORT = process.env.PORT || 3001;

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('docs'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'docs/index.html'))); //Main landing page

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'docs/notes.html'))); //Notes page

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
}); //Displays all saved notes to the webpage

app.post('/api/notes', (req, res) => { // API for saving the user created notes to the database
    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => { //Reads the db.json file and parses it so it can be used
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => err ? console.log(err) : console.log('Note added!')); //Writes the new note to the db.json file
            }
        });

        res.status(201)
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedNotes = JSON.parse(data);
            const filteredNotes = parsedNotes.filter(note => note.id !== id);

            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4), (err) => err ? console.log(err) : console.log('Note deleted!'));
        }
    });
});
app.listen(PORT);