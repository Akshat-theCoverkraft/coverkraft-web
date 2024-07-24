import React, { useEffect, useState } from 'react'
import Navbar from '../../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box';
import CustomInput from '../../component/CustomInput';
import Button from '../../component/Button';
import { useLocation } from 'react-router-dom';
import Vault from '../Vault';
import { useDispatch } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../ServiceModule/Service';
import { saveDocument, updateDocument } from '../../store/action/action';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import Footer from '../../Landing/component/Footer';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ProgressBarCircle from '../../component/ProgressBarCircle';
const HealthPolicyForm = () => {
  const location = useLocation();
  const responseData = location.state?.responseData;
  const mode = location.state?.mode;
  const policyDetails = location.state?.policyDetails;

  // Now you can use the responseData and mode in your component
  let headingText;
  if (mode === 'edit') {
    headingText = 'Edit Policy';
  } else {
    headingText = 'Add Policy';
  }
  // const responseData = JSON.parse(responseData.ocrText);
  const PolicyType = responseData.policyType.toLowerCase();

  const [policyNumber, setPolicyNumber] = useState(responseData.policyNumber || policyDetails?.policyNumber || "");
  const [policyStartDate, setPolicyStartDate] = useState(responseData.policyStartDate || policyDetails?.policyStartDate || "");
  const [policyEndDate, setPolicyEndDate] = useState(responseData.policyEndDate || policyDetails?.policyEndDate || "");
  const [sumAssured, setSumAssured] = useState(responseData.sumInsured || policyDetails?.policyDetails?.sumInsured || "");
  const [totalSumAssured, setTotalSumAssured] = useState(responseData.totalSumInsured || policyDetails?.policyDetails?.totalSumInsured || '')
  const [premiumPaid, setPremiumPaid] = useState(responseData.premiumPaid || policyDetails?.premiumPaid || "");
  const [netPremium, setNetPremium] = useState(responseData.netPremium || policyDetails?.policyDetails?.netPremium || "");
  const [insuredName, setInsuredName] = useState(responseData.insuredName || policyDetails?.insuredName || "");
  const [insuredCompany, setInsuredCompany] = useState(responseData.insuranceCompany || policyDetails?.insuredCompany || "");
  const [dob, setDob] = useState(responseData.dob || "");
  const [policyName, setPolicyName] = useState(responseData.policyName || "");
  // const [idv, setIdv] = useState(responseData.idv || "");

  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const documentId = localStorage.getItem('documentId');
  const token = localStorage.getItem('token')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //     if (mode === 'edit' && responseData) {
  //       setPolicyNumber(responseData.policyNumber || "");
  //       setPolicyStartDate(responseData.policyStartDate || "");
  //       setPolicyEndDate(responseData.policyEndDate || "");
  //       setSumAssured(responseData.policyDetails.sumAssured || "");
  //       setPremiumPaid(responseData.policyDetails.premiumPaid || "");
  //       setInsuredName(responseData.insuredName || "");
  //       setInsuredCompany(responseData.policyDetails.insuranceCompany || "");
  //       setDob(responseData.policyDetails.dob || "");
  //       setPolicyName(responseData.policyDetails.policyName || "");
  //       setIdv(responseData.policyDetails.idv || "");
  //     }
  //   }, [mode, responseData]);
  const inputFields = [
    policyNumber,
    policyStartDate,
    policyEndDate,
    sumAssured,
    premiumPaid,
    insuredName,
    insuredCompany,
    policyName,

  ];
  const calculateProgress = () => {
    const filledFields = inputFields.filter((field) => field !== "").length;
    const totalFields = inputFields.length;
    return (filledFields / totalFields) * 100;
  };
  const handleDobChange = (date) => {
    setDob(date);
  };
  const handleStartDateChange = (date) => {
    setPolicyStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setPolicyEndDate(date);
  };
  useEffect(() => {
    // Calculate progress whenever input fields change
    const progress = calculateProgress();
    // Handle progress value, you can store it in state or use directly
  }, [
    policyNumber,
    policyStartDate,
    policyEndDate,
    sumAssured,
    premiumPaid,
    insuredName,
    insuredCompany,
    policyName,
  ]);
  const handleSubmit = async () => {
    try {
      setLoading(true); // Set loading state to true to disable the button

      const payload = {
        policyNumber,
        policyStartDate,
        policyEndDate,
        sumAssured,
        premiumPaid,
        insuredName,
        insuredCompany,
        policyName,
      };

      if (validateFields(payload)) {
        if (mode === 'edit') {
          // Make API call to update the existing policy
          await updatePolicy(payload);
        } else {
          // Make API call to create a new policy
          await createPolicy(payload);
        }
        navigate('/')
      } else {
        toast.error("error", "Please fill all required fields!");
      }
    } catch (error) {
      console.error('Failed to save policy:', error);
    } finally {
      setLoading(false); // Reset loading state to false after API call completes
    }
  };

  const validateFields = (payload) => {
    // Implement your validation logic here
    return (
      payload.policyNumber &&
      payload.policyStartDate &&
      payload.policyEndDate &&
      payload.sumAssured &&
      payload.premiumPaid &&
      payload.insuredName &&
      payload.insuredCompany &&
      payload.policyName 
      
    );
  };

  const createPolicy = (payload) => {
    console.log('================')

    const formData = new FormData();

    formData.append('userId', userId);
    formData.append('documentId', documentId);
    formData.append('policyType', PolicyType);
    formData.append('policyNumber', policyNumber);
    formData.append('policyStartDate', policyStartDate);
    formData.append('policyEndDate', policyEndDate);
    formData.append('sumInsured', sumAssured);
    formData.append('totalSumInsured',totalSumAssured)
    formData.append('premiumPaid', premiumPaid);
    formData.append('netPremium', netPremium);
    formData.append('insuredName', insuredName);
    formData.append('insuranceCompany', insuredCompany);
    formData.append('dob', dob);
    formData.append('policyName', policyName)
    
    dispatch(saveDocument(API_URL, formData));
    navigate('/coverkraft/vault')
  }

  const updatePolicy = (payload) => {
    console.log('================')
    const formData = new FormData();

    formData.append('userId', userId);
    formData.append('documentId', documentId);
    formData.append('policyType', PolicyType);
    formData.append('policyNumber', policyNumber);
    formData.append('policyStartDate', policyStartDate);
    formData.append('policyEndDate', policyEndDate);
    formData.append('sumInsured', sumAssured);
    formData.append('totalSumInsured',totalSumAssured)
    formData.append('totalPremium', premiumPaid);
    formData.append('netPremium', netPremium);
    formData.append('insuredName', insuredName);
    formData.append('insuranceCompany', insuredCompany);
    formData.append('dob', dob);
    formData.append('policyName', policyName)
    
    dispatch(updateDocument(API_URL, formData));
    navigate('/coverkraft/vault')
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Grid container justifyContent="center" alignItems='center' sx={{ backgroundColor: '#F9F9F9' }}>
        <Grid item xs={12} sm={10} md={8}>
          <Card className='border  my-4' style={{ padding: '40px 90px', boxShadow: ' rgba(17, 17, 26, 0.1) 0px 0px 16px', borderRadius: '20px' }}>
            <div className='d-flex justify-content-between'>
              <Typography variant="h4" component="h2" className='fw-bold'>{headingText}</Typography>
              <ProgressBarCircle progress={calculateProgress()} />                        </div>
            <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}> Details</p>
            <div>

              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    type="text"
                    label="Policy Number"
                    // placeholder="policy number"
                    value={policyNumber}
                    onChange={(e) => {
                      setPolicyNumber(e.target.value);
                    }}
                    required
                  />
                  <label className="form-label fw-bold" htmlFor="inputField">
                    DOB <span className='text-danger'>*</span>
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        defaultValue={dayjs(dob)}
                        selected={dob}
                        onChange={(newValue) => {
                          setDob(newValue); // Set the new date directly
                        }}
                        selectsStart
                        startDate={dob}
                        placeholderText="MM/DD/YYYY"
                        style={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <Grid container spacing={3} className='mt-2'>
                    <Grid item xs={12} md={6}>

                      <label className="form-label fw-bold" htmlFor="inputField">
                        Start date <span className='text-danger'>*</span>
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            defaultValue={dayjs(policyStartDate)}
                            selected={policyStartDate}
                            onChange={(newValue) => {
                              setPolicyStartDate(newValue); // Set the new date directly
                            }}
                            selectsStart
                            startDate={policyStartDate}
                            placeholderText="MM/DD/YYYY"
                            style={{ width: '100%' }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>

                      <label className="form-label fw-bold" htmlFor="inputField">
                        End date <span className='text-danger'>*</span>
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            defaultValue={dayjs(policyEndDate)}
                            selected={policyEndDate}
                            onChange={(newValue) => {
                              setPolicyEndDate(newValue); // Set the new date directly
                            }}
                            selectsStart
                            startDate={policyEndDate}
                            placeholderText="MM/DD/YYYY"
                            style={{ width: '100%' }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                  <CustomInput
                    type="text"
                    label="Insured Name"
                    value={insuredName}
                    onChange={(e) => {
                      setInsuredName(e.target.value);

                    }}
                    required
                  />
                  <CustomInput
                    type="text"
                    label="Insurance Company"
                    value={insuredCompany}
                    onChange={(e) => {
                      setInsuredCompany(e.target.value);

                    }}
                    required
                  />
                   <CustomInput
                    type="text"
                    label="Total Sum Insured"
                    value={totalSumAssured}
                    onChange={(e) => {
                      setTotalSumAssured(e.target.value);

                    }} 
                   
                  />



                  <Button
                    text={mode === 'edit' ? 'Update' : 'Save'}
                    size="lg"
                    block={true}
                    onClick={handleSubmit}

                  />

                </Grid>
                <Grid item xs={12} md={6}>
                  {/* <p className='custom-color my-4' style={{ fontSize: '18px', fontWeight: '700' }}>Vehicle Details</p> */}




                 
                  <CustomInput
                    type="number"
                    label="Net Premium"
                    value={netPremium}
                    onChange={(e) => {
                      setNetPremium(e.target.value);

                    }}
                   
                  />
                  <CustomInput
                    type="number"
                    label="Total Premium"
                    value={premiumPaid}
                    onChange={(e) => {
                      setPremiumPaid(e.target.value);
                    }}
                    required
                  />
                  <CustomInput
                    type="text"
                    label="Policy Name"
                    value={policyName}
                    onChange={(e) => {
                      setPolicyName(e.target.value);

                    }}
                    required
                  />
                  <CustomInput
                    type="number"
                    label="Sum Insured"
                    value={sumAssured}
                    onChange={(e) => {
                      setSumAssured(e.target.value);
                    }}
                    required
                  />

                </Grid>
              </Grid>


            </div>
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </div>
  )
}

export default HealthPolicyForm
