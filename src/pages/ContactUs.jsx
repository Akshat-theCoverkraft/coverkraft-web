import React, { useState } from "react";
import Navbar from "../component/Navbar";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Landing/component/Footer";
import { styled } from "@mui/material/styles";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Logo from "../Images/CKbig.png";
import API_URL from "../ServiceModule/Service";

const StyledSubmitButton = styled("button")(() => ({
  backgroundColor: "transparent",
  color: "#8AC642",
  border: "1.5px solid #8AC642",
  borderRadius: "20px",
  padding: "12px 16px",
  fontSize: "1.4rem",
  fontWeight: "600",
  width: "100%",
  marginTop: "10px",
  cursor: "pointer",
  transition: "all 0.25s ease",
  "&:hover": { backgroundColor: "#8AC642", color: "#000" },
}));

const Input = ({ type = "text", name, value, onChange, placeholder, ...props }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="form-control bg-dark text-light border-secondary placeholder-light fs-5"
    required
    {...props}
  />
);

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "", attachments: [] });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = e => setForm(prev => ({ ...prev, attachments: Array.from(e.target.files) }));

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const closeModal = () => {
    setModalOpen(false);
    setSelectedTestimonial(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return toast.error("❌ Invalid email address.");
    setLoading(true);

    try {
      const formData = new FormData();
      ["name", "email", "message"].forEach(key => formData.append(key, form[key]));
      form.attachments.forEach(file => formData.append("attachments", file));

      const res = await fetch(`${API_URL}api/contact`, { method: "POST", body: formData });
      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) return toast.error(`❌ Failed: ${data?.message || "Unknown error"}`);

      toast.success("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "", attachments: [] });
      document.getElementById("file-upload").value = null;
      setModalOpen(true);
    } catch (err) {
      console.error("Error:", err);
      toast.error("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid text-light py-5">
        <Navbar />

        <div className="text-center my-5 p-5" style={{ backgroundColor: '#212121', borderRadius: '20px', margin: '0 6%' }}>
          <h1 className="fw-bold" style={{ color: '#8bc642', fontSize: '3rem' }}>Contact Us</h1>
          <h3 style={{ color: '#ccc', fontWeight: 500, fontSize: '1.5rem' }}>
            We'd love to hear from you! Fill the form below.
          </h3>
        </div>

        <div className="container px-4 mb-5" style={{ fontSize: '1.6rem', color: '#8bc642' }}>
          <div className="bg-secondary bg-opacity-10 rounded-4 shadow-lg p-4" style={{ backgroundColor: '#212121', borderRadius: '25px', margin: '0 5%' }}>
            <div className="row g-4" style={{ minHeight: '400px', paddingLeft: '4%' }}>

              <div className="col-md-6">
                <h2 style={{ fontSize: '2.5rem', color: '#8bc642', marginBottom: '1rem' }}>Get in touch with us.</h2>
                <p className="text-white" style={{ fontSize: "2rem" }}>We are here for you! How can we help?</p>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-3">
                    <Input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" />
                  </div>
                  <div className="mb-3">
                    <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" />
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="message"
                      placeholder="Write your query..."
                      className="form-control bg-dark text-light border-secondary placeholder-light"
                      style={{ height: '200px', resize: 'none', fontSize: '2rem' }}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="file-upload" className="form-label text-light fw-semibold">📎 Attachments</label>
                    <input
                      id="file-upload"
                      type="file"
                      name="attachments"
                      className="form-control bg-dark text-light border-secondary"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      multiple
                    />
                    {form.attachments.length > 0 && (
                      <ul className="text-white mt-1">
                        {form.attachments.map((file, idx) => <li key={idx}>{file.name}</li>)}
                      </ul>
                    )}
                  </div>
                  <StyledSubmitButton type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Sending..." : "Send Message"}
                  </StyledSubmitButton>
                </form>
              </div>

              <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-light text-center">
                <img src={require("../Images/objects.png")} alt="Decor" className="img-fluid mb-4" style={{ maxWidth: '300px' }} />
                <div>
                  <p><FmdGoodIcon className="me-2 text-success" />16 D-1, Danish Nagar, Hoshangabad Road, Bhopal (M.P)</p>
                  <p><CallIcon className="me-2 text-success" />+91-xxx-xxxx-xxxx</p>
                  <p><MailIcon className="me-2 text-success" />
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '30%',
          maxWidth: '600px',
          bgcolor: '#121212',
          border: '2px solid #8bc642',
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          color: '#ccc'
        }}>
          {/* ❌ Close Button */}
          <span
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              fontSize: '1.9rem',
              cursor: 'pointer',
              color: '#ccc',
              fontWeight: 'bold',
              zIndex: 10
            }}
            onMouseEnter={(e) => (e.target.style.color = '#7BC043')}
            onMouseLeave={(e) => (e.target.style.color = '#ccc')}
          >
            &times;
          </span>

          <Typography variant="h5" sx={{ mb: 2, color: '#8bc642', fontWeight: 700, fontSize: 20 }}>
            Thank You for letting us know your requirement
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontSize: 16 }}>
            We will get back to you with a resolution soon.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 3, fontSize: 16 }}>
            Regards, <br /> Team CoverKraft
          </Typography>
          <img src={Logo} alt="CoverKraft Logo" style={{ width: '250px', margin: 'auto' }} />
        </Box>
      </Modal>

      <style>{`::placeholder { color: #aaa !important; opacity: 1; }`}</style>
    </>
  );
}

export default ContactUs;
