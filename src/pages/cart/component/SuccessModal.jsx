import React from 'react';
import './SuccessModal.css';

function SuccessModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-modal-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="success-checkmark-circle">
          ✓
        </div>
        <h2>Purchase Successful!</h2>
        <p>Thank you for your purchase.</p>
      </div>
    </div>
  );
}

export default SuccessModal;