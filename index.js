const express = require('express');
const helmet = require('helmet');
const bcrypt = require( 'bcrypt');
const session = require('express-session');
const USERS = require('./data/dbQueries');
const mustBeAuthed = require('./middleware/auth');
const serverError = require('./middleware/error');

const app = express();

// create session config file to config
const sessionConfig = {
  name: 'user_session',
  secret: 'process.env.SESSION_SECRET', // dont store the secret in your code, save it in an .env file
  cookie: {
    maxAge: 1000 * 60 * 60, // in miliseconds - how long it takes for this cookie to expire
    secure: false, // needs to be true in PRODUCTION!. only do any of this over HTTPS!!!  In testing/dev it can be false, because you're not using HTTPS
  },
  httpOnly: true, // cookie is not accessible with JS
  resave: false, // don't recreate the session if nothing has changed
  saveUninitialized: false, // if there are not changes to this session, do not save anything
}


app.use(express.json());
app.use(helmet());
app.use(session(sessionConfig));

app.get('/', (req, res) => {
  res.status(200).json('[GET] /home');
});


/*
SIGNUP USER
@dev - [POST] - req.body must contain valid username, email and password
@dev - return - array with ID of the user
*/
app.post('/api/register', async(req, res, next) => {
  let { username, email, password } = req.body;
  
  if (username || email || password) {
    try {
      const hash = bcrypt.hashSync(password, 10);  
      password = hash;
      const addNewUser = await USERS.insertUser(username, email, password);
      // create new user in the session object. 
      // I do not want the session to start on register, but only on user login
      // req.session.user = addNewUser;
      res.status(200).json(addNewUser);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: 'Please enter username, email and password.'});
  }
});


/*
LOGIN USER
@dev - [POST] - req.body must contain valid username and password
@dev - returns message/error string
*/
app.post('/api/login', async(req, res, next) => {
  let { username, password } = req.body;
  
  try {
    const savedUser = await USERS.getUserByName(username);

    if (savedUser) {
      const hashedPw = savedUser.password;
      const areTheseProperCredentials = bcrypt.compareSync(password, hashedPw);
      
      if (areTheseProperCredentials) {
        // add new user to the session object
        req.session.user = savedUser;
        res.status(200).json({ message: `Welcome back ${username} :)` });    
      } else {
        res.status(401).json({ error: 'Incorrect password'});
      }

    } else {
      res.status(401).json({ error: `User ${username} does not exist.`});
    }
  } catch (error) {
    next(error);
  }  
});

/*
GET ALL USERS
@dev - [GET] - req.header must contain cookie with proper session info
@dev - returns an array of all users
*/
app.get('/api/users', mustBeAuthed, async (req, res, next) => {
  try {
    const getAllUsers = await USERS.getAllUsers();
    res.status(200).json(getAllUsers);
  } catch (error) {
    next(error);
  }
});

/*
LOG OUT USER
@dev - [GET] - req will destroy the session
@dev - returns a message
*/
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json(`User was logged out`);
});


app.use(serverError);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express app listening at http://127.0.0.1:${PORT}`);
});
