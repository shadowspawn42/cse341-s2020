module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn){
        return res.redirect("/proveAssignments/prove04/login")
      }
    next();
}