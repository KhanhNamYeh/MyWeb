import React from "react";
import book1 from "../../assets/book1.png";
import book2 from "../../assets/book2.png";
import book3 from "../../assets/book3.png";
import "./product.css";

const items = [
  { id: 1, name: "Erasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book1, status: "Dang kiem tra", form: "Huy don" },
  { id: 2, name: "Arasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book2, status: "Dang tren duong", form: " " },
  { id: 3, name: "Brasure", author: "by Percival Everett", sale: 233000, price: 493000, quantity: 1, image: book3, status: "Da giao hang", form: "Tra hang" }
];

const Product = () => {
  return (
    <div className="m-5 mt-0">
      <div className="product-header">Thong tin don hang</div>
      {items.map((item) => (
        <div
          key={item.id}
          className="row border-bottom border-2 border-dark mb-2 pb-2 justify-content-between align-items-center"
        >
          <div className="col-3">
            <img src={item.image} alt="book" width="60px" height="92px" />
          </div>
          <div className="col">
            <div className="row">
                <div className="col-sm-6">
                    <div><strong>{item.name}</strong></div>
                    <div>{item.author}</div>
                    <div><s>{item.price}</s> vnd</div>
                    <div><strong>{item.sale} vnd</strong></div>
            </div>
                <div className="col-sm-6">
                    <div><strong>Trang thai</strong></div>
                    <div>{item.status || "N/A"}</div>
                    <button>{item.form || "N/A"}</button>
                    <div><strong>So luong: {item.quantity}</strong></div>
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Product;