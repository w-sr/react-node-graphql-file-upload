import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { API_ENDPOINT } from "../constants";
import { customFetch } from "../utils/common";

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
  credentials: "same-origin",
  fetch: customFetch as any,
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
