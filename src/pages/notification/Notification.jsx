import React, { useState } from 'react';
import './notification.css';
import '../../index.css'; // Giả định import đúng
import Product from './Product'; // Giả định import đúng
import Navbar from "../HeadAndFooter/Navbar"; // Giả định import đúng
import Footer from "../HeadAndFooter/Footer"; // Giả định import đúng
import BookTabs from './BookTabs';

const Notification = () => {
  const [activePanel, setActivePanel] = useState('orders');

  const getButtonClass = (panelName) => {
    // Trả về chuỗi className bao gồm class cơ bản và class active nếu trùng khớp
    return `notice-button ${activePanel === panelName ? 'active-notice' : ''}`;
  };

  return (
    <>
      <Navbar />
      <div className=".container mt-5 mb-5"> 
        <div className="main-panel-container">
          <div className="row g-0">
            <div className="notice col-md-4 left-panel p-5">
              <div className="mx-2 mb-3 fw-bold fs-1 mb-3">Thông báo</div>
              <div className="notice-order">
                <button
                  onClick={() => setActivePanel('general')}
                  className={`${getButtonClass('general')} mx-4 px-2`} 
                >
                  Thông báo chung
                </button>
              </div>
              <div className="notice-order">
                <button
                  onClick={() => setActivePanel('sales')}
                  className={`${getButtonClass('sales')} mx-4 px-2`} 
                >
                  Khuyến mãi
                </button>
              </div>
              <div className="notice-order"> 
                <button
                  onClick={() => setActivePanel('orders')}
                  className={`${getButtonClass('orders')} mx-4 px-2`} 
                >
                  Đơn hàng
                </button>
              </div>
            </div>
            <div className="col-md-8 right-panel p-3">
              {activePanel === 'orders' && <Product />}
              {activePanel === 'sales' && (
                <div className="notice-sale">
                  <BookTabs/>
                </div>
              )}
              {activePanel === 'general' && (
                <div className="notice-general">
                  <h4>Thông báo chung</h4>
                  {/* Thêm nội dung */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Notification;