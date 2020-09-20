const express = require('express');
const app = express();

app.use(require('./route/user'));
app.use(require('./route/login'));
app.use(require('./route/job'));
app.use(require('./route/department'));

module.exports = app;