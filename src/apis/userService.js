import axios from "axios";
import { https } from "./config";

export const loginService = async ({ email, password }) => {
  try {
    const response = await https.get(`/register`);
    const users = response.data;

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      return foundUser;
    } else {
      throw new Error("User not found or incorrect password");
    }
  } catch (error) {
    console.error("Error while logging in: ", error);
    throw error;
  }
};

export const registerService = (user) => {
  return https.post(`/register`, user);
};
