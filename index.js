const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Todo {
    description: String
    isCompleted: Boolean
    isVisible: Boolean
  }

  type Query {
    todos: [Todo]!
  }

  type Mutation {
    createTodo(description: String!):String
    removeTodo(index: Int!):Int
    toggleCompleted(index: Int!):Int
    clearCompleted(index: Int!):Int
  }
`;

const todos = [
  {
    description: 'from server',
    isCompleted: false,
    isVisible: true,
  }
];

const resolvers = {
    Query: {
      todos: () => todos,
    },
    Mutation: {
      clearCompleted: (parent, args, context, info) => {
        console.log('execute from server')
        
        for (let i = todos.length - 1; i >= 0; i--) {
          if (todos[i].isCompleted) {
            todos.splice(i, 1)
          }
        }

        return todos.length;
      },
      toggleCompleted: (parent, args, context, info) => {
        todos[args.index].isCompleted = !todos[args.index].isCompleted;
        return todos[args.index].isCompleted;
      },
      removeTodo: (parent, args, context, info) => {
        todos.splice(args.index, 1);
        return todos.length;
      },
      createTodo: (parent, args, context, info) => {
        return todos.push({
          description: args.description,
          isCompleted: false,
          isVisible: true,
        });
      }
    }
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});