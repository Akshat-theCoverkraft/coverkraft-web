import { useState, useEffect } from 'react';
import './CSS/policyType.css';
import policyType from './CSS/policyType.css';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPolicyType } from '../../store/action/action';
import API_URL from '../../ServiceModule/Service';
import { useNavigate } from 'react-router-dom';

const PolicyType = () => {
  const [policyType, setPolicyType] = useState([]);
  const policyTypes = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPolicyType(API_URL));
  }, [dispatch]);

  useEffect(() => {
    if (
      policyTypes &&
      policyTypes.getPolicyType &&
      Array.isArray(policyTypes.getPolicyType.data)
    ) {
      setPolicyType(policyTypes.getPolicyType.data);
    }
  }, [policyTypes]);

  const CustomArrow = ({ direction, onClick }) => (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        [direction]: '-40px',
        transform: 'translateY(-50%)',
        zIndex: 1,
        background: "rgba(241, 239, 239, 0.3)",
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}
    >
      <i
        className={`fas fa-chevron-${direction === 'left' ? 'left' : 'right'}`}
        style={{ color: '#fff', fontSize: '16px' }}
      ></i>
    </div>
  );


 const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: Math.min(5, policyType.length),
  slidesToScroll: 1,
  arrows: false,
  appendDots: dots => (
    <div
      style={{
        marginTop: '1.5em',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <ul style={{ display: 'flex', gap: '0px' }}>{dots}</ul>
    </div>
  ),
  customPaging: i => (
    <div
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        transition: 'all 0.3s ease',
      }}
    ></div>
  ),
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 4, slidesToScroll: 1 }
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 3, slidesToScroll: 1 }
    },
    {
      breakpoint: 576,
      settings: { slidesToShow: 2, slidesToScroll: 1 }
    }
  ]
};

  // Add the keyframe animation styles
  const animatedBorderStyles = `
    @keyframes borderFlow {
      0% {
        border-image-source: linear-gradient(0deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      25% {
        border-image-source: linear-gradient(90deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      50% {
        border-image-source: linear-gradient(180deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      75% {
        border-image-source: linear-gradient(270deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      100% {
        border-image-source: linear-gradient(360deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
    }
    
    .animated-border {
      position: relative;
      border: 1px solid;
      border-image: linear-gradient(45deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D) 1;
      animation: borderFlow 3s linear infinite;
    }
    
    .animated-border::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 1px;
      background: linear-gradient(45deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      border-radius: 16px;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      animation: borderRotate 3s linear infinite;
      z-index: -1;
    }
    
    @keyframes borderRotate {
      0% {
        background: linear-gradient(0deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      25% {
        background: linear-gradient(90deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      50% {
        background: linear-gradient(180deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      75% {
        background: linear-gradient(270deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      100% {
        background: linear-gradient(360deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
    }
    
    .policy-container {
      position: relative;
      overflow: visible;
    }
    
    .policy-container::before {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(45deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      border-radius: 19px;
      z-index: -1;
      animation: borderSpin 3s linear infinite;
    }
    
    @keyframes borderSpin {
      0% {
        background: linear-gradient(0deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      25% {
        background: linear-gradient(90deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      50% {
        background: linear-gradient(180deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      75% {
        background: linear-gradient(270deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
      100% {
        background: linear-gradient(360deg, #A8A8A8, #33A36D, #A8A8A8, #33A36D);
      }
    }
  `;

  return (
    <>
      <style>{animatedBorderStyles}</style>
      <div
        className="policy-container p-5 rounded-5 shadow-lg"
        style={{
          margin: '0px 6%',
          background: 'linear-gradient(105deg, #3E3E3E 0%, #121212 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          paddingHorizontal: '2em',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h3
          className="text-center mb-4"
          style={{
            fontSize: '2.3rem',
            fontWeight: '700',
            paddingBottom: '0.5em',
            paddingTop: '0.5em',
          }}
        >
          Let's get you & your family insured
          {/* Reliable <span style={{ color: '#FF9906' }}>Insurance</span> for every need. */}
        </h3>

        <div style={{ paddingTop: '0.05em', paddingBottom: '0.5em', }}>
          <Slider
            {...settings}
            style={{ padding: '0.5em', paddingBottom: '2em' }}
          >
            {policyType.map((policy, index) => (
              <div key={index} style={{ paddingTop: '0.02em', overflow: 'visible' }}>
                <div
                  className="item-container"
                  style={{
                    backgroundColor: '#2c2c3e',
                    padding: '1.5em',
                    width: '90%',
                    margin: '0 auto',
                    textAlign: 'center',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    willChange: 'transform',
                  }}
                  onClick={() => navigate(`/policy-details/${policy._id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                  }}
                >

                  <div className="item-content" style={{ marginBottom: '1em' }}>
                    <img
                      src={policy.icon}
                      alt={policy.policyType}
                      className="policy-icon"
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'contain',
                        margin: '0 auto',
                      }}
                    />
                  </div>
                  <h4
                    className="image-text"
                    style={{ fontSize: '1.6rem', fontWeight: '600', marginBottom: '0.3em' }}
                  >
                    {policy.policyType}
                  </h4>
                  <p className="image-subtext" style={{ fontSize: '1.4rem', color: '#ccc' }}>
                    Insurance
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default PolicyType;