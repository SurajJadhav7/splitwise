const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error(err);
      return res.status(400).send({ status: 404, message: err.message });
  }
  next();
});

app.use('/users', require('./routes/users'));
app.use('/groups', require('./routes/groups'));
app.use('/transactions', require('./routes/transactions'));
app.use('/settlements', require('./routes/settlements'));

app.get('/', (req, res) => {
  res.send('Welcome to Splitwise!');
});

app.all('*', function (req, res) {
  res.status(404).send('Page not found');
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});