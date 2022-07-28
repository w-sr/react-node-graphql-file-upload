import { gql } from "@apollo/client";

export const GET_FILES = gql`
  query GetFiles($filters: FilterFileInput!) {
    getFileList(filters: $filters) {
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
  query GetFile($_id: String!) {
    getFile(_id: $_id) {
      _id
      name
      tags
      public
      publicUrl
      url
    }
  }
`;

export const GET_FILE_CONTENT = gql`
  query GetFileContent($data: String!, $type: String!) {
    getFileContent(data: $data, type: $type) {
      content
    }
  }
`;
