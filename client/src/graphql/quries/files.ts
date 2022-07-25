import { gql, useQuery } from "@apollo/client";
import { FileModel, QueryHookResult } from "../type";

export const GET_FILES = gql`
  query getFiles($filter: FileInputFilter) {
    files(filters: $filter) {
      files {
        _id
        name
        tags
        public
        publicUrl
        url
      }
      count
    }
  }
`;

export const GET_FILE = gql`
  query getFile($input: FileInput!) {
    file(input: $input) {
      _id
      name
      tags
      public
      publicUrl
      url
    }
  }
`;

export const useQueryFile = (
  id: string | undefined
): QueryHookResult<FileModel> => {
  const skip = !id;
  const variables = { id };
  const { data, loading } = useQuery(GET_FILE, { variables, skip });
  return { data, loading };
};

export const useQueryFiles = (): QueryHookResult<FileModel[]> => {
  const { data, loading, refetch } = useQuery(GET_FILES);
  return { data: data?.files, loading, refetch };
};
