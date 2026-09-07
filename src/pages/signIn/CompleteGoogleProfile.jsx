import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../services/Api";
import { validatePhone } from "../../services/validation";
import { useAuth } from "../../context/AuthContext";

function CompleteGoogleProfile() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [user, setUser] = useState({
        phoneNumber: "",
        preferredBranchId: "",
    });

    const [branches, setBranches] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/branch`);
                setBranches(response.data ?? []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBranches();
    }, []);

    const idToken = localStorage.getItem("googleIdToken");

    function handleChange(e) {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value,
        });

        // امسحي الخطأ بمجرد تعديل الحقل
        if (errors[name]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    }

    function validate() {
        const newErrors = {};

        const phoneError = validatePhone(user.phoneNumber);
        const branchError = validateBranch(user.preferredBranchId);

        if (phoneError) {
            newErrors.phoneNumber = phoneError;
        }

        if (branchError) {
            newErrors.preferredBranchId = branchError;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Frontend validation
        if (!validate()) return;

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

            await login(res.data.token);

            localStorage.removeItem("googleIdToken");
            localStorage.removeItem("googleEmail");
            localStorage.removeItem("googleFirstName");
            localStorage.removeItem("googleLastName");

            toast.success("تم تسجيل الدخول بنجاح");
            navigate("/");
        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);

            const backendErrors = error.response?.data?.errors;

            if (backendErrors) {
                const formattedErrors = {};

                if (backendErrors.PhoneNumber) {
                    formattedErrors.phoneNumber =
                        backendErrors.PhoneNumber[0];
                }

                if (backendErrors.PreferredBranchId) {
                    formattedErrors.preferredBranchId =
                        backendErrors.PreferredBranchId[0];
                }

                setErrors(formattedErrors);
            } else if (error.response?.data?.message) {
                setErrors({
                    phoneNumber: error.response.data.message,
                });
            } else {
                setErrors({
                    phoneNumber: "حصل خطأ أثناء إكمال التسجيل",
                });
            }
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div
                style={{ width: "100%", maxWidth: "500px" }}
                className="px-3"
            >
                <form
                    className="shadow rounded p-4 mx-auto"
                    style={{ maxWidth: "500px" }}
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-center mb-4">
                        Complete Your Registration
                    </h2>

                    {/* Phone Number */}
                    <div className="mb-3">
                        <label className="form-label">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""
                                }`}
                            name="phoneNumber"
                            placeholder="01012345678"
                            value={user.phoneNumber}
                            onChange={handleChange}
                        />

                        {errors.phoneNumber && (
                            <div className="text-danger small mt-1">
                                {errors.phoneNumber}
                            </div>
                        )}
                    </div>

                    {/* Preferred Branch */}
                    <div className="mb-4">
                        <label className="form-label">
                            Preferred Branch
                        </label>

                        <select
                            className={`form-select ${errors.preferredBranchId ? "is-invalid" : ""
                                }`}
                            name="preferredBranchId"
                            value={user.preferredBranchId}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select Branch
                            </option>

                            {branches.map((branch) => (
                                <option
                                    key={branch.id}
                                    value={branch.id}
                                >
                                    {branch.name}
                                </option>
                            ))}
                        </select>

                        {errors.preferredBranchId && (
                            <div className="text-danger small mt-1">
                                {errors.preferredBranchId}
                            </div>
                        )}
                    </div>

                    <button
                        className="btn btn-main w-100"
                        type="submit"
                    >
                        Complete Registration
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompleteGoogleProfile;
