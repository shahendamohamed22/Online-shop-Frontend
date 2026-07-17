import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import baseUrl from "../../services/Api";

function Register() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    preferredBranchId: "",
  });

  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/branches`);
        setBranches(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchBranches();
  }, []);

  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { confirmPassword, ...registerData } = user;

    try {
      const response = await axios.post(
        `${baseUrl}/api/customer/auth/register`,
        registerData
      );

      console.log(response.data);

    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    const idToken = credentialResponse.credential;

    console.log(idToken);

    try {
      const response = await axios.post(
        `${baseUrl}/api/customer/auth/google`,
        {
          idToken
        }
      );

      console.log(response.data);

    } catch (error) {
      console.log(error.response?.data);
    }
  }

  return (
    <div className="container py-5">
      <form
        onSubmit={handleSubmit}
        className="shadow rounded p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">
          Create Account
        </h2>

        <div className="mb-3">
          <label className="form-label">First Name</label>

          <input
            type="text"
            className="form-control"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>

          <input
            type="text"
            className="form-control"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>

          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>

          <input
            type="tel"
            className="form-control"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label">Preferred brunch</label>
          <select
            className="form-select mb-3"
            name="preferredBranchId"
            value={user.preferredBranchId}
            onChange={handleChange}
          >
            <option value="">Choose Branch</option>

            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>

          <input
            type="password"
            className="form-control"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Confirm Password</label>

          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-main w-100 mb-3"
          type="submit"
        >
          Create Account
        </button>

        <div className="text-center my-3">
          OR
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
        />

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;