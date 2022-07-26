import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config } from "../config";

export const encryptPassword = (password: string) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
        return false;
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
          return false;
        }
        resolve(hash);
        return true;
      });
    });
  });

export const comparePassword = (password: string, hash: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      resolve(isMatch);
      return true;
    } catch (err) {
      reject(err);
      return false;
    }
  });

export const getToken = (payload: any) => {
  const token = jwt.sign(payload, config.salt, {
    expiresIn: 604800,
  });
  return token;
};

export const getPayload = (token: string) => {
  try {
    const payload = jwt.verify(token, config.salt);
    return { isLoggedIn: true, payload };
  } catch (err) {
    // Message
    return { isLoggedIn: false };
  }
};
