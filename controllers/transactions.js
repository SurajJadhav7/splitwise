const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const getTransaction = (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send({ error: 'Please enter transaction id in params.' });
    return;
  }
  const sql = `SELECT * FROM transactions WHERE id = '${id}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).send({ error: err });
    } else if (rows.length == 0) {
      res.status(404).send({ error: 'Transaction not found for given id.', id });
    } else {
      var response = rows[0];
      const sql = `SELECT * FROM operations WHERE transactionid = '${id}'`;
      db.query(sql, (err, rows) => {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          response.operations = rows;
          res.status(200).send(response);
        }
      });
    }
  });
};

const createTransaction = async (req, res) => {
  const { name, paidby, paidto, groupid } = req.body;
  if (!name || !paidby || !paidto || !groupid ) {
    res.status(400).send({ error: 'Please enter all required fields. name, paidby, paidto, groupid' });
  } else if((paidby !== Object(paidby)) || Array.isArray(paidby) || (paidto !== Object(paidto)) || Array.isArray(paidto)) {
    res.status(400).send({ error: 'Please enter valid paidby and paidto in object format.' });
  } else if (Object.keys(paidby).length == 0 || Object.keys(paidto).length == 0) {
    res.status(400).send({ error: 'Please enter at least one member in paidby and paidto as key value pair.' });
  } else {
    try {
      await checkUsersExist(Object.keys(paidby));
      await checkUsersExist(Object.keys(paidto));
    } catch(err) {
      res.status(400).send({ error: `Please enter valid user id. One or more users does not exist.` });
      return;
    }
    try {
      await checkGroupExists(groupid);
    } catch(err) {
      res.status(400).send({ error: `Please enter valid group id. Group with id ${groupid} does not exist.` });
      return;
    }
    var paidbyAmounts = Object.values(paidby);
    var totalPaidbyAmount = paidbyAmounts.reduce((a, b) => a + b, 0);
    var paidtoAmounts = Object.values(paidto);
    var totalPaidtoAmount = paidtoAmounts.reduce((a, b) => a + b, 0);
    var response = validateTransactionData({ paidbyAmounts, paidtoAmounts, totalPaidbyAmount, totalPaidtoAmount });
    if (response.hasOwnProperty('error')) {
      res.status(400).send(response);
      return;
    } 
    try {
      var transactionid = uuidv4();
      await addTransaction({ transactionid, groupid, name });
    } catch(err) {
      res.status(500).send({ message: 'Error adding transaction to database.', errorr: err });
      return;
    }
    var operationsArray = calculateOperations({ paidby, paidto, totalPaidtoAmount });
    try {
      await addOperations(operationsArray, name, groupid, transactionid);
    } catch(err) {
      res.status(400).send({ error: err });
      return;
    }
    res.status(200).send({ message: 'Transaction created successfully.', transactionid });
  }
}

const addTransaction = ({ transactionid, groupid, name }) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO transactions (id, groupid, detail) VALUES ('${transactionid}', '${groupid}', '${name}')`;
    db.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const addOperations = async (operations, name, groupid, transactionid) => {
  return new Promise(async (resolve, reject) => {
    for (let i in operations) {
      operations[i].name = name;
      operations[i].groupid = groupid;
      operations[i].transactionid = transactionid;
      try {
        await addOperation(operations[i]);
      } catch(err) {
        reject(err);
        return;
      }
    }
    resolve(true);
  });
}

const addOperation = (transaction) => {
  return new Promise((resolve, reject) => {
    const { id, transactionid, groupid, paidby, paidto, amount } = transaction;
    const sql = `INSERT INTO operations (id, groupid, transactionid, paidby, paidto, amount) VALUES ('${id}', '${groupid}', '${transactionid}', '${paidby}', '${paidto}', ${amount})`;
    db.query(sql, (err) => {
      if (!err) {
        resolve(true);
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

const calculateOperations = ({ paidby, paidto, totalPaidtoAmount }) => {
  var operationsArray = [];
  for (let payer in paidby) {
    for (let payee in paidto) {
      if (payer === payee) continue;
      operationsArray.push({
        id: uuidv4(),
        paidby: payer,
        paidto: payee,
        amount: Math.round((paidby[payer]*(paidto[payee]/totalPaidtoAmount))*100)/100,
      });
    }
  }
  return operationsArray;
}


const validateTransactionData = ({ paidbyAmounts, paidtoAmounts, totalPaidbyAmount, totalPaidtoAmount }) => {
  if (checkAmountsFormats(paidbyAmounts) === false || checkAmountsFormats(paidtoAmounts) === false) {
    return { error: 'Please enter valid amounts in format of number with max 2 decimal places.', 
      amounts_received: paidbyAmounts.concat(Object.values(paidtoAmounts)) 
    };
  }
  if (totalPaidbyAmount !== totalPaidtoAmount) {
    return { error: 'Sum of paidby and paidto amounts should be equal. Please check any duplicate keys as well.', 
      sum_of_paidby_received: totalPaidbyAmount, 
      paidby_received: paidbyAmounts,
      sum_of_paidto_received: totalPaidtoAmount, 
      paidto_received: paidtoAmounts,
    };
  }
  return {};
}

const checkAmountsFormats = (values) => {
  for (let i in values) {
    if (checkIntegerOrFloatWithTwoDecimals(values[i]) === false) {
      return false;
    }
  }
  return true;
}

const checkIntegerOrFloatWithTwoDecimals = (n) => {
  return (Number.isInteger(n) || (Number(n) === n && n % 1 !== 0 && n.toString().split('.')[1].length <= 2))
}

const checkUsersExist = async (users) => {
  return new Promise(async (resolve, reject) => {
    for (let i in users) {
      try {
        await checkUserExists(users[i]);
      } catch(err) {
        reject(err);
        return;
      }
    }
    resolve(true);
  });
}

const checkUserExists = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE id = '${userId}'`;
    db.query(sql, (err, rows) => {
      if (rows.length > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

const checkGroupExists = (groupId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM groupings WHERE id = '${groupId}'`;
    db.query(sql, (err, rows) => {
      if (rows.length > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

module.exports = {
  getTransaction,
  createTransaction
}