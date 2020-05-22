const Koa = require('koa');
const respond = require('koa-respond');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const cors = require('@koa/cors');
const routes = require('./src/routes');
require('dotenv').config();

const port = process.env.APP_PORT;
const app = new Koa();
const router = new Router();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser());
app.use(respond());
app.use(cors());

routes(router);

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(process.env.PORT || port);

console.log(`Listening on ${port}`);

module.exports = app.listen();
