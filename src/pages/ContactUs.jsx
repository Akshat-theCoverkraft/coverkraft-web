import React, { useState } from "react";
import Navbar from "../component/Navbar";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import Footer from "../Landing/component/Footer";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
const Spinner = styled("div")({
  border: "3px solid #8AC642",
  borderTop: "3px solid transparent",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  animation: "spin 1s linear infinite",
  margin: "0 auto",
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

const Input = ({ type = "text", name, value, onChange, placeholder, ...props }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="form-control bg-dark text-light border-secondary placeholder-light fs-5 text-size-md"
    {...props}
  />
);

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "", attachments: [] });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: isValidEmail ? '' : 'Enter a valid email address',
      }));
    } else if (name === 'name') {
      const isValidName = /^[a-zA-Z\s]+$/.test(value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: isValidName ? '' : 'Invalid name. Only letters and spaces are allowed.',
      }));
    }
    else {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setFormErrors({ ...formErrors, attachments: "Only JPG, PNG, PDF, DOC, or DOCX files are allowed." });
    } else {
      setForm(prev => ({ ...prev, attachments: files }));
      setFormErrors({ ...formErrors, attachments: "" });
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = form.attachments.filter((_, i) => i !== index);
    setForm({ ...form, attachments: newAttachments });
  };

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName =value=> /^[a-zA-Z\s]+$/.test(value);

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      errors.email = "Invalid email address.";
    }
    else if (!isValidName(form.name)) {
      errors.name = "Invalid name. Only letters and spaces are allowed.";
    }
    if (!form.message.trim()) errors.message = "Message is required.";
    return errors;
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      ["name", "email", "message"].forEach(key => formData.append(key, form[key]));
      form.attachments.forEach(file => formData.append("attachments", file));

      const res = await fetch(`${API_URL}api/contact`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setFormErrors({ api: data?.message || "Unknown error occurred." });
      } else {
        setForm({ name: "", email: "", message: "", attachments: [] });
        document.getElementById("file-upload").value = null;
        setModalOpen(true);
      }
    } catch (err) {
      setFormErrors({ api: "Something went wrong. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid text-light">
        <Navbar />

        <div className="text-center my-5 p-8" >
          <h1 className="fw-bold text-size-xxl" style={{ color: "#8bc642" }}>Contact Us</h1>
          <h3 className="text-size-md" style={{ color: "#ccc", alignSelf: 'center' }}>We'd love to hear from you!</h3>

          <div className="d-flex justify-content-center my-5">
            <div
              className="rounded-4 shadow-lg p-2 w-100"
              style={{
                maxWidth: "1000px",
                backgroundColor: "#1e1e1e", // optional background color
                fontSize: "1.6rem",
                paddingLeft:'30px',
                color: "#8bc642"
              }}
            >
              <div className="row g-4">

                <div className="col-md-6" style={{padding:25}}>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">

                    <div className="mb-3 ">
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                      {formErrors.name && (
                        <small className="text-danger d-block mt-1">{formErrors.name}</small>
                      )}
                    </div>

                    <div className="mb-3 text-start">
                      <Input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email"
                      />
                      {formErrors.email && (
                        <small className="text-danger d-block mt-1">{formErrors.email}</small>
                      )}
                    </div>

                    <div className="mb-3 text-start">
                      <textarea
                        name="message"
                        placeholder="Write your query..."
                        className="form-control bg-dark text-light border-secondary text-size-md"
                        style={{ height: "120px", resize: "none", fontSize: "1.3rem",
 }}
                        value={form.message}
                        onChange={handleChange}
                      />
                      {formErrors.message && (
                        <small className="text-danger d-block mt-1">{formErrors.message}</small>
                      )}
                    </div>

                    <div className="mb-3 text-start">
                      <label
                        htmlFor="file-upload"
                        className="form-label text-light fw-semibold text-size-md mb-2"
                      >
                        📎 Attachments
                      </label>

                      <div className="position-relative">
                        <input
                          id="file-upload"
                          type="file"
                          name="attachments"
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                          onChange={handleFileChange}
                          multiple
                          className="d-none"
                        />

                        <input
                          type="text"
                          className="form-control bg-dark text-light border-secondary text-size-md pe-5"
                          value={
                            form.attachments.length > 0
                              ? form.attachments.map((file) => file.name).join(", ")
                              : ""
                          }
                          placeholder="📁 No file chosen"
                          readOnly
                          onClick={() => document.getElementById("file-upload").click()}
                          style={{
                            cursor: "pointer",
                            height: "35px",
                            fontSize: "1.25rem",
                          }}
                        />
                      </div>

                      {formErrors.attachments && (
                        <small className="text-danger d-block mt-1">{formErrors.attachments}</small>
                      )}

                      {form.attachments.length > 0 && (
                        <ul className="mt-2 ps-3 text-light text-size-md">
                          {form.attachments.map((file, idx) => (
                            <li
                              key={idx}
                              className="d-flex align-items-center justify-content-between mb-1"
                            >
                              <span className="text-start">• {file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeAttachment(idx)}
                                className="ms-2 border-0 bg-transparent"
                                style={{
                                  color: "white",
                                  fontSize: "1rem",
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  padding: "0",
                                  lineHeight: "1",
                                  textAlign: "center",
                                }}
                                title="Remove"
                              >
                                ❌
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {formErrors.api && (
                      <div className="text-danger mb-3 text-start">{formErrors.api}</div>
                    )}

                    <StyledSubmitButton
                      type="submit"
                      disabled={loading}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      {loading ? <Spinner /> : "Send Message"}
                    </StyledSubmitButton>
                  </form>


                </div>

                <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-light text-center">
                  <img src={require("../Images/objects.png")} alt="Decor" className="img-fluid mb-4" style={{ maxWidth: "230px" }} />
                  <div>
                    <p className="text-size-md">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=16+D-1,+Danish+Nagar,+Hoshangabad+Road,+Bhopal+(M.P)"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light custom-hover-underline"
                      >
                        <FmdGoodIcon className="me-2 text-success" />
                        16 D-1, Danish Nagar, Hoshangabad Road, Bhopal (M.P)
                      </a>
                    </p>


                    <p><CallIcon className="me-2 text-success text-size-md" />+91-xxx-xxxx-xxxx</p>
                    <p><MailIcon className="me-2 text-success" /><a href="mailto:contact@thecoverkraft.com" className="text-decoration-underline text-light text-size-md">contact@thecoverkraft.com</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "600px",
          bgcolor: "#121212",
          border: "2px solid #8bc642",
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          color: "#ccc"
        }}>
          <span
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "12px",
              right: "16px",
              fontSize: "1.9rem",
              cursor: "pointer",
              color: "#ccc",
              fontWeight: "bold",
              zIndex: 10
            }}
            onMouseEnter={e => (e.target.style.color = "#7BC043")}
            onMouseLeave={e => (e.target.style.color = "#ccc")}
          >
            &times;
          </span>
          <Typography variant="h5" sx={{ mb: 2, color: "#8bc642", fontWeight: 700, fontSize: 20 }}>
            Thank you for letting us know your requirement!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontSize: 16 }}>
            We will get back to you with a resolution soon.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic", mb: 3, fontSize: 16 }}>
            Regards, <br /> Team CoverKraft
          </Typography>
          <img src={Logo} alt="CoverKraft Logo" style={{ width: "250px", margin: "auto" }} />
        </Box>
      </Modal>

      <style>{`::placeholder { color: #aaa !important; opacity: 1; }`}</style>
    </>
  );
}

export default ContactUs;
