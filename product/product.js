module.exports.fetchProducts = async function(req, res) {
    var sql = "select * from products";
    var query = db.query(sql, function(err, result) {
        res.end(result);
    });
};

module.exports.addProducts = async function(req, res) {
    var productName = req.body.product_name;
    var price = req.body.price;
    var gst = req.body.gst;
    var gst_percent = req.body.gst_percent;
    var primary_cat = req.body.primary_cat;
    var second_cat = req.body.second_cat;
    var third_cat = req.body.third_cat;

    var sql = "INSERT INTO `products`(`product_name`,`last_name`,`email`,`password`) VALUES ('" + fname + "','" + lname + "','" + email + "','" + hash + "')";
    var query = db.query(sql, function(err, result) {
        res.end(result);
    });
};