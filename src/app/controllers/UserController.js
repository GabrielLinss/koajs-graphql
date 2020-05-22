const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
      expiresIn: 86400
  });
}

class UserController {
  async authenticate(ctx, next) {
    const {email, password} = ctx.request.body;

    const user = await User.findOne({email}).select('+password');

    if (!user) {
      ctx.status = 404;
      return ctx.body = [{ error: 'User not found' }];
    }

    if (!await bcrypt.compare(password, user.password)) {
      ctx.status = 400;
      return ctx.body = [{ error: 'Invalid password' }];
    }

    user.password = undefined;

    return ctx.body = { user, token: generateToken({ id: user.id }) };
  }

  async index(ctx, next) {
    try {
      const users = await User.find({}).select('-password');

      return ctx.body = users;
    } catch (error) {
      ctx.status = error.status || 500;
      return ctx.body = error.message;
    }
  }

  async store(ctx, next) {
    try {
      const data = ctx.request.body;

      if (await User.findOne({email: data.email})) {
        ctx.status = 400;
        return ctx.body = [{ message: 'User already exists' }];
      }

      const user = await User.create(data);

      user.password = undefined;

      ctx.status = 201;
      return ctx.body = { user, token: generateToken({ id: user.id }) };
    } catch (error) {
      ctx.status = error.status || 500;
      return ctx.body = error.message;
    }
  }

  async show(ctx, next) {
    try {
      const user = await User.findById(ctx.params.id).select('-password');

      if (!user) {
        ctx.status = 404;
        return ctx.body = [{ message: 'User not found' }];
      }

      return ctx.body = user;
    } catch (error) {
      ctx.status = error.status || 500;
      return ctx.body = error.message;
    }
  }

  async update(ctx, next) {
    let user = await User.findById(ctx.params.id);

    if (!user) {
      ctx.status = 404;
      return ctx.body = [{ message: 'User not found' }];
    }

    try {
      user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true });

      return ctx.body = user;
    } catch (error) {
      ctx.status = error.status || 500;
      return ctx.body = error.message;
    }
  }

  async destroy(ctx, next) {
    const user = await User.findById(ctx.params.id);

    if (!user) {
      ctx.status = 404;
      return ctx.body = [{ message: 'User not found' }];
    }

    try {
      await User.remove({ _id: ctx.params.id });

      return ctx.status = 204;
    } catch (error) {
      ctx.status = error.status || 500;
      return ctx.body = error.message;
    }
  }
}

module.exports = UserController;
