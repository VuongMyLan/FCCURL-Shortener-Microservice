require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 5000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
    res.json({ greeting: 'hello API' });
});

const shortURL = {};
let number = 1;
app.post('/api/shorturl', (req, res) => {
    let url = req.body.url;
    const regex = new RegExp(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
    );
    if (url.match(regex)) {
        // url = new URL(req.body.url);
        shortURL[number] = url;

        res.json({
            original_url: url,
            short_url: number,
        });
        number += 1;
    } else {
        res.json({ error: 'invalid url' });
        return;
    }
});

app.get('/api/shorturl/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    let url = shortURL[id];
    console.log(shortURL);
    console.log(shortURL[id]);
    res.redirect(url);
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
