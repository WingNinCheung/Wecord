import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { signUp } from "../../store/session";

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
      } else {
        history.push("/home");
      }
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <form className="login-container" onSubmit={onSignUp}>
      <div>
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>
      <h2>Create an account</h2>
      <div className="field">
        <div>
          <div>
            <label>User Name</label>
          </div>
        </div>
        <div>
          <input
            className="field-input"
            type="text"
            name="username"
            onChange={updateUsername}
            value={username}
          ></input>
        </div>
        <div>
          <div>
            <label>Email</label>
          </div>
          <div>
            <input
              className="field-input"
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
        </div>
        <div>
          <div>
            <label>Password</label>
          </div>
          <input
            className="field-input"
            type="password"
            name="password"
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <div>
            <label>Confirm Password</label>
          </div>
          <input
            className="field-input"
            type="password"
            name="repeat_password"
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <div className="login-but-grp">
          <button className="submit-btn " type="submit">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
