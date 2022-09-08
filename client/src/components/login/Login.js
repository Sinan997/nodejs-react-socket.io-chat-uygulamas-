import React, { useState, useContext } from "react";
import classes from "./Login.module.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { CircularProgress } from "@material-ui/core";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post("/user/login", { email, password });
      console.log(res);
      setError(null);
      authCtx.login(
        res.data.token,
        res.data.expiresIn,
        res.data.name,
        res.data.userId,
        res.data.email
      );
      history.replace("/");
    } catch (error) {
      setError(error.response.data.error);
    }
    setIsLoading(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <button
          onClick={() => history.push("/register")}
          className={classes.btn}
          type="submit"
        >
          {!isLoading ? (
            "Click for Sign Up"
          ) : (
            <CircularProgress size="18px" color="inherit" />
          )}
        </button>
        <form onSubmit={submitHandler} className={classes.form}>
          {error && <p>{error}</p>}
          <label>Email</label>
          <input
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
          ></input>
          <button
            className={`${classes.btn} ${classes.loginBtn}`}
            type="submit"
          >
            {!isLoading ? (
              "Sign In"
            ) : (
              <CircularProgress size="18px" color="inherit" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
