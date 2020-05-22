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
    password: {
      type: graphql.GraphQLString
    },
    created_at: {
      type: graphql.GraphQLString
    }
  }
});

const Mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: userType,
      args: {
        name: {
          type: graphql.GraphQLString
        },
        email: {
          type: graphql.GraphQLString
        },
        password: {
          type: graphql.GraphQLString
        }
      },
      resolve: async function(_, args) {
        const response = await User.create({ name: args.name, email: args.email, password: args.password });

        return response;
      }
    },
    editUser: {
      type: userType,
      args: {
        id: {
          type: graphql.GraphQLString
        },
        name: {
          type: graphql.GraphQLString
        },
        email: {
          type: graphql.GraphQLString
        }
      },
      resolve: async function(_, args) {
        const response = await User.findByIdAndUpdate(args.id, args, { new: true });

        return response;
      }
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
  }),
  mutation: Mutation
});

module.exports = schema;
