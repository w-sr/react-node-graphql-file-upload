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
  mutation register($data: RegisterUserInput!) {
    register(registerUserData: $data) {
      user {
        _id
        name
        email
      }
      token
    }
  }
`;
