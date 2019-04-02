// create a middleware to add to restricted routes
module.exports = {
  mustBeAuthed,
  restrictedUrl,
};

function mustBeAuthed(req, res, next) {  
  // if the session has a user
  if (req.session && req.session.user) {
    // do your thing:
    next();
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
}

function restrictedUrl(req, res, next) {

  if (req.path && req.path.includes('/api/restricted/')) {
    mustBeAuthed(req, res, next)
  } else {
    next();
  }
}
