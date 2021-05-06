import React from "react";

const RegisterAdmin = () => {
  return (
    <div className="container w-25 text-center">
      <form>
        <h1 className="h3 mb-3 py-4 fw-normal">Please Register</h1>
        <div className="form-floating mb-3">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="email"
            className="form-control"
            id="fullName"
            placeholder="First Name Last Name"
          />
        </div>
        <div className="form-floating">
          <label htmlFor="userName">Username</label>

          <input
            type="email"
            className="form-control"
            id="userName"
            placeholder="username"
          />
        </div>
        <div className="form-floating">
          <label htmlFor="email">Email address</label>

          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
          />
        </div>
        <div className="form-floating">
          <label htmlFor="password">Password</label>

          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
        <div className="form-floating">
          <label htmlFor="password">Confirm Password</label>

          <input
            type="password"
            className="form-control"
            id="password2"
            placeholder="Confirm Password"
          />
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Register
        </button>
        <p className="mt-5 mb-3 text-muted"> &copy 2021</p>
      </form>
    </div>
  );
};

export default RegisterAdmin;
