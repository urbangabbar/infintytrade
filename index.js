const express = require('express');
const user = require('./user/user');
const products = require('./product/product');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(user.checkUser);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/products', products.fetchProducts);
app.post('/api/user/signup', user.signup);
app.post('/api/user/signin', user.signin);

app.listen(port, () => console.log(`listening on port ${port}!`));