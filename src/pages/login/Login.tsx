import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "../../components/useSignIn/useSignIn";
import axios from "axios";

// const user = useStore((store) => store.user)
// const loginStart = useStore((store) => store.loginStart);
// const logOut = useStore((store) => store.logout)
// const logOut = useStore((store) => store.logout)

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const logInSuccess = useStore((state: any) => state.loginSuccess);
  // @ts-ignore
  // const TOKEN = JSON.parse(
  //   JSON.parse(localStorage.getItem("persist:root")).user
  // ).currentUser.accessToken;

  // const headers = { token: `Bearer ${TOKEN}` };

  const login = async (user: any) => {
    return axios
      .post(`${import.meta.env.VITE_APP_URL}users/login`, user)
      .then((res: any) => res.data);
  };

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data, "this is the result of success");

      logInSuccess(data);
    },
  });

  const handleClick = (e: any) => {
    e.preventDefault();
    const user = { username, password };
    mutation.mutate(user);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Please Login to Dashboard</h1>
      <input
        style={{ padding: 10, marginBottom: 20 }}
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={{ padding: 10, marginBottom: 20 }}
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleClick} style={{ padding: 10, width: 100 }}>
        Login
      </button>
    </div>
  );
};

export default Login;
