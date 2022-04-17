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
      console.log('Checkout http://localhost:5000/users to get started');
    }
  })
}, 20000);

module.exports = mysqlConnection;