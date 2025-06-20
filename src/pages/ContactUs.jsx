import React, { useState } from "react";
import Navbar from "../component/Navbar";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContactUs() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5242/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("✅ Message sent successfully!");
                setForm({ name: "", email: "", message: "" });
            } else {
                toast.error(`❌ Failed to send message: ${data.message}`);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("❌ Something went wrong while sending the message.");
        } finally {
            setLoading(false);
        }
    };

    // Email validation function
    const isValidEmail = (email) => {
        // Simple regex for email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <>
        <div className="contact-container">
            <Navbar />
            <div className="contact-heading text-center mt-5 mb-5">
                <h1 className="fs-1 fw-bold ">Contact Us</h1>
                <h3 className="mt-1 ">
                    We'd love to hear from you! Please fill out the form below to connect with us.
                </h3>
            </div>

            <div className="contact-card">
                <div className="contact-form-section">
                    <h2 className="contact-title">Get in touch</h2>
                    <p className="contact-subtitle fs-3">We are here for you! How can we help?</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!isValidEmail(form.email)) {
                                toast.error("❌ Please enter a valid email address.");
                                return;
                            }
                            handleSubmit(e);
                        }}
                        className="contact-form"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="contact-input"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="contact-input"
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                            rows="5"
                            required
                            className="contact-textarea"
                        />
                        <button type="submit" className="contact-button" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>

                <div className="contact-info-section">
                    <img
                        src={require("../Images/objects.png")}
                        alt="Decor"
                        className="contact-image"
                    />
                    <div className="contact-info">
                        <div className="contact-info-item">
                            <FmdGoodIcon className="contact-icon" />
                            <p>16 D-1, Danish Nagar, Hoshangabad Road, Bhopal (M.P)</p>
                        </div>
                        <div className="contact-info-item">
                            <CallIcon className="contact-icon" />
                            <p>+91-xxx-xxxx-xxxx</p>
                        </div>
                        <div className="contact-info-item">
                            <MailIcon className="contact-icon" />
                            <p>
                                <a href="mailto:contact@thecoverkraft.com" className="contact-mail">
                                    contact@thecoverkraft.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={4000} />
            <style jsx>{`
            html, body {
                margin: 0;
                padding: 0;
                overflow-x: hidden;
            }

            .contact-container {
                min-height: 100vh;
                background-color: #121212;
                color: #f0f0f0;
                padding: 2rem 1rem;
                font-family: Inter, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .contact-card {
                width: 100%;
                max-width: 1200px;
                background-color: #212121;
                border-radius: 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                display: flex;
                flex-wrap: wrap;
            }

            .contact-form-section,
            .contact-info-section {
                flex: 1 1 50%;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .contact-title {
                color: #8bc642;
                margin-bottom: 1.2rem;
                font-size: 2.2rem;
                font-weight: bold;
            }

            .contact-subtitle {
                color: #fff;
                margin-bottom: 2rem;
                font-size: 1.2rem;
            }

            .contact-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .contact-input,
            .contact-textarea {
                padding: 1rem;
                background-color: #1f1f1f;
                color: #ffffff;
                border: 1px solid #4a4a4a;
                border-radius: 8px;
                font-size: 1.5rem;
                outline: none;
                width: 80%;
            }

            .contact-button {
                background-color: #8bc642;
                color: #121212;
                padding: 0.9rem;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                font-size: 1.5rem;
                transition: all 0.3s ease;
                                width: 80%;

            }

            .contact-info-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .contact-image {
                width: 100%;
                max-width: 300px;
                object-fit: contain;
                margin-bottom: 2rem;
            }

            .contact-info {
                width: 100%;
            }

            .contact-info-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 1rem;
                gap: 1rem;
            }

            .contact-icon {
                font-size: 1.8rem;
                color: #8bc642;
            }

            .contact-mail {
                text-decoration: underline;
                color: inherit;
            }

            @media (max-width: 768px) {
                .contact-card {
                    flex-direction: column;
                }

                .contact-form-section,
                .contact-info-section {
                    flex: 1 1 100%;
                    padding: 1.5rem;
                }

                .contact-title {
                    font-size: 1.8rem;
                }

                .contact-subtitle {
                    font-size: 1rem;
                }
            }
        `}</style>

        </div>
            <Footer/>
</>
    );
}

export default ContactUs;
