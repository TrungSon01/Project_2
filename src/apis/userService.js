import axios from "axios";

const BASE_URL = "https://681b23bf17018fe5057a3fd7.mockapi.io/login";

export const loginService = async ({ email, password }) => {
  try {
    const response = await axios.get(`${BASE_URL}/register`);
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
  return axios({
    url: `${BASE_URL}/register`,

    method: "POST",
    data: user,
  });
};
