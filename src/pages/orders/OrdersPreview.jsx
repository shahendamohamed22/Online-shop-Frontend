import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const statusLabels = {
  Pending: "قيد الانتظار",
  Confirmed: "تم التأكيد",
  Ready: "جاهز",
  PickedUp: "تم الاستلام",
};

function OrdersPreview() {
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

  const recentOrders = orders.slice(0, 3);

  return (
    <section className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className=" badge bg-main fs-4 mb-0">طلباتي</h3>

        {orders.length > 0 && (
          <Link
            to="/orders"
            className="text-decoration-none"
          >
            عرض كل الطلبات.
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-muted">جاري تحميل الطلبات...</p>
      ) : recentOrders.length === 0 ? (
        <p className="text-muted">
          لا يوجد طلبات
        </p>
      ) : (
        recentOrders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="d-block text-decoration-none text-black"
          >
            <div className="border rounded-3 p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{order.orderNumber}</strong>

                <span className="badge bg-main">
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span className="text-muted small">
                  {order.branchName}
                </span>

                <strong>
                  {order.totalPrice} جنيه
                </strong>
              </div>
            </div>
          </Link>
        ))
      )}
    </section>
  );
}

export default OrdersPreview;
