import { gql, useQuery } from "@apollo/client";
import { QueryHookResult, User } from "../types";

export const ME_QUERY = gql`
  query MeQuery {
    me {
      _id
      name
      email
    }
  }
`;

export const useQueryMe = (): QueryHookResult<User> => {
  const { data, loading } = useQuery(ME_QUERY);
  return { data: data?.me, loading };
};
