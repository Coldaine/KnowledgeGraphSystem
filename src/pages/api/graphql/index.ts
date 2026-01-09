import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

export const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server);
