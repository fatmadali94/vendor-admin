import axios from "axios";
import React from "react";

const BASE_URL = `${import.meta.env.VITE_APP_URL}`;
const TOKEN = JSON.parse(localStorage.getItem("persist:root").user).currentUser
  .accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const UserRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
