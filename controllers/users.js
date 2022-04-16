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
          res.status(400).send('User already exists');
        } else {
          const sql = `INSERT INTO users VALUES ('${uuidv4()}', '${username}')`;
          mysqlConnection.query(sql, (err) => {
            if (!err) {
              res.status(200).send(`User ${username} added`);
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
      res.status(404).send({ error: 'User not found. Please enter correct user id.' });
    }
  });
}

module.exports = {
  getUsers,
  createUser,
  getUser,
}