const { v4: uuidv4 } = require('uuid');
const mysqlConnection = require('../db');

const getGroups = (req, res) => {
  const sql = 'SELECT * FROM groupings';
  mysqlConnection.query(sql, (err, rows) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      res.status(500).send({ error: 'Internal server error.' });
    }
  });
}

const createGroup = async (req, res) => {
  const { members, groupname } = req.body;
  if (!members || !groupname) {
    res.status(400).send({ error: 'Please enter all required fields. members and groupname' });
  } else if (!Array.isArray(members) || members.length < 2) {
    res.status(400).send({ error: 'Please enter at least 2 members in Array format.' });
  } else {
    for (let i in members) {
      try {
        await checkUserExists(members[i]);
      } catch(err) {
        res.status(400).send({ error: `Please enter valid user id. User with id ${members[i]} does not exist.` });
        return;
      }
    }
    mysqlConnection.query(`SELECT * FROM groupings WHERE groupname = '${groupname}'`, (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Internal server error.' });
      } else if (rows.length > 0) {
        return res.status(400).send({ error: 'Group with this name already exists.' });
      } else {
        const groupid = uuidv4();
        const sql = `INSERT INTO groupings (id, groupname) VALUES ('${groupid}', '${groupname}')`;
        mysqlConnection.query(sql, (err) => {
          if (err) {
            res.status(400).send({ error: err });
          } else {
            for (let i in members) {
              const id = uuidv4();
              const sql = `INSERT INTO usergroups (id, userid, groupid) VALUES ('${id}', '${members[i]}', '${groupid}')`;
              mysqlConnection.query(sql, (err) => {
                if (err) {
                  res.status(400).send({ error: err });
                }
              });
            }
            res.send({ message: 'Group created successfully.' });
          }
        });
      }
    });
  }
}

const checkUserExists = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE id = '${userId}'`;
    mysqlConnection.query(sql, (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          resolve(true);
        } else {
          reject(false);
        }
      } else {
        reject(err);
      }
    });
  });
}


const getGroup = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM groupings WHERE id = '${id}'`;
  mysqlConnection.query(sql, (err, rows) => {
    if (rows.length > 0) {
      let response = rows[0];
      const sql = `SELECT userid FROM usergroups WHERE groupid = '${id}'`;
      mysqlConnection.query(sql, (err, rows) => {
        if (!err) {
          response.members = rows;
          res.status(200).send(response);
        }
      });
    } else {
      res.status(404).send({ error: 'Group not found. Please enter correct group id.' });
    }
  });
}

module.exports = {
  getGroups,
  createGroup,
  getGroup,
}