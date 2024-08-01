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
        <div className='p-5  rounded-4' style={{ backgroundColor: '#E5F0F4', margin: '0px 90px' }}>
            <h3 className='text-center mb-3'>
                Reliable <span style={{ color: '#FF9906' }}>Insurance</span> for every need.
            </h3>
            <div>
                <Grid container spacing={0} className='mt-2'>
                    {policyType.map((policy, index) => (
                        <Grid item xs={2} md={2} lg={2} xl={2} key={index}>
                            <div className='item-container'>
                                <div className='item-content mb-3'>
                                    <img
                                        src={IMAGE_PATH + policy.icon}
                                        alt={policy.policyType}
                                        className='policy-icon'
                                    />
                                </div>
                                <h4 className='image-text'>{policy.policyType}</h4>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>

        </div>
    );
}

export default PolicyType;
