const Product = require("../model/product");

exports.index = (req, res, next) => {
    Product.fetchAll(product => {
      res.render('pages/prove/prove03/shop/shop', {
        products: product,
        title: "Black Market Art",
        path: '/proveAssignments/prove03'
      });
    });
  };

  exports.details = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId, product => {
      res.render('pages/prove/prove03/shop/details', {
        product: product,
        title: "Black Market Art",
        path: '/proveAssignments/prove03'
      });
    });
  };