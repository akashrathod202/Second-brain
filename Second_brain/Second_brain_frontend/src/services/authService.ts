import api from "./api";

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export type SigninData = {
  email: string;
  password: string;
};

// Normal signup
export const signup = async (data: SignupData) => {
  const response = await api.post("auth/signup", data);

  return response.data;
};

// Normal signin
export const signin = async (data: SigninData) => {
  const response = await api.post("auth/signin", data);

  return response.data;
};

// Get currently logged-in user
export const getuser = async () => {
  const response = await api.get("auth/getuser");

  return response.data;
};

// Google authentication
export const googleSignin = async (credential: string) => {
  const response = await api.post("auth/google", {
    credential,
  });

  

  return response.data;
};


export const googleSignup = async (credential: string) => {
  const response = await api.post("/auth/google/signup", {
    credential,
  });

  return response.data;
};