const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/routes');

const app = express();
const productresolver = require('../apigateway/graphql/resolvers/productResolver');
const producttypeDef = require('../apigateway/graphql/schema/productSchema.gql');
  
// Middleware to parse JSON
app.use(express.json());

// REST API routes
app.use('/api/users', userRoutes);

// Combine all GraphQL schemas and resolvers
const typeDefs = [ producttypeDef ];
const resolvers = [productresolver];


// Apollo Server config (sans authentification JWT)
const startServer = async () => {
  const server = new ApolloServer({
    
    typeDefs,
    resolvers,
    productresolver,
    
    producttypeDef
   
  });

  await server.start();
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 5000;

  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => {
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🌍 REST API available at http://localhost:${PORT}/api/users`);
    });
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
};

startServer();
module.exports = app;