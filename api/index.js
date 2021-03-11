const express = require('express');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require("express-graphql");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();

require('./database');

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

app.use(bodyParser.json());

app.use("/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
)

app.listen(5000, () => {
  console.log('listening on port', 5000);
});