import { getAllProduct } from "@/lib/actions";
import React from "react";

const Trending = async () => {

  const products = await getAllProduct();

  return (
    <section className="trending-section">
      <h2 className="section-text">Trending</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-16">
        {
          products && products.map(product => (
            <div key={product._id}>{product.title}</div>
          ))
        }
      </div>
    </section>
  );
};

export default Trending;
