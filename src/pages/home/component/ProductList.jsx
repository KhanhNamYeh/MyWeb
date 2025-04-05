// src/components/ProductList.jsx
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import "../home.css";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { image: "erasure.jpg", title: "Erasure", author: "Percival Everett", genre: "Thiếu Nhi" },
    { image: "harlem_shuffle.jpg", title: "Harlem Shuffle", author: "Colson Whitehead", genre: "Thiếu Nhi" },
    { image: "native_nations.jpg", title: "Native Nations", author: "Kathleen Duval", genre: "Thiếu Nhi" },
    { image: "this_motherless_land.jpg", title: "This Motherless Land", author: "Nikki May", genre: "Thiếu Nhi" },
    { image: "erasure.jpg", title: "The Haunting", author: "Shirley Jackson", genre: "Kinh Dị" },
    { image: "harlem_shuffle.jpg", title: "It", author: "Stephen King", genre: "Kinh Dị" },
    { image: "native_nations.jpg", title: "Dracula", author: "Bram Stoker", genre: "Kinh Dị" },
    { image: "this_motherless_land.jpg", title: "Pet Sematary", author: "Stephen King", genre: "Kinh Dị" }
  ];

  // Lọc theo từ khoá
  const lowerSearch = searchTerm.toLowerCase();
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(lowerSearch) ||
    p.author.toLowerCase().includes(lowerSearch) ||
    p.genre.toLowerCase().includes(lowerSearch)
  );

  // Lấy danh sách thể loại còn tồn tại sau lọc
  const genres = [...new Set(filtered.map(p => p.genre))];

  return (
    <div className="product-list-wrapper">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {genres.map(genre => (
        <section key={genre} className="genre-section">
          <h2 className="genre-title">{genre}</h2>
          <div className="products-container">
            {filtered
              .filter(p => p.genre === genre)
              .map((product, idx) => (
                <div key={idx} className="product-item">
                  <img
                    src={`/images/${product.image}`}
                    alt={product.title}
                    className="product-image"
                  />
                  <h3>{product.title}</h3>
                  <p>{product.author}</p>
                </div>
              ))
            }
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductList;
