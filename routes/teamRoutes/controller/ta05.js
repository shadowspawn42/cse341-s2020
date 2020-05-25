exports.getIndex = ((req, res, next) => {

    if (req.session.counter === undefined) {
        req.session.counter = 0;
    }
    if (!req.session.style === undefined) {
        req.session.style = 0;
    }

    res.render('pages/teamActivities/ta05', { 
        title: 'Team Activity 05', 
        path: '/ta05', // For pug, EJS
        style: req.session.style,
        counter: req.session.counter
        
    });
});

exports.postStyle = (req, res, next) => {
    req.session.style = req.body.css_style;
    res.redirect('/teamActivites/ta05'); 
};

exports.resetSession = (req, res, next) => {
        req.session.destroy(() => {
            res.redirect('/teamActivites/ta05');  
        })
    
};

exports.postCounter= (req, res, next) => {
    req.session.counter += Number(req.body.constant); 
    res.redirect('/teamActivities/ta05');
};