const path = require('path');

const express = require('express');
const isAuth = require("../middleware/is-auth");
const { check } =  require("express-validator/check");

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, 
    [
        check('title', 'Please enter a valid title.')
            .isLength({min: 3})
            .trim(),
        check('publisher', 'Please enter a valid publisher.')
            .isLength({min: 3})
            .trim(),
        check('developer', 'Please enter a valid developer.')
            .isLength({min: 3})
            .trim(),
        check('esrb', 'Please enter a valid ESRB.')
            .isAlphanumeric(),
        check('imageUrl', 'Please enter a valid URL.')
            .isURL(),
        check('price', 'Please enter a valid price.')
            .isFloat(),
        check('description', 'Please enter a valid description.')
            .isLength({min: 8})
            .trim()
    ], 
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth,
    [
        check('title', 'Please enter a valid title.')
            .isLength({min: 3})
            .trim(),
        check('publisher', 'Please enter a valid publisher.')
            .isLength({min: 3})
            .trim(),
        check('developer', 'Please enter a valid developer.')
            .isLength({min: 3})
            .trim(),
        check('esrb', 'Please enter a valid ESRB.')
            .isAlphanumeric(),
        check('imageUrl', 'Please enter a valid URL.')
            .isURL(),
        check('price', 'Please enter a valid price.')
            .isFloat(),
        check('description', 'Please enter a valid description.')
            .isLength({min: 8})
            .trim()
    ],   
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
