import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
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

const httpLink = createHttpLink({
  uri: `${API_ENDPOINT}/graphql`,
});

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
