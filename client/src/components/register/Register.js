import classes from "./Register.module.css";
import { useHistory } from "react-router-dom";
import { useState, React } from "react";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

function Register() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post("/user/signup", { name, email, password });
      history.replace("/login");
    } catch (error) {
      setError(error.response.data.error);
    }
    setIsLoading(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <button
          onClick={() => history.push("/login")}
          className={classes.btn}
          type="submit"
        >
          {!isLoading ? (
            "Click for Sign In"
          ) : (
            <CircularProgress size="18px" color="inherit" />
          )}
        </button>
        <form onSubmit={submitHandler} className={classes.form}>
          {error && <p>{error}</p>}
          <label>Name</label>
          <input
            value={name}
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
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
            minLength="6"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button
            className={`${classes.btn} ${classes.loginBtn}`}
            type="submit"
          >
            {!isLoading ? (
              "Sign Up"
            ) : (
              <CircularProgress size="18px" color="inherit" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
