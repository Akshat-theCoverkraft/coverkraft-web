
import { useState, useEffect } from 'react';
import './CSS/policyType.css';
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(5, policyType.length),
    slidesToScroll: 1,
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

  return (
    <div className="p-5 rounded-5 gradient-background" style={{ margin: '0px 5%' }}>
      <h3 className="text-center mb-4 fs-1 fw-bold">
        Reliable <span style={{ color: '#FF9906' }}>Insurance</span> for every need.
      </h3>
      <div style={{ marginTop: '3em' }}>
        <Slider {...settings} style={{ paddingBottom: '2em' }}>
          {policyType.map((policy, index) => (
            <div key={index}>
              <div
                className="item-container"
                onClick={() => navigate(`/policy-details/${policy._id}`)}
              >
                <div className="item-content">
                  <img
                    src={policy.icon}
                    alt={policy.policyType}
                    className="policy-icon"
                  />
                </div>
                <h4 className="image-text">{policy.policyType}</h4>
                <p className="image-subtext">Insurance</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PolicyType;
