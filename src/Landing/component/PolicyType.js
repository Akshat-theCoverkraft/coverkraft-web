import React, { useState, useEffect } from 'react';
import './CSS/policyType.css';
import HealthInsurance from '../../Images/Health Insurance-1.png';
import twoWheeler from '../../Images/Two Wheeler Insurance.png';
import HealthInsurance2 from '../../Images/Health Insurance.png';
import travel from '../../Images/Travel Insurance.png';
import car from '../../Images/Car Insurance.png';
import taxi from '../../Images/Taxi Insurance.png';
import term from '../../Images/Term Life Insurance.png';
import family from '../../Images/Family Health Insurance.png';
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
        <div className=' p-5 d-flex  rounded-4' style={{ backgroundColor: '#E5F0F4', margin: '40px 90px' }}>

            {/* <div className='grid-container col-md-8 mr-5 pr-5'> */}
            <Grid container spacing={6}>
                <Grid item xs={12} md={8}  >
                    <Grid container spacing={4} >
                        {policyType.map((policy, index) => (
                            <Grid item xs={6} md={4} lg={3} xl={3} style={{ width: '80%' }} >
                                <div key={index}>
                                    <div className='card'>
                                        <img
                                            src={
                                                IMAGE_PATH + policy.icon
                                            }                                            
                                            alt={policy.policyType} 
                                            
                                              />

                                    </div>
                                    <h4 className='text-center mt-3 image-text'>{policy.policyType}</h4>
                                </div>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
                <Grid item xs={12} md={4} className='d-flex flex-column justify-content-center align-items-center'>

                    <Grid container xs={4} md={8} className='border-start border-secondary d-flex flex-column justify-content-center align-items-center'>
                        <button className='btn  rounded-pill  mb-3 policy-btn'>Policy</button>
                        <h3 className='text-center  '  >Let’s get you & your <br />  family insured</h3>
                        <div class="border-element"></div>
                    </Grid>


                </Grid>

            </Grid>

            
        </div>
    );
}

export default PolicyType;
