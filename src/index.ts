import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import _db from './_db.js';

  // Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      games: () => _db.games,
      game(_, args) {
        return _db.games.find((game) => game.id === args.id)
      },
      reviews: () => _db.reviews,
      review: (_,args) => _db.reviews.find((review) => review.id === args.id),
      authors: () => _db.authors,
      author: (_,args) => _db.authors.find((author) => author.id === args.id),
    },
    Game: {
      reviews(parent) {
        return _db.reviews.filter((review) => review.game_id === parent.id)
      }
    },
    Author: {
      reviews(parent) {
        return _db.reviews.filter((review) => review.author_id === parent.id)
      }
    },
    Review: {
      author(parent) {
        return _db.authors.find((author) => author.id === parent.id)
      },
      game(parent) {
        return _db.authors.find((game) => game.id === parent.id)
      }
    },
    Mutation: {
      deleteGame(_, args) {
        _db.games = _db.games.filter((g) => g.id !== args.id)
        return _db.games
      },
      addGame(_, args) {
        let game = {
          ...args.game, 
          id: Math.floor(Math.random() * 10000).toString()
        }
        _db.games.push(game)
  
        return game
      },
      updateGame(_, args) {
        _db.games = _db.games.map((g) => {
          if(g.id === args.id) {
            return { ...g, ...args.edits }
          }
          return g
        })
        return _db.games.find((g) => g.id === args.id)
      }
    }
  };

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);