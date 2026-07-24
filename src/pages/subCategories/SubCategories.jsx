import { useState, useEffect } from "react";
import { useParams , Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../services/Api";

function SubCategories() {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/category/${categoryId}`);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, [categoryId]);

  const subCategories = categories?.subCategories ?? [];

  return (
    <div className="container mt-4">
      <div className="row g-3">
        {subCategories.map((sub) => (
          <Link key={sub.id} to={`/Products/${sub.id}`}
           className="col-6 col-md-4 col-lg-3 text-decoration-none text-black">
            <div className="border rounded-4 overflow-hidden shadow text-center">
              <img
                src={sub.imageUrl}
                alt={sub.name}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <p className="p-2 mb-0 fw-bold">{sub.name}</p>
              <p className="text-muted small pb-2">{sub.productsCount} منتج</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SubCategories;