import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthContext from "./store/auth-context";
import ChatPage from "./pages/ChatPage";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <>
      <Switch>
        <Route path="/" exact>
          {authCtx.isLoggedIn ? <ChatPage /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          {authCtx.isLoggedIn ? <Redirect to="/" /> : <LoginPage />}
        </Route>
        <Route path="/register">
          {authCtx.isLoggedIn ? <Redirect to="/" /> : <RegisterPage />}
        </Route>
      </Switch>
    </>
  );
}

export default App;
