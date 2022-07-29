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
        publicly
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
      publicly
      publicUrl
      url
    }
  }
`;

export const GET_PRIVATE_FILE_CONTENT = gql`
  query GetPrivateFileContent($data: String!) {
    getPrivateFileContent(data: $data) {
      content
    }
  }
`;

export const GET_PUBLIC_FILE_CONTENT = gql`
  query GetPublicFileContent($data: String!) {
    getPublicFileContent(data: $data) {
      content
    }
  }
`;
