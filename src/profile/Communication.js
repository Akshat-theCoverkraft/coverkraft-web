import React, { useEffect, useState } from 'react'
import { Drawer, Box, Grid, Typography, Card } from '@mui/material'
import backArrow from '../Images/ic_back_button.png';
import sms from '../Images/ic-sms.png'
import call from '../Images/ic-call.png';
import wtsp from '../Images/ic-wtsp.png'
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
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
  const [selectedValue, setSelectedValue] = React.useState('a');
  const [checked, setChecked] = useState(false);
  const userbyId = useSelector((state) => state.user);
  const [switchStates, setSwitchStates] = useState({
    userSms: false,
    userCall: false,
    userWhatsapp: false,
  });
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  useEffect(() => {

    dispatch(getBYIDUsers(API_URL, userId));
  }, [dispatch]);

  useEffect(() => {
    if (userbyId.getUserById && userbyId.getUserById.data) {
      const data = userbyId.getUserById.data;
      console.log("data", data)
      setSwitchStates({
        userSms: data.userSms,
        userCall: data.userCall,
        userWhatsapp: data.userWhatsapp,
      });
    }
  }, [userbyId]);

  const handleUpdate = (switchName) => (event) => {
    const newChecked = event.target.checked;
    setSwitchStates(prevStates => ({
      ...prevStates,
      [switchName]: newChecked,
    }));
    if(switchStates){
    const formData = new FormData();
    formData.append('_id', userId)
    formData.append([switchName], newChecked);
    dispatch(updateUser(API_URL, formData))
    }
  };


  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  return (
    <Drawer anchor="right" open={communication} onClose={onCommunicationClose}>
      <Box sx={{ width: 750, padding: 0, overflowX: 'hidden' }} role="presentation">
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
            <p className='mb-3' style={{ color: '#7A7878' }}>Policy Updates: Important updates for your purchased policies payment, issuance renewal and reminders.</p>
            <Grid container xs={12} spacing={3} className='mb-3 mt-2'>
              <Grid item xs={1}>
                <img src={sms} height={40} />
              </Grid>
              <Grid item xs={10} className=' mt-1' style={{ fontWeight: '500' }}>SMS</Grid>
              <Grid item xs={1}> <PinkSwitch {...label} checked={switchStates.userSms}
                onChange={handleUpdate('userSms')} /></Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>
              <Grid item xs={1} >
                <img src={call} height={40} />
              </Grid>
              <Grid item xs={10} className=' mt-1' style={{ fontWeight: '500' }}>Call</Grid>
              <Grid item xs={1}> <PinkSwitch {...label} checked={switchStates.userCall}
                onChange={handleUpdate('userCall')} /></Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>
              <Grid item xs={1}>
                <img src={wtsp} height={40} />
              </Grid>
              <Grid item xs={10} className='mt-1' style={{ fontWeight: '500' }}>Whatsapp</Grid>
              <Grid item xs={1}> <PinkSwitch {...label} checked={switchStates.userWhatsapp}
                onChange={handleUpdate('userWhatsapp')} /></Grid>
            </Grid>
          </Card>
          <Card className='m-5 p-4 rounded-4 shadow'>
            <h3>Frequent Communication</h3>
            <p className='mb-3' style={{ color: '#7A7878' }}>Manage your communication preferences easily and stay informed your way.</p>
            <Grid container xs={12} spacing={3} className='mb-3 mt-2 '>

              <Grid item xs={11} className=' mt-1' style={{ fontWeight: '500' }}>Monthly</Grid>
              <Grid item xs={1}> <Radio
                {...controlProps('a')}
                sx={{
                  color: '#8AC642',
                  '&.Mui-checked': {
                    color: '#8AC642',
                  },
                }}
              /></Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>

              <Grid item xs={11} className=' mt-1' style={{ fontWeight: '500' }}>Yearly</Grid>
              <Grid item xs={1}> <Radio
                {...controlProps('b')}
                sx={{
                  color: '#8AC642',
                  '&.Mui-checked': {
                    color: '#8AC642',
                  },
                }}
              /></Grid>
            </Grid>
            <Grid container xs={12} spacing={3} className='mb-3'>

              <Grid item xs={11} className='mt-1' style={{ fontWeight: '500' }}>Never</Grid>
              <Grid item xs={1}> <Radio
                {...controlProps('c')}
                sx={{
                  color: '#8AC642',
                  '&.Mui-checked': {
                    color: '#8AC642',
                  },
                }}
              /></Grid>
            </Grid>
          </Card>
        </div>
      </Box>
    </Drawer>
  )
}

export default Communication
