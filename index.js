const express = require('express');
const connection = require('./sql/connection');
const user = require('./user/user');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(user.checkUser);

connection.connect(function(err) {
    if (err) {
        console.log('error when connecting to db:', err);
    }
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

global.db = connection;
app.get('/api/hello', (req, res) => res.send('Hello World!'));
app.post('/api/user/signup', user.signup);
app.post('/api/user/signin', user.signin);


app.listen(port, () => console.log(`listening on port ${port}!`));