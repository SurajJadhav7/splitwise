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
      var afterSettlements = settleTransactions(beforeSettlements);
      response.afterSettlements = afterSettlements;
      res.status(200).send(response);
    }
  });
}

const calculateMinMax = (map) => {
  let maxObject, minObject;
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;
  for(let user of map.keys()){
      if(map.get(user) < min){
          min = map.get(user)
          minObject = user
      }
      if(map.get(user) > max){
          max = map.get(user)
          maxObject = user
      }
  }
  return [minObject, maxObject];
}

const settleTransactions = (transactions) => {
  var afterSettlements = new Array()
  var map = new Map();

  for (let i in transactions) {
    if (!map.has(transactions[i].userWhoIsGoingToReceive)) {
      map.set(transactions[i].userWhoIsGoingToReceive, 0)
    }
    if (!map.has(transactions[i].userWhoIsGoingToPay)) {
      map.set(transactions[i].userWhoIsGoingToPay, 0)
    }
    map.set(transactions[i].userWhoIsGoingToReceive, map.get(transactions[i].userWhoIsGoingToReceive) + transactions[i].amount)
    map.set(transactions[i].userWhoIsGoingToPay, map.get(transactions[i].userWhoIsGoingToPay) - transactions[i].amount)
  }

  let temp = new Map();
  for(let oneUser of map.keys()){
      temp.set(oneUser, 1);
      for(let anotherUser of map.keys()){
          if(!temp.has(anotherUser) && oneUser != anotherUser){
              if(map.get(anotherUser) == -map.get(oneUser)){
                  if(map.get(anotherUser) > map.get(oneUser)){
                      afterSettlements.push({
                        "userWhoIsGoingToReceive": anotherUser,
                        "userWhoIsGoingToPay": oneUser,
                        "amount": map.get(anotherUser)
                      });
                  } else {
                      afterSettlements.push({
                        "userWhoIsGoingToReceive": oneUser,
                        "userWhoIsGoingToPay": anotherUser,
                        "amount": map.get(oneUser)
                      });
                  }
                  map.set(anotherUser, 0)
                  map.set(oneUser, 0)
              }
          }
      }
  }

  const settle = () => {
    let [minObject, maxObject] = calculateMinMax(map);
    if(minObject == undefined || maxObject == undefined) return;
    let minValue = Math.min(-map.get(minObject), map.get(maxObject));

    map.set(minObject, map.get(minObject) + minValue);
    map.set(maxObject, map.get(maxObject) - minValue);

    afterSettlements.push({
      "userWhoIsGoingToReceive": maxObject,
      "userWhoIsGoingToPay": minObject,
      "amount": minValue
    });
    settle();
  }

  settle();
  return afterSettlements;
}

module.exports = { getSettlement };