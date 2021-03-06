require('./database/init.db');
const express = require('express');
const cors = require('cors');

const config = require('./configs/configs')();
const { createConnection } = require('./classes/connection.class');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const jwtAuth = require('./middlewares/jwt.middlewares');

const routes = require('./routes/routes');
const Helper = require('./classes/helper.class');

const app = express();
app.use(
  cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jwtAuth);
app.use('/api', routes);

app.get('/checks/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  };

  res.status(200).json(data);
});
app.use((req, res, next) => {
  req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
});

/**
 * Create express.js instance and run it.
 * When the server starts, remove all active games.
 * @param  {number} config.app.port
 * @param  {string} config.app.host
 */
const server = app.listen(config.app.port, config.app.host, () => {
  Helper.clearActiveGames();
  console.log(`${config.app.host} running on port ${config.app.port}`);
});
server.keepAliveTimeout = 65000;
/**
 * Create socket.io instance with custom JSON parser.
 * @param  {socket.io} io
 * @param  {express} server
 * @param  {require('socket.io-msgpack-parser'} parser
 */
const io = require('socket.io')(server, {
  secure: true,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

/**
 * Socket.io middleware to add Cognito JWT validation
 * @param  {socket.io} socket
 * @param  {Function} next
 */
io.use(async (socket, next) => {
  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: socket.handshake.auth.token.payload.iss.split('/')[3],
      tokenUse: 'access',
      clientId: socket.handshake.auth.token.payload.client_id,
    });
    await verifier.verify(socket.handshake.auth.token.jwtToken);
    // eslint-disable-next-line no-empty
  } catch {}
  next();
});
createConnection(io);
