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
      public
      publicUrl
      url
    }
  }
`;

export const CREATE_FILE = gql`
  mutation CreateFile($input: [Upload!]!) {
    createFile(input: $input) {
      total
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

export const CREATE_PUBLIC_URL = gql`
  mutation CreatePublicUrl($_id: String!) {
    createPublicUrl(_id: $_id) {
      _id
    }
  }
`;

export const FILE_UPLOAD_PROGRESS = gql`
  subscription UploadProgress($sessionId: String!) {
    uploadProgress(sessionId: $sessionId) {
      progress
    }
  }
`;
