const crypto = require("crypto");

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } =  require("express-validator/check");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const RESET_URL = process.env.RESET_URL || "http://localhost:5000/proveAssignments/prove04/reset/";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('pages/prove/prove04/auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {},
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('pages/prove/prove04/auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {},
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()){
      console.log(errors.array())
      return res.status(422).render('pages/prove/prove04/auth/login', {
        path: '/login',
        pageTitle: 'login',
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {email: email, password: password},
        validationErrors: errors.array()
      });
    }

  User.findOne({email: email})
    .then(user => {
        if(!user){
          return res.status(422).render('pages/prove/prove04/auth/login', {
            path: '/login',
            pageTitle: 'login',
            isAuthenticated: false,
            errorMessage: "Invalid email or Password",
            oldInput: {email: email, password: password},
            validationErrors: []
          });
        }
        bcrypt.compare(password, user.password)
            .then(doMatch => {
                if(doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/proveAssignments/prove04');
                    });
                }
                return res.status(422).render('pages/prove/prove04/auth/login', {
                  path: '/login',
                  pageTitle: 'login',
                  isAuthenticated: false,
                  errorMessage: "Invalid email or Password",
                  oldInput: {email: email, password: password},
                  validationErrors: []
                });
            })
            .catch(err => {
                console.log(err);
                res.redirect("login");
            });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('pages/prove/prove04/auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {email: email, password: password, confirmPassword: req.body.confirmPassword},
      validationErrors: errors.array()
    });
  }
  
      bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/proveAssignments/prove04/login');
          return transporter.sendMail({
            to: email,
            from: 'thegreatone@izibop.com',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/proveAssignments/prove04');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('pages/prove/prove04/auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/proveAssignments/prove04/');
        transporter.sendMail({
          to: req.body.email,
          from: 'thegreatone@izibop.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="${RESET_URL}${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('pages/prove/prove04/auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/proveAssignments/prove04/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
