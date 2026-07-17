import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import baseUrl from "../services/Api";


function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        console.log(user);

        try {
            const response = await axios.post(
                `${baseUrl}/api/customer/auth/login`,
                user
            );
            console.log("Login Success");
            console.log(response.data);

            localStorage.setItem("token", response.data.token);
            console.log("Token Saved");


            navigate("/");

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

            <form className="w-50 mx-auto shadow p-4 rounded" onSubmit={handleSubmit} >
                <h2 className="text-center mb-4">
                    Welcome Back
                </h2>

                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={user.email} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" className="form-control" name="password" value={user.password} onChange={handleChange} />
                </div>

                <div className="text-end mb-3">
                    <Link to="/ForgetPassword" type="button" className="btn btn-link p-0" >
                        ? Forgot Password
                    </Link>
                </div>

                <button className="btn btn-success w-100" type="submit">
                    Login
                </button>

                <div className="text-center my-4">
                    OR
                </div>

                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log("Google Login Failed")}
                />

                <p className="text-center mt-4">
                    <Link to="/Register" type="button" className="btn btn-link">
                        Sign Up
                    </Link>
                    ? Don't have an account
                </p>
            </form>
            <Link to="/ResetPassword" >blah blah</Link>
        </div>
    );
}

export default Login;