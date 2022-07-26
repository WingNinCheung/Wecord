import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/HomePage/PublicServers/ServerList";
import User from "./components/User";
import HomePage from "./components/HomePage";
import { authenticate } from "./store/session";
import CreateForm from "./components/HomePage/createServer";
import EditServerForm from "./components/HomePage/updateServer";
import CreateChannel from "./components/HomePage/Channel/createChannel";
import Splash from "./components/Splash/splash";
import FriendsList from "./components/friends/friends";
import LoginFormModal from "./components/auth/LoginFormModal";

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
      <Switch>
        <Route path="/" exact={true}>
          <Splash />
        </Route>
        <NavBar />
      </Switch>
      <Switch>
        {/* <Route path="/login" exact={true}>
          <LoginForm />
        </Route> */}
        {/* <LoginFormModal /> */}
        {/* <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route> */}
        <ProtectedRoute path="/publicservers" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute path="/home" exact={true}>
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute path="/create-server" exact={true}>
          <CreateForm />
        </ProtectedRoute>
        <ProtectedRoute path="/:serverId/channels/create" exact={true}>
          <CreateChannel />
        </ProtectedRoute>
        <ProtectedRoute path="/friends" exact={true}>
          <FriendsList />
        </ProtectedRoute>
        {/* <ProtectedRoute path="/update-server" exact={true}>
          <EditServerForm />
        </ProtectedRoute> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
