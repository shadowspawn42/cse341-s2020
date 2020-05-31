const Product = require('../models/product');
const { validationResult } =  require("express-validator/check");


exports.getAddProduct = (req, res, next) => {
  res.render('pages/prove/prove04/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    hasError: false,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.user);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const publisher = req.body.publisher;
  const developer = req.body.developer;
  const esrb = req.body.esrb;

  const errors = validationResult(req);
    if (!errors.isEmpty()){
      console.log(errors.array())
      return res.status(422).render('pages/prove/prove04/admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: errors.array()[0].msg,
        product: {title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user, developer: developer, publisher: publisher, esrb: esrb},
        hasError: true,
        validationErrors: errors.array()
      });
    }

  const product = new Product ({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user, developer: developer, publisher: publisher, esrb: esrb});
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('pages/prove/prove04');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    // Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('pages/prove/prove04/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedDeveloper = req.body.developer;
  const updatedPublisher = req.body.publisher;
  const updatedESRB = req.body.esrb;

  const errors = validationResult(req);
    if (!errors.isEmpty()){
      console.log(errors.array())
      return res.status(422).render('pages/prove/prove04/admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: true,
        errorMessage: errors.array()[0].msg,
        product: {title: updatedTitle, price: updatedPrice, description: updatedDesc, imageUrl: updatedImageUrl, userId: req.user, developer: updatedDeveloper, publisher: updatedPublisher, esrb: updatedESRB, _id: prodId},
        hasError: true,
        validationErrors: errors.array()
      });
    }

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      product.developer = updatedDeveloper;
      product.publisher = updatedPublisher;
      product.esrb = updatedESRB;
      return product.save()
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('pages/prove/prove04/admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
