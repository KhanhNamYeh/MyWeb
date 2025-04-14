import React, { useState } from 'react';
import './notification.css';
import '../../index.css'; // Assuming correct import
import Product from './Product'; // Assuming correct import
import Navbar from "../HeadAndFooter/Navbar"; // Assuming correct import
import Footer from "../HeadAndFooter/Footer"; // Assuming correct import
import BookTabs from './BookTabs';

const Notification = () => {
  const [activePanel, setActivePanel] = useState('orders');

  const getButtonClass = (panelName) => {
    // Returns a className string including the base class and the active class if matched
    return `notice-button ${activePanel === panelName ? 'active-notice' : ''}`;
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <div className="main-panel-container">
          <div className="row g-0">
            <div className="notice col-md-4 left-panel p-5">
              <div className="mx-2 mb-3 fw-bold fs-1 mb-3">Notifications</div>
              <div className="notice-order">
                <button
                  onClick={() => setActivePanel('general')}
                  className={`${getButtonClass('general')} mx-4 px-2`}
                >
                  General Notifications
                </button>
              </div>
              <div className="notice-order">
                <button
                  onClick={() => setActivePanel('sales')}
                  className={`${getButtonClass('sales')} mx-4 px-2`}
                >
                  Promotions
                </button>
              </div>
              <div className="notice-order">
                <button
                  onClick={() => setActivePanel('orders')}
                  className={`${getButtonClass('orders')} mx-4 px-2`}
                >
                  Orders
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
                  <h4>General Notifications</h4>
                  No new notifications
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