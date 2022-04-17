const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
  host: 'db',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'splitwise'
});

console.log('Connecting to Database...');
setTimeout(() => {
  mysqlConnection.connect((err) => {
    if (err) {
      console.log('DB connection failed \n Error : ' + err);
    } else {
      console.log('DB connection successful');
    }
  })
}, 20000);

module.exports = mysqlConnection;