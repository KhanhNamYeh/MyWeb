import React, { useState } from "react";
import "./radio.css";

const Radio = ({ options, name, onChange }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    if (onChange) onChange(event.target.value);
  };

  return (
    <div className="radio-group">
      {options.map((option) => (
        <label key={option.value} className="radio-label">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleChange}
            className="radio-input"
          />
          <span className="custom-radio"></span>
          {option.label}
        </label>
      ))}
    </div>
  );
};

const PaymentOptions = () => {
  const paymentMethods = [
    { value: "card", label: "Card" },
    { value: "e-wallet", label: "E-wallet" },
    { value: "cod", label: "COD" },
  ];

  return (
    <div>
      <Radio options={paymentMethods} name="payment" onChange={(value) => console.log("Selected:", value)} />
    </div>
  );
};

export default PaymentOptions;