import React, { useState } from 'react';
import './CSS/login.css';
import logo from '../Images/CKbig.png';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import API_URL from '../ServiceModule/Service';
import { registrationCustomer } from '../store/action/action';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LOGING from '../Images/LOGING.png';
import { Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const consentSections = [
    {
        title: 'Disclaimer',
        body: [
            'By continuing to use this Coverkraft application, you acknowledge that you have read, understood, and agreed to the collection, processing, storage, and use of your personal data in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and our Privacy Policy.',
            'You voluntarily consent to provide the personal information requested by Coverkraft, including your name, contact details, date of birth, address, identity information, insurance-related information, and any other information necessary to provide our services.',
        ],
        bullets: [
            'Providing insurance and related services',
            'Processing quotations, policy issuance, renewals, endorsements, and claims',
            'Customer verification and regulatory compliance',
            'Customer support and grievance redressal',
            'Communicating important updates, service notifications, and transactional information',
            'Improving our products, services, and user experience',
        ],
    },
    {
        title: '1. Purpose',
        body: [
            'This Consent Policy explains how Coverkraft obtains, manages, uses and withdraws your consent for collecting, processing, storing and sharing personal data while providing insurance and related financial services.',
        ],
    },
    {
        title: '2. Consent',
        body: [
            'By registering on Coverkraft, submitting your information, selecting I Agree, or otherwise using our services, you voluntarily provide consent for Coverkraft to collect, process, store, use and share your personal data for the purposes described in this Policy.',
        ],
        bullets: [
            'Free and voluntary',
            'Specific to the purposes stated',
            'Informed and transparent',
            'Capable of being withdrawn at any time',
        ],
    },
    {
        title: '3. Personal data we collect',
        body: ['Depending on the services requested, we may collect:'],
        bullets: [
            'Full name, mobile number, email address, residential address',
            'Date of birth, gender, occupation',
            'Aadhaar, PAN or KYC details where legally required',
            'Nominee, vehicle, property, policy and claims information',
            'Health information only where required for insurance underwriting and with your consent',
            'Financial information necessary for insurance transactions and payment details',
            'Device, application usage and permitted location information',
        ],
    },
    {
        title: '4. Purpose of collecting personal data',
        body: [
            'Your personal data may be used for insurance quotations, policy issuance, policy renewals, claims assistance, customer verification, KYC compliance, regulatory compliance, fraud prevention, premium collection, customer support, risk assessment, service improvements, account management, and responding to customer requests.',
        ],
    },
    {
        title: '5. Communication consent',
        body: [
            'By providing your contact details, you consent to receive communications from Coverkraft through telephone calls, SMS, WhatsApp, email, mobile app notifications and other digital communication channels for insurance quotations, policy documents, renewal reminders, claims updates, service requests, regulatory communications, and customer support.',
        ],
    },
    {
        title: '6. Promotional communication consent',
        body: [
            'Subject to your separate consent, Coverkraft may send insurance offers, product launches, financial awareness campaigns, newsletters, educational content, promotional campaigns and customer engagement messages. Promotional communications are optional and can be stopped at any time without affecting your insurance services.',
        ],
    },
    {
        title: '7. Sharing of personal data',
        body: [
            'Your information may be shared only where necessary with insurance companies, reinsurers, Third Party Administrators, surveyors, payment gateway providers, KYC verification agencies, technology service providers, government authorities, regulatory authorities, and other entities as required by law. Coverkraft does not sell your personal data.',
        ],
    },
    {
        title: '8. Withdrawal of consent',
        body: [
            'You may withdraw your consent at any time by updating your communication preferences within the app or website, contacting Coverkraft Customer Support, or writing to the Grievance Officer. Withdrawal will not affect processing already carried out, processing required by law, or communications necessary for servicing existing policies.',
        ],
    },
    {
        title: '9. Your rights',
        body: [
            'Subject to applicable law, you may request information regarding your personal data, request correction or updating of inaccurate information, request deletion where legally permissible, withdraw your consent, and lodge a grievance regarding personal data processing.',
        ],
    },
    {
        title: '10. Data security and retention',
        body: [
            'Coverkraft implements appropriate administrative, technical and organizational safeguards to protect your personal data against unauthorized access, disclosure, alteration, loss or misuse.',
            'Personal data will be retained only as long as necessary to provide requested services, meet contractual obligations, comply with legal and regulatory requirements, resolve disputes, prevent fraud, and maintain statutory records.',
        ],
    },
    {
        title: '11. Grievance Officer',
        body: [
            'For questions, concerns or requests relating to your personal data or this Consent Policy, contact Prasad Kulkarni at prasad@thecoverkraft.com, House No. 1, 16-D, D-1, Danish Nagar, Hoshangabad Road, Bhopal, Madhya Pradesh - 462026.',
        ],
    },
    {
        title: 'Customer declaration',
        body: [
            'By selecting I Agree, Accept, or continuing to use Coverkraft services, I confirm that:',
        ],
        bullets: [
            'I have read and understood this Consent Policy',
            'I voluntarily consent to the collection, processing, storage and sharing of my personal data for the purposes described above',
            'I understand that I may withdraw optional consent at any time',
            'I understand that certain processing may continue where required by law or for servicing existing insurance policies',
        ],
    },
];

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [valid, setValid] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [isDpdpAccepted, setIsDpdpAccepted] = useState(false);
    const [showDpdpPopup, setShowDpdpPopup] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const commonInputStyle = {
        height: 48,
        fontSize: "1.222rem",
        borderRadius: 42,
        paddingLeft: "20px",
        width: "100%",
        color: "white",
        borderColor: "grey"
    };

    const handlephonechange = (e) => {
        setPhoneError('');
        let number = e.target.value.replace(/\D/g, '');
        number = number.slice(0, 10);
        setMobileNumber(number);
        const isValid = /^\d{10}$/.test(number);
        setValid(isValid);
    };

   const handleRegister = async () => {
  const roleID = 4;

  if (!fullName || !mobileNumber) {
    toast.error("Please fill all required fields");
    return;
  }

  // 🔍 Full name must be at least 3 characters & in Title Case


  if (!valid) {
    toast.error("Please enter a valid 10-digit mobile number");
    return;
  }

  if (!isDpdpAccepted) {
    toast.error("Please accept the DPDP guideline to continue");
    return;
  }

  setIsSubmitting(true);
  setPhoneError('');

  const formData = new FormData();
  formData.append('userName', fullName);
  formData.append('userPhone', mobileNumber);
  formData.append('roleId', roleID);
  if (referralCode.trim()) {
    formData.append('referralCode', referralCode.trim());
  }

  try {
    const response = await dispatch(registrationCustomer(API_URL, formData));
    toast.success(response.message);
    navigate("/login");
  } catch (error) {
    const errorMessage = error?.message || "Registration failed";
    const errorMsg = errorMessage.toLowerCase();

    if (errorMsg.includes('phone')) {
      setPhoneError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};


    const handleCancel = () => {
        navigate("/");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
    };

    return (
    <div className="overflow-hidden" style={{ backgroundColor: '#121212' }}>
            <ToastContainer />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                        <form
                            className="shadow-md text-white w-100"
                            style={{
                                maxWidth: '500px',
                                backgroundColor: '#000',
                                borderRadius: '12px',
                                padding: '40px',
                            }}
                        >
                            <div className="text-center mb-4">
                                <img src={logo} alt="Logo" style={{ width: '250px' }} />
                            </div>

                            <h2 className="text-center mb-3">Create your Account</h2>
                            <p className="text-center text-white-50 mb-4">Enter your details to register</p>

                            <CustomInput
                                label="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter your full name"
                                name="fullName"
                                required
                                inputStyle={commonInputStyle}
                            />

                            <CustomInput
                                label="Mobile Number"
                                type="tel"
                                value={mobileNumber}
                                onChange={handlephonechange}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter your number"
                                name="mobileNumber"
                                required
                                inputStyle={commonInputStyle}
                                validationMessage={!valid && mobileNumber.length > 0 ? 'Please enter a valid 10-digit mobile number.' : phoneError}
                            />

                            <CustomInput
                                label="Referral Code"
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter referral code (optional)"
                                name="referralCode"
                                inputStyle={commonInputStyle}
                            />

                            <div
                                className="mt-4 p-3"
                                style={{
                                    border: '1px solid rgba(139,198,66,0.25)',
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                }}
                            >
                                <div className="d-flex align-items-start gap-2">
                                    <Checkbox
                                        checked={isDpdpAccepted}
                                        onChange={(e) => setIsDpdpAccepted(e.target.checked)}
                                        sx={{
                                            color: '#8BC642',
                                            '&.Mui-checked': {
                                                color: '#8BC642',
                                            },
                                            padding: 0,
                                            marginTop: '-2px',
                                        }}
                                    />
                                    <div style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                        I agree to the DPDP guideline and consent to the collection and use of my details for registration and account management.
                                        <button
                                            type="button"
                                            onClick={() => setShowDpdpPopup(true)}
                                            style={{
                                                marginLeft: 8,
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#8BC642',
                                                textDecoration: 'underline',
                                                padding: 0,
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                            }}
                                        >
                                            View guideline
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-row justify-content-between gap-3 mt-4">

                                <Button
                                    text="Cancel"
                                    onClick={handleCancel}
                                    className="flex-fill"
                                    style={{
                                        color: "#fff",
                                        backgroundColor: "#5A9E1E",
                                        borderRadius: "0px",
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                />
                                <Button
                                    text={isSubmitting ? 'Registering...' : 'Register'}
                                    onClick={handleRegister}
                                    className="flex-fill"
                                    disabled={!valid || !fullName || !mobileNumber || !isDpdpAccepted || isSubmitting}
                                />
                            </div>

                            <p className="text-center mt-3 mb-0">
                                Already have an account?{" "}
                                <Link to="/login" className="custom-color">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>

                    <div
                        className="col-md-6 d-none d-md-block position-relative p-0"
                        style={{
                            height: '100%',
                            maxHeight: '100vh',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={LOGING}
                            alt="Background"
                            className="w-100"
                            style={{
                                height: '100%',
                                objectFit: 'contain',
                                opacity: 0.95,
                            }}
                        />
                        <div
                            className="position-absolute text-white text-center"
                            style={{
                                top: '55%',
                                left: '54%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 2,
                                width: '90%',
                            }}
                        >
                            <h1 className="fw-bold" style={{ fontSize: '32px' }}>Beema bhi, Bharosa bhi</h1>
                            <p className="opacity-75" style={{ fontSize: '23px' }}>
                                Secure your future. Simplify your policies. Trust the process.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            {showDpdpPopup && (
                <div
                    onClick={() => setShowDpdpPopup(false)}
                    className="dpdp-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="dpdp-popup"
                        style={{
                            width: '100%',
                            maxWidth: '420px',
                            maxHeight: '78vh',
                            background: 'linear-gradient(180deg, #141414 0%, #0f0f0f 100%)',
                            color: '#fff',
                            borderRadius: '18px',
                            border: '1px solid rgba(139,198,66,0.18)',
                            boxShadow: '0 18px 50px rgba(0,0,0,0.65)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '18px 20px',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                flexShrink: 0,
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#8BC642' }}>
                                DPDP Guideline
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowDpdpPopup(false)}
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'rgba(255,255,255,0.08)',
                                    color: '#fff',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer',
                                }}
                                aria-label="Close DPDP guideline popup"
                            >
                                <CloseIcon style={{ fontSize: 18 }} />
                            </button>
                        </div>

                        <div
                            className="dpdp-scroll"
                            style={{
                                padding: '18px 20px',
                                lineHeight: 1.65,
                                color: 'rgba(255,255,255,0.86)',
                                overflowY: 'auto',
                                flex: 1,
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#8BC642 #1b1b1b',
                            }}
                        >
                            {consentSections.map((section) => (
                                <div key={section.title} style={{ marginBottom: '18px' }}>
                                    <h4 style={{ color: '#8BC642', margin: '0 0 8px', fontSize: '1rem' }}>
                                        {section.title}
                                    </h4>
                                    {section.body?.map((line) => (
                                        <p key={line} style={{ margin: '0 0 8px' }}>
                                            {line}
                                        </p>
                                    ))}
                                    {section.bullets?.length ? (
                                        <ul style={{ paddingLeft: '20px', margin: '10px 0 0' }}>
                                            {section.bullets.map((item) => (
                                                <li key={item} style={{ marginBottom: '6px' }}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                padding: '0 20px 20px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flexShrink: 0,
                                background: 'linear-gradient(180deg, rgba(15,15,15,0.4), #0f0f0f)',
                            }}
                        >
                            <Button
                                text="I Understand"
                                onClick={() => setShowDpdpPopup(false)}
                                style={{
                                    backgroundColor: '#8BC642',
                                    color: '#111',
                                    borderRadius: '999px',
                                    fontWeight: 700,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                  @media (max-width: 576px) {
                    .dpdp-popup {
                      max-width: 92vw !important;
                      max-height: 72vh !important;
                    }
                  }
                  .dpdp-scroll::-webkit-scrollbar {
                    width: 8px;
                  }
                  .dpdp-scroll::-webkit-scrollbar-track {
                    background: #1b1b1b;
                    border-radius: 999px;
                  }
                  .dpdp-scroll::-webkit-scrollbar-thumb {
                    background: #8BC642;
                    border-radius: 999px;
                  }
                `}
            </style>
        </div>


    );
};

export default Register;
