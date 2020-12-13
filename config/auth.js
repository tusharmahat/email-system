/**
 * auth.js for authentication
 * @author Tushar
 */
//Export authentication model
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // If the route is not authenticated send message to flash
    req.flash("error_msg", "Please login");
    // Redirect to login page
    res.redirect("/users/login");
  },
};
