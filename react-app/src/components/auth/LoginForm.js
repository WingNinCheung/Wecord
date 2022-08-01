import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../store/session";
import { useHistory } from "react-router-dom";
import "./LoginFormModal/login.css";

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      history.push("/home");
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <form className="login-container" onSubmit={onLogin}>
      <div>
        {errors.map((error, ind) => (
          <div key={ind} className="error">{error}</div>
        ))}
      </div>
      <h2 className="login-title">Welcome back!</h2>
      <h3 className="login-text">We're excited to see you again!</h3>
      <div className="field">
        <div>
          <div>
            <label htmlFor="email" className="label">EMAIL</label>
          </div>
          <input
            className="field-input"
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div>
          <div>
            <label htmlFor="password" className="label">PASSWORD</label>
          </div>
          <input
            className="field-input"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
          />
        </div>
        <div className="login-but-grp">
          <div>
            <button className="submit-btn" type="submit">
              Login
            </button>
          </div>
          <div>
            <button
              className="submit-btn"
              onClick={() => {
                setPassword("password");
                setEmail("demo@aa.io");
              }}
            >
              Demo User
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
