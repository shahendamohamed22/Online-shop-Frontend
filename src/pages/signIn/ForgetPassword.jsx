import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import baseUrl from "../../services/Api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: ""
  });

  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(user.email);

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/forgot-password`,
        user
      );

      console.log(response.data);

      localStorage.setItem("email", user.email);
      console.log("save is done");

      navigate("/verifyCode");
      console.log("Navigate is done");


    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
    }
  }

  return (
    <div className="container py-5">
      <form
        onSubmit={handleSubmit}
        className="shadow rounded p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-3">
          Forgot Password
        </h2>

        <p className="text-center text-muted mb-4">
          Enter your email and we'll send you a password reset link.
        </p>

        <div className="mb-4">
          <label className="form-label">
            Email
          </label>

          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-main w-100"
          type="submit"
        >
          Send Reset Link
        </button>

        <p className="text-center mt-4">
          Remember your password?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;