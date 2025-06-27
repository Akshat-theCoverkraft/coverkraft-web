import React, { useState } from "react";
import Navbar from "../component/Navbar";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Landing/component/Footer";
import { styled } from "@mui/material/styles";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    attachments: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, attachments: files }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(form.email)) {
      toast.error("❌ Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("message", form.message);

      if (Array.isArray(form.attachments)) {
        form.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const response = await fetch("http://localhost:5242/api/contact", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned non-JSON response.");
      }

      if (!response.ok) {
        toast.error(`❌ Failed to send message: ${data?.message || "Unknown error"}`);
        return;
      }

      toast.success("✅ Message sent successfully!");
      setForm({
        name: "",
        email: "",
        message: "",
        attachments: [],
      });
      document.getElementById("file-upload").value = null;

    } catch (error) {
      console.error("💥 Error sending message:", error);
      toast.error("❌ Something went wrong while sending the message.");
    } finally {
      setLoading(false);
    }
  };

  const StyledSubmitButton = styled("button")(() => ({
    backgroundColor: "transparent",
    color: "#8AC642",
    border: "1.5px solid #8AC642",
    borderRadius: "20px",
    padding: "12px 16px",
    fontSize: "1.4rem",
    fontWeight: "600",
    minWidth: "100px",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.25s ease",
    width: "100%",
    marginTop: "10px",
    "&:hover": {
      backgroundColor: "#8AC642",
      color: "#000",
    },
  }));

  return (
    <>
      <div className="container-fluid text-light py-5">
        <Navbar />

        <div className="text-center my-5 p-5" style={{ backgroundColor: '#212121', borderRadius: '20px', marginLeft: '6%', marginRight: '6%' }}>
          <h1 className="fw-bold" style={{ color: '#8bc642', fontSize: '3rem' }}>Contact Us</h1>
          <h3 style={{ color: '#ccc', fontWeight: 500, fontSize: '1.5rem' }}>
            We'd love to hear from you! Please fill out the form below to connect with us.
          </h3>
        </div>

        <div className="container px-4 mb-5" style={{ color: '#8bc642', fontSize: '1.6rem' }} >
          <div className="bg-secondary bg-opacity-10 rounded-4 shadow-lg p-4" style={{ backgroundColor: '#212121', borderRadius: '25px', marginLeft: '5%', marginRight: '5%' }}>
            <div className="row g-4" style={{ minHeight: '400px', paddingLeft: '4%' }}>
              {/* Form Section */}
              <div className="col-md-6">
                <h2 className="text fs-bold" style={{
                  fontSize: '2.5rem', color: '#8bc642', marginBottom: '1rem'
                }}>Get in touch with us.</h2>
                <p className="text-white" style={{ fontSize: "2rem" }}>We are here for you! How can we help?</p>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      className="form-control bg-dark text-light border-secondary placeholder-light fs-5"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      className="form-control bg-dark text-light border-secondary placeholder-light fs-5"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <textarea
                      name="message"
                      placeholder="Write your query..."
                      className="form-control bg-dark text-light border-secondary placeholder-light "
                      style={{ height: '200px', overflowY: 'auto', resize: 'none', fontSize: '2rem' }}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="file-upload" className="form-label text-light fw-semibold">
                      📎 Attachments
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      name="attachments"
                      className="form-control bg-dark text-light border-secondary"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      multiple
                    />
                    {Array.isArray(form.attachments) && form.attachments.length > 0 && (
                      <ul className="text-white mt-1">
                        {form.attachments.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <StyledSubmitButton type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Sending..." : "Send Message"}
                  </StyledSubmitButton>
                </form>
              </div>

              {/* Info Section */}
              <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-light text-center">
                <img
                  src={require("../Images/objects.png")}
                  alt="Decor"
                  className="img-fluid mb-4"
                  style={{ maxWidth: '300px' }}
                />
                <div>
                  <p><FmdGoodIcon className="me-2 text-success" />16 D-1, Danish Nagar, Hoshangabad Road, Bhopal (M.P)</p>
                  <p><CallIcon className="me-2 text-success" />+91-xxx-xxxx-xxxx</p>
                  <p>
                    <MailIcon className="me-2 text-success" />
                    <a href="mailto:contact@thecoverkraft.com" className="text-decoration-underline text-light">
                      contact@thecoverkraft.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

<ToastContainer position="top-right" autoClose={4000} />
      </div>
      <Footer />

      <style>
        {`
        ::placeholder {
          color: #aaa !important;
          opacity: 1;
        }
      `}
      </style>
    </>
  );
}

export default ContactUs;
