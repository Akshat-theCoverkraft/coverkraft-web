import React, { useState } from "react";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: Add Nodemailer or API call here
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "#F0F0F0",
      padding: "3rem 1.5rem",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#1A1A1A",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 0 15px rgba(139,198,66,0.1)",
      }}>
        <h2 style={{ color: "#8BC642", marginBottom: "1.5rem", fontSize: "1.8rem" }}>Contact Us</h2>

        <p style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "#BBBBBB" }}>
          📍 <strong>Address:</strong><br />
          CoverKraft Insurance Brokers Pvt. Ltd.<br />
          16 D-1, Danish Nagar, Hoshangabad Road,<br />
          Bhopal, Madhya Pradesh, PIN - 462026
        </p>

        <p style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "#BBBBBB" }}>
          📧 <strong>Email:</strong> <a href="mailto:grievance@thecoverkraft.com" style={{ color: "#8BC642" }}>grievance@thecoverkraft.com</a>
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            required
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <button type="submit" style={buttonStyle}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "0.75rem 1rem",
  backgroundColor: "#2B2B2B",
  color: "#F0F0F0",
  border: "1px solid #333",
  borderRadius: "8px",
  fontSize: "0.95rem",
  outline: "none",
};

const buttonStyle = {
  backgroundColor: "#8BC642",
  color: "#121212",
  padding: "0.75rem",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "all 0.3s ease",
};

export default ContactUs;
