import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../services/axiosInstance";

// صفحة إتمام طلب خاصة بالباقات (Bundle offers) بس - مختلفة عن Cart.jsx العادية
// لأن الكميات هنا ثابتة (محددة في العرض نفسه) ومش قابلة للتعديل من اليوزر،
// والأهم إننا لازم نبعت offerId مع الطلب (مش null) عشان الباك اند يعرف يفرق
// بين طلب عادي وطلب باقة

function OfferCheckout() {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offerRes, branchesRes] = await Promise.all([
          axiosInstance.get(`/api/offer/${offerId}`),
          axiosInstance.get(`/api/branch`),
        ]);
        setOffer(offerRes.data);
        setBranches(branchesRes.data ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [offerId]);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("سجّلي دخول الأول عشان تكملي الطلب");
      navigate("/Login");
      return;
    }
    if (!branchId) {
      toast.info("اختاري الفرع الأول");
      return;
    }

    setPlacingOrder(true);
    try {
      await axiosInstance.post("/api/order", {
        branchId: Number(branchId),
        notes,
        offerId: offer.id, // 👈 الفرق الجوهري عن الطلب العادي - هنا offerId مش null
        items: offer.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity, // الكمية ثابتة من العرض نفسه، مش من اختيار اليوزر
        })),
      });
      toast.success("تم تسجيل طلبك بنجاح");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء تسجيل الطلب");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p className="container mt-4">جاري التحميل...</p>;
  if (!offer) return <p className="container mt-4">العرض غير موجود.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-1">{offer.title}</h2>
      <p className="text-muted">{offer.description}</p>
      <span className="badge bg-main mb-3">باقة بسعر {offer.bundlePrice} جنيه</span>

      {offer.products.map((p) => (
        <div key={p.productId} className="d-flex align-items-center gap-3 border-bottom pb-2 mb-2">
          <img
            src={p.productImage}
            alt={p.productName}
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <p className="mb-0">{p.productName}</p>
            <p className="mb-0 text-muted small">الكمية: {p.quantity}</p>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <label className="form-label">اختاري الفرع</label>
        <select
          className="form-select mb-3"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
        >
          <option value="">اختاري فرع الاستلام/التوصيل</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        <textarea
          className="form-control mb-3"
          placeholder="ملاحظات على الطلب (اختياري)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4>الإجمالي: {offer.bundlePrice} جنيه</h4>
        <button className="btn btn-main" onClick={handlePlaceOrder} disabled={placingOrder}>
          {placingOrder ? "جاري التأكيد..." : "تأكيد الطلب"}
        </button>
      </div>
    </div>
  );
}

export default OfferCheckout;