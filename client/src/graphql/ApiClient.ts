import {
  ApolloClient,
  ApolloLink,
  // createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { createClient } from "graphql-ws";
import { API_ENDPOINT } from "../constants";

const authorizationMiddleware = setContext(async (_, { headers }) => {
  const getSession = async () => localStorage.getItem("token");
  const token = await getSession();
  return {
    headers: {
      ...headers,
      authorization: `${token}`,
    },
  };
});

const httpLink = createUploadLink({
  uri: `${API_ENDPOINT}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://localhost:4000/subscriptions`,
    // connectionParams: {
    //   authToken: user.authToken,
    // },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {},
  }),
  defaultOptions: {
    query: {
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
      returnPartialData: false,
    },
  },
});

client.setLink(ApolloLink.from([authorizationMiddleware, httpLink]));

export default client;
