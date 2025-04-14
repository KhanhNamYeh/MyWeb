import React from "react";
import book1 from "/images/erasure.jpg";
import book2 from "/images/harlem_shuffle.jpg";
import book3 from "/images/native_nations.jpg";
import "./product.css";

const items = [
  { id: 1, name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book1, status: "Checking", form: "Cancel Order" },
  { id: 2, name: "Arasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book2, status: "On the way", form: " " },
  { id: 3, name: "Brasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book3, status: "Delivered", form: "Return Item" }
];

const Product = () => {
  return (
    <div className="m-5 mt-0">
      <div className="product-header">Order Information</div>
      {items.map((item) => (
        <div
          key={item.id}
          className="row border-bottom border-1 border-dark mb-2 pb-2 justify-content-between align-items-center"
        >
          <div className="col-3">
            <img src={item.image} alt="book" width="60px" height="92px" />
          </div>
          <div className="col">
            <div className="row">
              <div className="col-sm-6">
                  <div><strong>{item.name}</strong></div>
                  <div>{item.author}</div>
                  <div><s>{item.price.toLocaleString('vi-VN')} vnd</s></div>
                  <div><strong>{item.sale.toLocaleString('vi-VN')} vnd</strong></div>
              </div>
              <div className="col-sm-6">
                  <div><strong>Status</strong></div>
                  <div>{item.status || "N/A"}</div>
                  <button>{item.form || "N/A"}</button>
                  <div><strong>Quantity: {item.quantity}</strong></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Product;