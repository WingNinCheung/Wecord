import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import HomePage from "./components/HomePage";
import { authenticate } from "./store/session";
import CreateForm from "./components/HomePage/createServer";
import EditServerForm from "./components/HomePage/updateServer";

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/users" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <User />
        </ProtectedRoute>
        <Route path="/" exact={true}>
          <h1>Splash page</h1>
        </Route>
        <ProtectedRoute path="/home" exact={true}>
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute path="/create-server" exact={true}>
          <CreateForm />
        </ProtectedRoute>
        {/* <ProtectedRoute path="/update-server" exact={true}>
          <EditServerForm />
        </ProtectedRoute> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
