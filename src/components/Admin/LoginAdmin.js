import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router";
import Alert from "../common/Alert";

const loginDetails = {
  username: "admin",
  password: "admin",
};

const LoginAdmin = () => {
  const [logged, setLogged] = useState(null);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm();

  const history = useHistory();

  const handleLoginSubmit = (data) => {
    const loggedIn =
      data.username === loginDetails.username
        ? data.password === loginDetails.password
          ? true
          : "Password not matched"
        : "Username not matched";

    if (loggedIn) {
      localStorage.setItem("loginStatus", true);
      setLogged(true);
      history.push("/");
      window.location.reload();
    }
  };

  if (logged) {
    // return <Redirect to="/" />
  }

  return (
    <div className="py-4 container text-center w-25 form-container">
      <form onSubmit={handleSubmit(handleLoginSubmit)} noValidate>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <div className="form-floating">
          {errors.username && <Alert title="Username is Required!!" />}
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com/username"
            {...register("username", { required: true })}
          />
          <label htmlFor="floatingInput">Email address/Username</label>
        </div>
        <div className="form-floating">
          {errors.password && <Alert title="password is Required!!" />}
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="checkbox mb-3">
          <label>
            <input type="checkbox" defaultValue="remember-me" /> Remember me
          </label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
        <p className="mt-5 mb-3 text-muted">© 2021</p>
      </form>
    </div>
  );
};

export default LoginAdmin;
