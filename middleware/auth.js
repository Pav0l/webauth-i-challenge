// create a middleware to add to restricted routes
module.exports = (req, res, next) => {  
  // if the session has a user
  if (req.session && req.session.user) {
    // do your thing:
    next();
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
