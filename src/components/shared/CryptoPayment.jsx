// src/components/CryptoPayment.js
import React, { useState } from "react";

export const CryptoPayment = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const [orderNumber, setOrderNumber] = useState("");

  return (
    <div>
      <h1>Plisio Payment</h1>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <input
        type="text"
        placeholder="Order Number"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
      />
      <button>Pay Now</button>
    </div>
  );
};
