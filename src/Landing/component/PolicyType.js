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
        <div className='p-5  rounded-5 gradient-background'
            style={{
                margin: '0px 90px',
                // background: 'linear-gradient(122.01deg, #42CDC9 7.48%, #B4E498 86.54%)'
            }}>
            <h3 className='text-center mb-4 fs-1 fw-bold'>
                Reliable <span style={{ color: '#FF9906' }}>Insurance</span> for every need.
            </h3>
            <div>
                <div className='mt-2' style={{ display: 'flex' ,alignContent:'center',alignItems:'center'}}>
                    {policyType.map((policy, index) => (
                        <div
                            key={index}
                            className={`item-container ${index === 0 ? 'first-item' : index === policyType.length - 1 ? 'last-item' : ''}`}
                        >
                            <div className='item-content mb-3'>
                                <img
                                    src={IMAGE_PATH + policy.icon}
                                    alt={policy.policyType}
                                    className='policy-icon'
                                />
                            </div>
                            <h4 className='image-text'>{policy.policyType}</h4>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default PolicyType;
