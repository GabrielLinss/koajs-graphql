const jwt = require('jsonwebtoken');
require('dotenv').config();

class Auth {
    interceptRequest(ctx, next) {
        try{
            const authHeader = ctx.request.headers.authorization;

            if(!authHeader){
                ctx.status = 401;
                return ctx.body = [{ error: 'No token provided' }];
            }

            const parts = authHeader.split(' ');

            if(!parts.length === 2){
                ctx.status = 401;
                return ctx.body = [{ error: 'Token error' }];
            }

            const [scheme, token] = parts;

            if(!/^Bearer$/i.test(scheme)){
                ctx.status = 401;
                return ctx.body = [{ error: 'Token malformated' }];
            }

            if (!token) {
              ctx.status = 401;
              return ctx.body = [{ error: 'Token malformated' }];
            }

            let decoded;

            try {
              decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch(err) {
              ctx.status = 401;
              return ctx.body = [{ error: 'Token invalid' }];
            }

            ctx.request.userId = decoded.id;
            return next();
        } catch (err){
            throw err;
        }
    }
}

module.exports = Auth;
