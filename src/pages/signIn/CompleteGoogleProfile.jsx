import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../services/Api";

function CompleteGoogleProfile() {
    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);

    const [user, setUser] = useState({
        phoneNumber: "",
        preferredBranchId: "",
    });

    useEffect(() => {
        getBranches();
    }, []);

    async function getBranches() {
        try {
            const response = await axios.get(`${baseUrl}/api/branches`);

            setBranches(response.data);
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    const idToken = localStorage.getItem("googleIdToken");
    const email = localStorage.getItem("googleEmail");
    const firstName = localStorage.getItem("googleFirstName");
    const lastName = localStorage.getItem("googleLastName");

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${baseUrl}/api/customer/auth/google`,
                {
                    idToken,
                    phoneNumber: user.phoneNumber,
                    preferredBranchId: Number(user.preferredBranchId),
                }
            );

            console.log(res.data);

            localStorage.setItem("token", res.data.token);

            localStorage.removeItem("googleIdToken");
            localStorage.removeItem("googleEmail");
            localStorage.removeItem("googleFirstName");
            localStorage.removeItem("googleLastName");

            navigate("/");
        } catch (error) {
            console.log(error.response?.status);
            console.log(error.response?.data);
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center ">
            <div style={{ width: "100%", maxWidth: "500px" }} className="px-3">
                <form
                    className="shadow rounded p-4 mx-auto"
                    style={{ maxWidth: "500px" }}
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-center mb-4">
                        Complete Your Registration
                    </h2>

                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phoneNumber"
                            placeholder="01012345678"
                            value={user.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Preferred Branch</label>
                        <select
                            className="form-select"
                            name="preferredBranchId"
                            value={user.preferredBranchId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Branch</option>

                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-main w-100">
                        Complete Registration
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompleteGoogleProfile;