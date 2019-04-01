const express = require('express');
const helmet = require('helmet');
const bcrypt = require( 'bcrypt');
const USERS = require('./data/dbQueries');
const serverError = require('./middleware/error');

const app = express();
app.use(express.json());
app.use(helmet());

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
        res.status(200).json({ message: 'User logged in succesfully.' });    
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

app.use(serverError);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express app listening at http://127.0.0.1:${PORT}`);
});
