require('dotenv').config();
const express = require('express'),
      ctrl = require('./emailController'),
      app = express();

app.use(express.json({limit: '500kb'}));

app.post('/api/email', ctrl.email);

app.listen(3333, () => console.log('Server running on 3333'));