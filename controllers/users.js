const { v4: uuidv4 } = require('uuid');
const mysqlConnection = require('../db');

const getUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  mysqlConnection.query(sql, (err, rows) => {
    if (!err) {
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.status(404).send({ error: 'No users found.' });
      }
    } else {
      console.log(err);
      res.send(err);
    }
  });
}

const createUser = (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).send('Please enter username to create new user');
  } else {
    const sql = `SELECT * FROM users WHERE username = '${username}'`;
    mysqlConnection.query(sql, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          res.status(400).send({ error: 'User with this username already exists.' , user: rows[0] });
        } else {
          const id = uuidv4();
          const sql = `INSERT INTO users VALUES ('${id}', '${username}')`;
          mysqlConnection.query(sql, (err) => {
            if (!err) {
              res.status(200).send({ message: 'User created successfully.', user: { id, username } });
            } else {
              console.log(err);
              res.status(422).send(err);
            }
          });
        }
      } else {
        console.log(err);
        res.status(422).send(err);
      }
    });
  }
}

const getUser = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM users WHERE id = '${id}'`;
  mysqlConnection.query(sql, (err, rows) => {
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ error: 'User not found. Please enter correct user id in url in users/:id format.' });
    }
  });
}

module.exports = {
  getUsers,
  createUser,
  getUser,
}