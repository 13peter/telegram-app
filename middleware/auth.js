module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/login')
    }
    next()
}

// module.exports = function(req, res, next){
//     if(!req.session.isAuthenticated){
//         return res.redirect('/auth/login')
//     }
//     if (req.session.isAuthenticated && req.session.user) {
//         req.user = req.session.user;
//     }
//     next()
// }