import { ApolloError, isApolloError, ServerError } from "@apollo/client";

const getApolloErrorMessage = (error: ApolloError): string | undefined => {
  const { graphQLErrors, networkError } = error;

  if (graphQLErrors.length > 0) {
    const { message } = graphQLErrors[0];
    return message;
  } else if (networkError) {
    return (networkError as ServerError).result.errors[0].message;
  }
};

export const parseErrorMessage = (error: any) => {
  if (isApolloError(error)) {
    const message = getApolloErrorMessage(error);
    if (message) return message;
  }
  const errorMessage = (error as Error).message ?? "Unexpected error";
  return errorMessage;
};
