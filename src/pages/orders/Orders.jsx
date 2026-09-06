import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

// صفحة جديدة - GET /api/order/my
const statusLabels = {
  Pending: "قيد الانتظار",
  Confirmed: "تم التأكيد",
  Ready: "جاهز",
  PickedUp: "تم الاستلام",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/api/order/my");
        setOrders(res.data ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="container mt-4">جاري التحميل...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">طلباتي</h2>

      {orders.length === 0 ? (
        <p>لا يوجد طلبات.</p>
      ) : (
        orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="d-block border rounded-3 p-3 mb-3 text-decoration-none text-black"
          >
            <div className="d-flex justify-content-between">
              <strong>{order.orderNumber}</strong>
              <span className="badge bg-main">{statusLabels[order.status] ?? order.status}</span>
            </div>
            <p className="mb-0 text-muted small mt-1">{order.branchName}</p>
            <p className="mb-0 mt-1">{order.totalPrice} جنيه</p>
          </Link>
        ))
      )}
    </div>
  );
}

export default Orders;
