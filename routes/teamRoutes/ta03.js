//TA03 PLACEHOLDER
const express = require('express');
const fs = require('fs');
const path = require("path");
const router = express.Router();

let items = [];
const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "ta03.json"
);

router.get('/',(req, res, next) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
          items;
        } else {
            // console.log(JSON.parse(fileContent));
          items = JSON.parse(fileContent);
          res.render('pages/teamActivities/ta03', { 
            title: 'Team Activity 03', 
            path: '/ta03', // For pug, EJS 
            activeTA03: true, // For HBS
            contentCSS: true, // For HBS
            products: items,
        });
        }
      });

});

router.post('/filter', (req, res, next) => {
    const filteredItems = [];
    for(var i = 0; i < items.length; i++){
        for(var j = 0; j < items[i].tags.length; j++){
            if(items[i].tags[j] === req.body.filter){
                filteredItems.push(items[i]);
            }
        };
    };
    console.log(filteredItems);
    res.render('pages/teamActivities/ta03', { 
        title: 'Team Activity 03', 
        path: '/ta03', // For pug, EJS 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
        products: filteredItems,
    });
});

module.exports = router;