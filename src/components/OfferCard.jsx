import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function OfferCard({ offer }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const isBundle = offer.bundlePrice !== null;

  return (
    <div className="col-12 col-md-6 ">
      <div className="border rounded-4 overflow-hidden shadow ">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          style={{
            width: "100%",
            height: "500px",
            objectFit: "cover",
          }}
        />

        <div className="p-3">
          <h5>{offer.title}</h5>

          <p className="text-muted small mb-2">
            {offer.description}
          </p>

          {isBundle ? (
            <span className="badge bg-main mb-2">
              باقة بسعر {offer.bundlePrice} جنيه
            </span>
          ) : (
            <span className="badge bg-main mb-2">
              خصم {offer.discountPercentage}%
            </span>
          )}

          {isBundle ? (
            <>
              <div className="mt-2 mb-3">
                {offer.products.map((p) => (
                  <div
                    key={p.productId}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <img
                      src={p.productImage}
                      alt={p.productName}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />

                    <span className="flex-grow-1 small">
                      {p.productName}
                    </span>

                    <span className="text-muted small">
                      × {p.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-main w-100 fixed bottom-0"
                onClick={() =>
                  navigate(`/offer/${offer.id}/checkout`)
                }
              >
                اطلب الآن
              </button>
            </>
          ) : (
            <div className="row g-2 mt-2">
              {offer.products.map((p) => (
                <div key={p.productId} className="col-6">
                  <div className="border rounded-3 p-2 text-center h-100 d-flex flex-column">
                    <img
                      src={p.productImage}
                      alt={p.productName}
                      style={{
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />

                    <p className="small mb-1 mt-1">
                      {p.productName}
                    </p>

                    <p className="small mb-2">
                      {p.finalPrice} ج.م{" "}
                      <s className="text-muted">
                        {p.originalPrice}
                      </s>
                    </p>

                    <button
                      className="btn btn-main btn-sm mt-auto"
                      onClick={() =>
                        addToCart(
                          p.productId,
                          1,
                          p.productName
                        )
                      }
                    >
                      أضف للسلة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfferCard;