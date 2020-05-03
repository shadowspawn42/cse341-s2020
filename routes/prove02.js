const express = require('express');
const router = express.Router();

const titles = [];
const summaries = [];

router.get('/',(req, res, next) => {
    res.render('pages/prove02', { 
        title: 'Books, Books, and more Books', 
        path: '/prove02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
        see_Books: false,
        books: titles,
        summaries: summaries,
    });
});

router.post('/book-summary', (req, res, next) => {
    console.log(req.body.book, req.body.summary);
    titles.push({title: req.body.book});
    summaries.push({summary: req.body.summary});
    res.render('pages/prove02', { 
        title: 'Books, Books, and more Books', 
        path: '/prove02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
        see_Books: false,
        books: titles,
        summaries: summaries,
    });
    console.log(titles, summaries);
});

router.get('/see-books', (req, res, next) => {
    res.render('pages/prove02', { 
        title: 'Books, Books, and more Books', 
        path: '/prove02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
        see_Books: true,
        books: titles,
        summaries: summaries,
    });
});

router.post('/remove-books', (req, res, next) => {
    titles.splice(0, titles.length);
    summaries.splice(0, summaries.length);
    res.render('pages/prove02', { 
        title: 'Books, Books, and more Books', 
        path: '/prove02', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
        see_Books: false,
        books: titles,
        summaries: summaries,
    });
    console.log(titles, summaries);
});

module.exports = router;