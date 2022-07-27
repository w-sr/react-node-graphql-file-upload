import { gql, useQuery } from "@apollo/client";
import { FileModel, QueryHookResult } from "../type";

// export const GET_FILES = gql`
//   query GetFiles($filters: FilterFileInput!) {
//     getFiles(filters: $filters) {
//       files {
//         file {
//           _id
//           name
//           tags {
//             _id
//             name
//           }
//           public
//           publicUrl
//           url
//         }
//         content
//       }
//       total
//     }
//   }
// `;

export const GET_FILES = gql`
  query GetFiles($filters: FilterFileInput!) {
    getFiles(filters: $filters) {
      files {
        _id
        name
        tags {
          _id
          name
        }
        public
        publicUrl
        url
      }
      total
    }
  }
`;

export const GET_FILE = gql`
  query GetFile($input: FileInput!) {
    getFile(input: $input) {
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
