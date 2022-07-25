import { gql } from "@apollo/client";

export const UPDATE_FILE = gql`
  mutation UpdateFile($id: String!, $input: UpdateFileInput!) {
    updateFile(input: $input, _id: $id) {
      _id
      name
      tags
      public
      publicUrl
      url
    }
  }
`;

export const CREATE_FILE = gql`
  mutation CreateFile($input: CreateFileInput!) {
    createFile(createFileData: $input) {
      _id
      name
      tags
      public
      publicUrl
      url
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($id: String!) {
    deleteFile(_id: $id) {
      _id
    }
  }
`;
