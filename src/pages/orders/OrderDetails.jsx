import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";

// صفحة جديدة - GET /api/order/my/:id + DELETE /api/order/my/:id/cancel
function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/api/order/my/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await axiosInstance.delete(`/api/order/my/${id}/cancel`);
      toast.success("تم إلغاء الطلب");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message ?? "حصل خطأ أثناء الإلغاء");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <p className="container mt-4">جاري التحميل...</p>;
  if (!order) return <p className="container mt-4">الطلب غير موجود.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-1">{order.orderNumber}</h2>
      <p className="text-muted">{order.branchName}</p>
      <span className="badge bg-main mb-3">{order.status}</span>

      {order.items.map((item) => (
        <div key={item.productId} className="d-flex align-items-center gap-3 border-bottom pb-2 mb-2">
          <img
            src={item.productImage}
            alt={item.productName}
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <p className="mb-0">{item.productName}</p>
            <p className="mb-0 text-muted small">
              {item.quantity} × {item.unitPrice} جنيه
            </p>
          </div>
          <strong>{item.subtotal} جنيه</strong>
        </div>
      ))}

      <h4 className="mt-3">الإجمالي: {order.totalPrice} جنيه</h4>
      {order.notes && <p className="text-muted">ملاحظات: {order.notes}</p>}

      {order.status === "Pending" && (
        <button className="btn btn-outline-danger mt-3" onClick={handleCancel} disabled={cancelling}>
          {cancelling ? "جاري الإلغاء..." : "إلغاء الطلب"}
        </button>
      )}
    </div>
  );
}

export default OrderDetails;
