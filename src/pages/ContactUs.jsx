import React, { useState } from "react";
import Navbar from "../component/Navbar";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";

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
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#F0F0F0",
        padding: "3rem 1.5rem",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Navbar />

      <div
        style={{
          width: "60vw",
          minHeight: "60vh",
          backgroundColor: "#3E3E3E",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(139,198,66,0.1)",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <h2
          style={{
            color: "#8BC642",
            marginBottom: "1.5rem",
            fontSize: "2.2rem",
            fontWeight: "bold",
          }}
        >
          Get in touch
        </h2>

        <p
          style={{
            color: "white",
            marginBottom: "2rem",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          We are here for you! How can we help?
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flex: 1,
            }}
          >
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
            <button type="submit" style={buttonStyle}>
              Send Message
            </button>
          </form>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-end",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "5px 0",
              }}
            >
              <FmdGoodIcon style={{ fontSize: "2rem", color: "#8BC642" }} />
              <p
                style={{
                  fontSize: "1rem",
                  width: "93%",
                  fontWeight: "bold",
                }}
              >
                16 D-1, Danish Nagar, Hoshangabad Road, Bhopal (M.P)
              </p>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "5px 0",
              }}
            >
              <CallIcon style={{ fontSize: "2rem", color: "#8BC642" }} />
              <p
                style={{
                  fontSize: "1rem",
                  width: "93%",
                  fontWeight: "bold",
                }}
              >
                +91-xxx-xxxx-xxxx
              </p>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "5px 0",
              }}
            >
              <MailIcon style={{ fontSize: "1.8rem", color: "#8BC642" }} />
              <p
                style={{
                  fontSize: "1rem",
                  width: "93%",
                  fontWeight: "bold",
                }}
              >
                contact@thecoverkraft.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "0.9rem 1rem",
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
  marginTop: "1rem",
};

export default ContactUs;
