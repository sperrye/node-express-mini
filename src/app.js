const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('../words.txt', 'utf8');
  return contents.split('\n');
};

const guessed = {};
const words = readWords(); //contain array of words
const index = Math.floor(Math.random() * words.length);
//gets a random index

const word = words[index];
console.log(word);


// let wordSoFar = word.replace(/([a-zA-Z])/g, '-');
// console.log(wordSoFar);

server.post('/guess', (req, res) => {
  //request body req.body
  const letter = req.body.letter;
  if (!letter) {
    res.status(STATUS_USER_ERROR);
    res.json({error: "Must provide a letter."});
    return;
  }
  if (letter.length !== 1) {
    res.status(STATUS_USER_ERROR);
    res.json({error: "Must provide a single letter."});
    return;
  }
  if (guessed[letter]) {
    res.send(`${letter} already guessed.`);
  }
  if (word.split('').includes(req.body.letter)) {
    guessed[letter] = true;
    res.send(`word contains ${req.body.letter} !`);
  }
});

server.get('/', (req, res) => {
  const wordSoFarArray = Array.from(word).map((letter) => {
    if (guessed[letter]) {
      return letter;
    }
    return '-';
  });
  const wordSoFarString = wordSoFarArray.join('');
  res.send({ wordSoFarString, guessed });
});

server.listen(8080);
