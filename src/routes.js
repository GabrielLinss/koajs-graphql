function routes(router) {
  const UserController = require('./app/controllers/UserController');
  const AuthMiddleware = require('./app/middlewares/Auth');
  const graphqlHTTP = require('koa-graphql');
  const mount = require('koa-mount');
  const userSchema = require('./graphql/userSchema');
  const userController = new UserController;
  const authMiddleware = new AuthMiddleware;

  router.get('/graphql/users', mount(graphqlHTTP({
    schema: userSchema,
    pretty: true
  })));

  router.post('/authenticate', userController.authenticate);
  router.get('/users', userController.index);
  router.get('/users/:id', userController.show);
  router.post('/users', userController.store);

  router.put('/users/:id', authMiddleware.interceptRequest, userController.update);
  router.delete('/users/:id', authMiddleware.interceptRequest, userController.destroy);
}

module.exports = routes;
