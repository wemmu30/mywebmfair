// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./Checkout.css";

const stripePromise = loadStripe("your-publishable-key-here"); // Stripe สำหรับบัตรเครดิต

const bankOptions = [
  { code: "scb", name: "ธนาคารไทยพาณิชย์ (SCB)" },
  { code: "kbank", name: "ธนาคารกสิกรไทย (KBank)" },
  { code: "bbl", name: "ธนาคารกรุงเทพ (BBL)" },
  { code: "krungthai", name: "ธนาคารกรุงไทย (KTB)" },
];

const CheckoutForm = ({ totalPrice, formData, onPaymentSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let paymentData = {
      ...formData,
      amount: totalPrice * 100,
    };

    // ✅ หากเลือกการโอนผ่านธนาคาร (Bank Transfer)
    if (formData.paymentMethod === "bank") {
      const response = await fetch("/api/bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      if (data.success) {
        setIsPaymentCompleted(true);
        onPaymentSubmit({ status: "paid", orderId: data.orderId });
        alert("โอนเงินสำเร็จผ่านธนาคาร " + data.bankName);
        navigate("/thankyou");
      } else {
        alert("การโอนเงินล้มเหลว: " + data.message);
      }
      return;
    }

    // ✅ หากเลือกบัตรเครดิต (Credit Card)
    if (formData.paymentMethod === "credit") {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
        return;
      }

      paymentData.paymentIntentId = paymentMethod.id;
    }

    const response = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    if (data.success) {
      setIsPaymentCompleted(true);
      onPaymentSubmit({ status: "paid", orderId: data.orderId });
      alert("ชำระเงินสำเร็จ ขอบคุณที่ใช้บริการ!");
      navigate("/thankyou");
    } else {
      alert(`การชำระเงินล้มเหลว: ${data.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {formData.paymentMethod === "bank" && (
        <>
          <label>เลือกธนาคาร:</label>
          <select
            name="bankCode"
            value={formData.bankCode}
            onChange={(e) =>
              onPaymentSubmit({ ...formData, bankCode: e.target.value })
            }
            required
          >
            <option value="">-- เลือกธนาคาร --</option>
            {bankOptions.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </>
      )}

      {formData.paymentMethod === "credit" && (
        <>
          <h3>กรอกข้อมูลบัตรเครดิต</h3>
          <CardElement className="card-element" />
        </>
      )}

      <button type="submit" className="btn-submit">
        ยืนยันการชำระเงิน
      </button>
      {isPaymentCompleted && <p className="paid-status">✅ ชำระเงินแล้ว</p>}
    </form>
  );
};

const Checkout = ({ cartItems, onPaymentSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    paymentMethod: "cod", // เริ่มต้นเก็บเงินปลายทาง
    bankCode: "", // สำหรับการโอนเงิน
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const totalPrice = cartItems.reduce(
    (price, item) => price + item.qty * item.price,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  };

  return (
    <section className="checkout-page">
      <h2>ชำระเงิน</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>ชื่อ-นามสกุล:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>ที่อยู่จัดส่ง:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label>ช่องทางการชำระเงิน:</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="cod">เก็บเงินปลายทาง</option>
          <option value="bank">โอนผ่านธนาคาร</option>
          <option value="credit">บัตรเครดิต</option>
        </select>

        <div className="total">
          <h3>ราคาทั้งหมด: ฿{totalPrice}.00</h3>
        </div>
      </form>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          totalPrice={totalPrice}
          formData={formData}
          onPaymentSubmit={onPaymentSubmit}
        />
      </Elements>
    </section>
  );
};

export default Checkout;
