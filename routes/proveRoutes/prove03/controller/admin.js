const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
    Product.fetchAll(product => {
      res.render('pages/prove/prove03/admin/add-product', {
        products: product,
        title: "Black Market Art",
        path: '/proveAssignments/prove03'
      });
    });
  };

  exports.postAddProduct = (req, res, next) => {
    console.log(req.body)
    // const title = req.body.title;
    // const imageUrl = req.body.imageUrl;
    // const price = req.body.price;
    // const description = req.body.description;
    // const product = new Product(null, title, imageUrl, description, price);
    // product.save();
    res.redirect('/proveAssignments/prove03');
  };