const express = require('express');
const cors = require('cors');
require('./database/init.db');

const config = require('./configs/configs')();
const { createConnection } = require('./classes/connection.class');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const jwtAuth = require('./middlewares/jwt.middlewares');

const routes = require('./routes/routes');
const Helper = require('./classes/helper.class');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jwtAuth);
app.use('/api', routes);

const server = app.listen(config.app.port, config.app.host, () => {
  Helper.clearActiveGames();
  console.log(`${config.app.host} running on port ${config.app.port}`);
});

const io = require('socket.io')(server, {
  parser: require('socket.io-msgpack-parser'),
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: socket.handshake.auth.token.payload.iss.split('/')[3],
      tokenUse: 'access',
      clientId: socket.handshake.auth.token.payload.client_id,
    });
    next();
    await verifier.verify(socket.handshake.auth.token.jwtToken);
  } catch (err) {
    console.log(`validation failed ${err}`);
  }
});

createConnection(io);
