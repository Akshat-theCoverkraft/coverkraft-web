import React, { useEffect, useState } from 'react';
import { Drawer, Box, Grid, Typography, Card, CircularProgress, Box as MuiBox } from '@mui/material';
import backArrow from '../Images/ic_back_button.png';
import sms from '../Images/ic-sms.png';
import call from '../Images/ic-call.png';
import wtsp from '../Images/ic-wtsp.png';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import { getBYIDUsers, updateUser } from '../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import API_URL from '../ServiceModule/Service';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#8AC642',
    '&:hover': {
      backgroundColor: alpha('#8AC642', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#8AC642',
  },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const Communication = ({ communication, onCommunicationClose }) => {
  const [selectedValue, setSelectedValue] = useState('a');
  const [switchStates, setSwitchStates] = useState({
    userSms: false,
    userCall: false,
    userWhatsapp: false,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const userbyId = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getBYIDUsers(API_URL, userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userbyId.getUserById && userbyId.getUserById.data) {
      const data = userbyId.getUserById.data;
      setSwitchStates({
        userSms: data.userSms,
        userCall: data.userCall,
        userWhatsapp: data.userWhatsapp,
      });
      setSelectedValue(data.userFrequent); // Set the initial value for radio buttons
    }
  }, [userbyId]);

  const handleSwitchUpdate = (switchName) => async (event) => {
    const newChecked = event.target.checked;
    setSwitchStates(prevStates => ({
      ...prevStates,
      [switchName]: newChecked,
    }));
    setLoading(true); // Show loader

    // Create form data
    const formData = new FormData();
    formData.append('_id', userId);
    formData.append(switchName, newChecked);

    try {
      await dispatch(updateUser(API_URL, formData));
    } catch (error) {
      console.error('Error updating the switch state', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleRadioChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    setLoading(true); // Show loader

    // Create form data
    const formData = new FormData();
    formData.append('_id', userId);
    formData.append('userFrequent', newValue);

    try {
      dispatch(updateUser(API_URL, formData));
    } catch (error) {
      console.error('Error updating the radio button state', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleRadioChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  return (
    <Drawer anchor="right" open={communication} onClose={onCommunicationClose}>
      <Box sx={{ width: 750, padding: 0, overflowX: 'hidden' }} role="presentation" className='overflow-hidden'>
        <div style={{ backgroundColor: "#FFFEFE" }}>
          <Grid container spacing={2} className='d-flex m-3'>
            <Grid item>
              <img src={backArrow} alt="Back" onClick={onCommunicationClose} />
            </Grid>
            <Grid item>
              <Typography variant="h4">Communication Preferences</Typography>
            </Grid>
          </Grid>
          <Card className='m-5 p-4 rounded-4 shadow'>
            <h3>Policy Updates</h3>
            <p className='mb-3' style={{ color: '#7A7878' }}>
              Policy Updates: Important updates for your purchased policies payment, issuance renewal, and reminders.
            </p>
            <Grid container xs={12} spacing={3} className='mb-3 mt-2'>
              <Grid item xs={1}>
                <img src={sms} height={40} />
              </Grid>
              <Grid item xs={10} className='mt-1' style={{ fontWeight: '500' }}>SMS</Grid>
              <Grid item xs={1}>
                <PinkSwitch {...label} checked={switchStates.userSms} onChange={handleSwitchUpdate('userSms')} />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>
              <Grid item xs={1}>
                <img src={call} height={40} />
              </Grid>
              <Grid item xs={10} className='mt-1' style={{ fontWeight: '500' }}>Call</Grid>
              <Grid item xs={1}>
                <PinkSwitch {...label} checked={switchStates.userCall} onChange={handleSwitchUpdate('userCall')} />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>
              <Grid item xs={1}>
                <img src={wtsp} height={40} />
              </Grid>
              <Grid item xs={10} className='mt-1' style={{ fontWeight: '500' }}>Whatsapp</Grid>
              <Grid item xs={1}>
                <PinkSwitch {...label} checked={switchStates.userWhatsapp} onChange={handleSwitchUpdate('userWhatsapp')} />
              </Grid>
            </Grid>
          </Card>
          <Card className='m-5 p-4 rounded-4 shadow'>
            <h3>Frequent Communication</h3>
            <p className='mb-3' style={{ color: '#7A7878' }}>
              Manage your communication preferences easily and stay informed your way.
            </p>
            <Grid container xs={12} spacing={3} className='mb-3 mt-2'>
              <Grid item xs={11} className='mt-1' style={{ fontWeight: '500' }}>Monthly</Grid>
              <Grid item xs={1}>
                <Radio
                  {...controlProps('1')}
                  sx={{
                    color: '#8AC642',
                    '&.Mui-checked': {
                      color: '#8AC642',
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>
              <Grid item xs={11} className='mt-1' style={{ fontWeight: '500' }}>Yearly</Grid>
              <Grid item xs={1}>
                <Radio
                  {...controlProps('2')}
                  sx={{
                    color: '#8AC642',
                    '&.Mui-checked': {
                      color: '#8AC642',
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>
              <Grid item xs={11} className='mt-1' style={{ fontWeight: '500' }}>Never</Grid>
              <Grid item xs={1}>
                <Radio
                  {...controlProps('3')}
                  sx={{
                    color: '#8AC642',
                    '&.Mui-checked': {
                      color: '#8AC642',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </div>
        {loading && (
          <MuiBox
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1200, // Higher than other elements
            }}
          >
            <CircularProgress color="primary" />
          </MuiBox>
        )}
      </Box>
    </Drawer>
  );
};

export default Communication;
