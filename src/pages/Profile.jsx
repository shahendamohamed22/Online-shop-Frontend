import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import OrdersPreview from "./orders/OrdersPreview";
import { validatePhone, validateRequired, validatePassword } from "../services/validation";

// صفحة جديدة - بتستخدم:
// GET /api/customer/profile, PUT /api/customer/profile, PUT /api/customer/profile/change-password
function Profile() {
  const [profile, setProfile] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, branchesRes] = await Promise.all([
          axiosInstance.get("/api/customer/profile"),
          axiosInstance.get("/api/branch"),
        ]);
        setProfile(profileRes.data);
        setBranches(branchesRes.data ?? []);
      } catch (error) {
        console.log(error);
        toast.error("محتاجة تسجّلي دخول عشان تشوفي بياناتك");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    setSaving(true);
    try {
      await axiosInstance.put("/api/customer/profile", {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        preferredBranchId: Number(profile.preferredBranchId),
      });
      toast.success("تم تحديث البيانات بنجاح");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const validationErrors = validatePasswordChange();

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...validationErrors,
      }));
      return;
    }

    setChangingPassword(true);

    try {
      await axiosInstance.put("/api/customer/profile/change-password", {
        CurrentPassword: passwords.currentPassword,
        NewPassword: passwords.newPassword,
      });
      toast.success("تم تغيير كلمة السر بنجاح");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "حدث خطأ أثناء تغيير الباسورد");
    } finally {
      setChangingPassword(false);
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    const phoneError = validatePhone(profile.phoneNumber);

    if (phoneError) {
      newErrors.phoneNumber = phoneError;
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors = {};

    const currentPasswordError = validateRequired(
      passwords.currentPassword,
      "كلمة السر الحالية"
    );

    const newPasswordError = validatePassword(
      passwords.newPassword
    );

    if (currentPasswordError) {
      newErrors.currentPassword = currentPasswordError;
    }

    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }

    return newErrors;
  };

  if (loading) return <p className="container mt-4">جاري التحميل...</p>;
  if (!profile) return <p className="container mt-4">محتاج تسجّل دخول الأول.</p>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/");
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <h2 className="badge bg-main fs-4 mb-4">بياناتي</h2>

      <form onSubmit={handleSaveProfile} className="mb-5">
        <div className="row g-2 mb-3">
          <div className="col-6">
            <label className="form-label">الاسم الأول</label>
            <input
              className={`form-control ${errors.firstName ? "is-invalid" : ""
                }`}
              name="firstName"
              value={profile.firstName ?? ""}
              onChange={handleChange}
            />

            {errors.firstName && (
              <div className="text-danger small mt-1">
                {errors.firstName}
              </div>
            )}
          </div>
          <div className="col-6">
            <label className="form-label">الاسم الأخير</label>
            <input
              className={`form-control ${errors.lastName ? "is-invalid" : ""
                }`}
              name="lastName"
              value={profile.lastName ?? ""}
              onChange={handleChange}
            />

            {errors.lastName && (
              <div className="text-danger small mt-1">
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">الإيميل</label>
          <input className="form-control" value={profile.email} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">رقم التليفون</label>
          <input
            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""
              }`}
            name="phoneNumber"
            value={profile.phoneNumber ?? ""}
            onChange={handleChange}
          />

          {errors.phoneNumber && (
            <div className="text-danger small mt-1">
              {errors.phoneNumber}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">الفرع المفضل</label>
          <select
            className="form-select"
            name="preferredBranchId"
            value={profile.preferredBranchId ?? ""}
            onChange={handleChange}
          >
            <option value="">اختاري فرع</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-main w-50" type="submit" disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>

      <h3 className="badge bg-main fs-4 mb-3">تغيير كلمة السر</h3>
      <form onSubmit={handleChangePassword}>
        <div className="mb-3">
          <label className="form-label">كلمة السر الحالية</label>

          <input
            type="password"
            className={`form-control ${errors.currentPassword ? "is-invalid" : ""
              }`}
            value={passwords.currentPassword}
            onChange={(e) => {
              setPasswords({
                ...passwords,
                currentPassword: e.target.value,
              });

              if (errors.currentPassword) {
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.currentPassword;
                  return updated;
                });
              }
            }}
          />

          {errors.currentPassword && (
            <div className="text-danger small mt-1">
              {errors.currentPassword}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">كلمة السر الجديدة</label>

          <input
            type="password"
            className={`form-control ${errors.newPassword ? "is-invalid" : ""
              }`}
            value={passwords.newPassword}
            onChange={(e) => {
              setPasswords({
                ...passwords,
                newPassword: e.target.value,
              });

              if (errors.newPassword) {
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.newPassword;
                  return updated;
                });
              }
            }}
          />

          {errors.newPassword && (
            <div className="text-danger small mt-1">
              {errors.newPassword}
            </div>
          )}
        </div>
        <button className="btn btn-outline-secondary w-50" type="submit" disabled={changingPassword}>
          {changingPassword ? "جاري التغيير..." : "تغيير كلمة السر"}
        </button>
      </form>

      <OrdersPreview />

      <button className="btn btn-danger mt-2 w-50" onClick={handleLogout} >
        تسجيل الخروج
      </button>
    </div>
  );
}

export default Profile;
