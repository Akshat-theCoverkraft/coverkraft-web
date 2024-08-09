import React, { useState, useEffect } from 'react';
import './CSS/policyType.css';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux'
import { getAllPolicyType } from '../../store/action/action';
import API_URL from '../../ServiceModule/Service';
import IMAGE_PATH from '../../ServiceModule/imagePath';

const PolicyType = () => {
    const [policyType, setPolicyType] = useState([]);
    const policyTypes = useSelector((state) => state.user);
    const dispatch = useDispatch();

    //useeffect
    useEffect(() => {
        dispatch(getAllPolicyType(API_URL));
    }, [dispatch]);

    useEffect(() => {
        if (policyTypes !== null && policyTypes !== undefined) {
            if (policyTypes.getPolicyType !== null && policyTypes.getPolicyType !== undefined) {
                if (policyTypes.getPolicyType.data !== null && policyTypes.getPolicyType.data !== undefined) {
                    setPolicyType(policyTypes.getPolicyType.data)
                }
            }
        }

    }, [policyTypes])

    return (
        // <div className='p-5  rounded-5 gradient-background '
        //     style={{
        //         margin: '0px 90px',
        //     }}>
        //     <h3 className='text-center mb-4 fs-1 fw-bold'>
        //         Reliable <span style={{ color: '#FF9906' }}>Insurance</span> for every need.
        //     </h3>
        //     <div style={{marginTop: "3em"}}>
        //         <div className='mb-4' style={{ display: 'flex' ,alignContent:'center',alignItems:'center'}}>
        //             {policyType.map((policy, index) => (
        //                 <div
        //                     key={index}
        //                     className={`item-container ${index === 0 ? 'first-item' : index === policyType.length - 1 ? 'last-item' : ''}`}
        //                     style={{
        //                         transition: 'transform 0.5s ease, background-color 0.5s ease',
        //                         cursor: 'pointer',
        //                       }}
        //                     onMouseEnter={(e) => {
        //                         e.currentTarget.style.transform = 'translateY(-10px) scale(1.25)';
        //                       }}
        //                       onMouseLeave={(e) => {
        //                         e.currentTarget.style.transform = 'translateY(0) scale(1)';
        //                       }}
        //                 >
        //                     <div className='item-content mb-3'>
        //                         <img
        //                             src={IMAGE_PATH + policy.icon}
        //                             alt={policy.policyType}
        //                             className='policy-icon'
                                   
                                   
        //                         />
                                
        //                     </div>
        //                     <h4 className='image-text'>{policy.policyType}</h4>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>

        // </div>

        <div
  className="p-5 rounded-5 gradient-background"
  style={{
    margin: '0px 5%',
  }}
>
  <h3 className="text-center mb-4 fs-1 fw-bold">
    Reliable <span style={{ color: '#FF9906' }}>Insurance</span> for every need.
  </h3>
  <div style={{ marginTop: '3em' }}>
    <div
      className="mb-4"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem', // Space between items
      }}
    >
      {policyType.map((policy, index) => (
        <div
          key={index}
          className={`item-container ${index === 0 ? 'first-item' : index === policyType.length - 1 ? 'last-item' : ''}`}
          style={{
            transition: 'transform 0.5s ease, background-color 0.5s ease',
            cursor: 'pointer',
            flex: '1 1 200px', // Flex basis and growth for responsive layout
            maxWidth: '220px',
            textAlign: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) scale(1.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <div className="item-content mb-3">
            <img
              src={IMAGE_PATH + policy.icon}
              alt={policy.policyType}
              className="policy-icon"
              style={{
                width: '100%', // Ensures the image is responsive
                maxHeight: '150px', // Limits the height of the image
                objectFit: 'contain', // Keeps the aspect ratio
              }}
            />
          </div>
          <h4 className="image-text">{policy.policyType}</h4>
        </div>
      ))}
    </div>
  </div>
</div>


    );
}

export default PolicyType;
