const express = require('express');
const cors = require('cors');
const staff = require('./app/routes/staff');
const shifts = require('./app/routes/shifts');
const tasks = require('./app/routes/tasks');
const stats = require('./app/routes/stats');
const requests = require('./app/routes/requests');
const bodyParser = require('body-parser');
const db = require('./db/models');
const app = express();
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

db.sequelize.sync({force: false})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(cors());

app.use('/staff',staff)
app.use('/shifts', shifts)
app.use('/tasks', tasks)
app.use('/requests', requests)
app.use('/stats',stats)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});