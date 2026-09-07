import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import ProductCard from "../components/ProductCard";
import OfferCard from "../components/OfferCard";

import robot1 from "../assets/imgs/Robot-1.png";
import slider1 from "../assets/imgs/slider-1.avif";
import slider2 from "../assets/imgs/slider-2.avif";
import slider3 from "../assets/imgs/slider-3.avif";

// اتحولت من بيانات وهمية محلية لبيانات حقيقية:
// - قسم "الخصومات": GET /api/product (عام) وبنفلتر اللي عليه hasDiscount محليًا
// - قسم "العروض": GET /api/offer/active (عام)

function Home() {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchDiscounted = async () => {
      try {
        const res = await axiosInstance.get("/api/product");
        setDiscountedProducts((res.data ?? []).filter((p) => p.hasDiscount));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchOffers = async () => {
      try {
        const res = await axiosInstance.get("/api/offer/active");
        setOffers(res.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDiscounted();
    fetchOffers();
  }, []);

  return (
    <>
      <section className="container">
        <div id="carouselExampleIndicators" className="carousel slide w-lg-50">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
          </div>
          <div className="carousel-inner rounded-4">
            <div className="carousel-item active">
              <img src={robot1} className="d-block w-100 h-100 object-fit-cover" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={slider1} className="d-block w-100 h-100 object-fit-cover" alt="..." />
              <Link to="/Chatbot" className="btn btn-main Ready-to-cook fs-4">اطبخ بذكاء !</Link>
            </div>
            <div className="carousel-item">
              <img src={slider2} className="d-block w-100 h-100 object-fit-cover" alt="..." />
              <Link to="/Chatbot" className="btn btn-main Ready-to-cook fs-4">اطبخ بذكاء !</Link>
            </div>
            <div className="carousel-item">
              <img src={slider3} className="d-block w-100 h-100 object-fit-cover" alt="..." />
              <Link to="/Chatbot" className="btn btn-main Ready-to-cook fs-4">اطبخ بذكاء !</Link>
            </div>
          </div>
          <button className="carousel-control-prev d-flex align-items-center justify-content-center" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="fa-solid fa-arrow-left text-light"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="fa-solid fa-arrow-right text-light"></span>
          </button>
        </div>
      </section>

      <section className="container mt-5 mb-5">
        <header className="pe-2">
          <h2 className="section-title fw-bold">العروض</h2>
        </header>
        <div className="row g-3 mt-3">
          {offers.length === 0 ? (
            <p className="text-muted">لا توجد عروض نشطة حاليًا.</p>
          ) : (
            offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </div>
      </section>

      <section className="container sales mt-4">
        <header className="pe-2">
          <h2 className="section-title fw-bold">الخصومات</h2>
        </header>
        <div className="row g-3 mt-3">
          {discountedProducts.length === 0 ? (
            <p className="text-muted">لا توجد خصومات حاليًا.</p>
          ) : (
            discountedProducts.map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
