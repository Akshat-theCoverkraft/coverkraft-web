import logo from '../../Images/coverkraft_logo_1.png';
import './CSS/footer.css';
import twitter from '../../Images/X.png';
import facebook from '../../Images/facebook.png';
import instagram from '../../Images/instagram.png';
import location from '../../Images/location_on.png';
import call from '../../Images/call.png';
import email from '../../Images/email.png';
import { Link } from 'react-router-dom';
import { THEME_COLOR } from '../../constants';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start" style={{ background: THEME_COLOR.FADE_BACKGROUND, color: THEME_COLOR.COLOR }}>
            <section className="py-5">
                <div className="container text-center text-md-start">
                    <div className="row">

                        <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <img src={logo} alt="Coverkraft Logo" height={65} width={214} />
                            </h6>
                            <p className="text-color fs-5">
                                Coverkraft offers powerful tools for filling out forms, scanning documents, and uploading them with ease.
                            </p>
                        </div>

                        <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4 fs-5 custom-color">Get in Touch</h6>

                            <div className="d-flex align-items-start mb-2">
                                <img src={location} alt="Location Icon" height={23} className="me-2 mt-1" />
                                <p className="text-color fs-5 footer-link mb-0">8819 Ohio St. South Gate, CA 90280</p>
                            </div>

                            <div className="d-flex align-items-start mb-2">
                                <img src={email} alt="Email Icon" height={23} className="me-2 mt-1" />
                                <p className="text-color fs-5 footer-link mb-0">Ourstudio@hello.com</p>
                            </div>

                            <div className="d-flex align-items-start">
                                <img src={call} alt="Call Icon" height={23} className="me-2 mt-1" />
                                <p className="text-color fs-5 footer-link mb-0">+1 386-688-3295</p>
                            </div>
                        </div>

                        <div className="col-md-2 col-lg-2 col-xl-2 col-sm-12 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4 fs-5 custom-color">Service</h6>
                            <p><Link to="/coverkraft" className="text-color fs-5 footer-link">Home</Link></p>
                            <p><Link to="/coverkraft/about" className="text-color fs-5 footer-link">About Us</Link></p>
                            <p><Link to="/coverkraft/vault" className="text-color fs-5 footer-link">Vault</Link></p>
                            <p><Link to="/coverkraft/vault" className="text-color fs-5 footer-link">Policy</Link></p>
                            <p><Link to="/coverkraft/privacypolicy" className="text-color fs-5 footer-link">Privacy Policy</Link></p>
                        </div>

                        <div className="col-md-2 col-lg-2 col-xl-2 col-sm-12 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4 fs-5 custom-color">Company</h6>
                            <p className="text-color fs-5 footer-link">Blog</p>
                            <p className="text-color fs-5 footer-link">Help</p>
                            <p className="text-color fs-5 footer-link">Terms & Conditions</p>
                        </div>

                        <div className="col-md-2 col-lg-2 col-xl-2 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src={twitter} alt="Twitter Icon" className="social-icon" />
                            <img src={facebook} alt="Facebook Icon" className="social-icon" />
                            <img src={instagram} alt="Instagram Icon" className="social-icon" />
                        </div>

                    </div>
                </div>
            </section>

            <div className="text-center p-3" style={{ backgroundColor: THEME_COLOR.BACKGROUND }}>
                <span className="me-2">© Coverkraft 2024</span>
                <span className="border-start border-secondary ps-2">All Rights Reserved</span>
            </div>
        </footer>
    );
};

export default Footer;
