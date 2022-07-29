import { gql } from "@apollo/client";

export const UPDATE_FILE = gql`
  mutation UpdateFile($_id: String!, $input: UpdateFileInput!) {
    updateFile(input: $input, _id: $_id) {
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
  }
`;

export const UPLOAD_FILES = gql`
  mutation UploadFiles($input: [Upload!]!) {
    uploadFiles(input: $input) {
      total
    }
  }
`;

export const UPLOAD_FILE = gql`
  mutation UploadFile($input: Upload!) {
    uploadFile(input: $input) {
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
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($_id: String!) {
    deleteFile(_id: $_id) {
      _id
    }
  }
`;
