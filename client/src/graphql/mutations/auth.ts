import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($loginUserData: LoginInput!) {
    login(loginUserData: $loginUserData) {
      user {
        _id
        name
        email
      }
      token
    }
  }
`;

export const REGISTER = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data) {
      user {
        _id
        name
        email
      }
      token
    }
  }
`;
