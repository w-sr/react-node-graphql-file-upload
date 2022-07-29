import { gql, useQuery } from "@apollo/client";
import { QueryHookResult, Tag } from "../types";

export const GET_TAGS = gql`
  query GetTags {
    getTags {
      _id
      name
    }
  }
`;

export const useQueryTag = (): QueryHookResult<Tag[]> => {
  const { data, loading, refetch } = useQuery(GET_TAGS);
  return { data: data?.getTags, loading, refetch };
};
