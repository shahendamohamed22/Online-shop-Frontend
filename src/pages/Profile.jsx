import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";

// صفحة جديدة - بتستخدم:
// GET /api/customer/profile, PUT /api/customer/profile, PUT /api/customer/profile/change-password
function Profile() {
  const [profile, setProfile] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);

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
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
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
    setChangingPassword(true);
    try {
      await axiosInstance.put("/api/customer/profile/change-password", {
        CurrentPassword: passwords.currentPassword,
        NewPassword: passwords.newPassword,
      });
      toast.success("تم تغيير الباسورد بنجاح");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء تغيير الباسورد");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <p className="container mt-4">جاري التحميل...</p>;
  if (!profile) return <p className="container mt-4">محتاجة تسجّلي دخول الأول.</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">بياناتي</h2>

      <form onSubmit={handleSaveProfile} className="mb-5">
        <div className="row g-2 mb-3">
          <div className="col-6">
            <label className="form-label">الاسم الأول</label>
            <input
              className="form-control"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="col-6">
            <label className="form-label">الاسم الأخير</label>
            <input
              className="form-control"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">الإيميل</label>
          <input className="form-control" value={profile.email} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">رقم التليفون</label>
          <input
            className="form-control"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
          />
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

        <button className="btn btn-main w-100" type="submit" disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>

      <h3 className="fs-5 mb-3">تغيير كلمة السر</h3>
      <form onSubmit={handleChangePassword}>
        <div className="mb-3">
          <label className="form-label">كلمة السر الحالية</label>
          <input
            type="password"
            className="form-control"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">كلمة السر الجديدة</label>
          <input
            type="password"
            className="form-control"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-outline-secondary w-100" type="submit" disabled={changingPassword}>
          {changingPassword ? "جاري التغيير..." : "تغيير كلمة السر"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
