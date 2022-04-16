const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const getSettlement = (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send({ error: 'Please enter group id for which settlements are required in params.' });
    return;
  }
  const sql = `SELECT * FROM operations WHERE groupid = '${id}'`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else if (rows.length == 0) {
      res.status(404).send({ error: 'Transactions not found for given group id.' });
    } else {
      var settlements = {};
      rows.forEach(element => {
        var pair = element.paidby+':'+element.paidto;
        if (settlements.hasOwnProperty(pair)) {
          settlements[pair] += element.amount;
        } else {
          var reversePair = element.paidto+':'+element.paidby;
          if (settlements.hasOwnProperty(reversePair)) {
            settlements[reversePair] -= element.amount;
          } else {
            settlements[pair] = element.amount;
          }
        }
      });
      var beforeSettlements = [];
      for (var key in settlements) {
        var pair = key.split(':');
        if (settlements[key] != 0) {
          if (settlements[key] > 0) {
            beforeSettlements.push({ userWhoIsGoingToReceive: pair[0], userWhoIsGoingToPay: pair[1], amount: settlements[key] });
          } else {
            beforeSettlements.push({ userWhoIsGoingToReceive: pair[1], userWhoIsGoingToPay: pair[0], amount: -settlements[key] });
          }
        }
      }
      var response = { beforeSettlements: beforeSettlements };
      res.status(200).send(response);
    }
  });
}

module.exports = {
  getSettlement
}