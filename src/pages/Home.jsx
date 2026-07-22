import { Link } from "react-router-dom";
import { getSaleProducts } from "../data/products";
import ProductCard from "../components/ProductCard";


import robot1 from "../assets/imgs/Robot-1.png";
import slider1 from "../assets/imgs/slider-1.avif";
import slider2 from "../assets/imgs/slider-2.avif";
import slider3 from "../assets/imgs/slider-3.avif";

function Home() {
  const saleProducts = getSaleProducts();

  return (
    <>
      <section className="container">
        {/* الكاروسيل شغال بـ Bootstrap JS (data-bs-*) اللي متعمول له import في main.jsx */}
        <div id="carouselExampleIndicators" className="carousel slide w-lg-50">
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="3"
              aria-label="Slide 4"
            ></button>
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
          <button
            className="carousel-control-prev d-flex align-items-center justify-content-center"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="fa-solid fa-arrow-left text-light"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="fa-solid fa-arrow-right text-light"></span>
          </button>
        </div>
      </section>

      <section className="container sales mt-4">
        <header className="pe-2">
          <h2 className="section-title fw-bold">الخصومات</h2>
        </header>
        <div className="row g-3 mt-3">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="container mt-5">
        <header className="pe-2">
          <h2 className="section-title fw-bold">العروض</h2>
        </header>
        <div className="row g-3 mt-3">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
