const graphql = require('graphql');
const User = require('../app/models/User');

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    name: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    email: {
      type: graphql.GraphQLString
    },
    created_at: {
      type: graphql.GraphQLString
    }
  }
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new graphql.GraphQLList(userType),
        resolve: async function(_, args) {
          const response = await User.find({});

          return response;
        }
      },
      user: {
        type: userType,
        args: {
          id: {
            type: graphql.GraphQLString
          }
        },
        resolve: async function(_, args) {
          const response = await User.findById(args.id);

          return response;
        }
      }
    }
  })
});

module.exports = schema;
