const express = require('express');
const app = express();
const connect = require('./db');
require('dotenv').config();
const cors = require('cors')
app.use(cors())
const port = process.env.PORT || 3000;
const host = "127.0.0.1";
connect();
app.use(express.json());
app.use('/api/auth', require('./routes/router'))
app.listen(port, () => {
    console.log(`server is running at http://${host}:${port}/`);
})
