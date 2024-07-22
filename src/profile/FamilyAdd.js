import React, { useState } from 'react'
import { Drawer, Box, Grid,Card,Typography } from '@mui/material';
import GlobalDropdown from '../component/GlobalDropdown';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import backArrow from '../Images/ic_back_button.png';
import axios from 'axios';
import API_URL from '../ServiceModule/Service';

const FamilyAdd = ({ familyAdd, onfamilyAddClose }) => {
    const [familyMember, setFamilyMember] = useState('');
    const [fullName,setFullName]=useState('')
    const [userPhone, setuserPhone] = useState('');
    const [useremail, setuserEmail] = useState('');


    const familyOption = [
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Son', label: 'Son' },
        { value: 'Daughter', label: 'Daughter' },
        { value: 'Father', label: 'Father' },
        { value: 'Mother', label: 'Mother' },


    ]
     async function handleSubmit(){
        const formData=new FormData();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        formData.append('userId',userId);
        formData.append('fullName',fullName);
        formData.append('familyMember',familyMember);
        formData.append('mobile',userPhone);
        formData.append('email',useremail)
        const response = await axios.post(`${API_URL}family/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include token in the headers
            }
        });
        onfamilyAddClose();
    }
    return (
        <Drawer anchor="right" open={familyAdd} onClose={onfamilyAddClose}>
            <Box
                sx={{
                    width: 800, // fixed width
                    padding: 4, // padding inside the drawer
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto', // centers the content horizontally
                }}
                role="presentation"
            >
                <Grid container spacing={2} >
                    <Grid item>
                        <img src={backArrow} alt="Back" onClick={onfamilyAddClose} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">Plans for your family</Typography>
                    </Grid>
                </Grid>
                <Box sx={{ marginTop: 3, width: '100%' }}>
                    <GlobalDropdown
                        label="Family Member"
                        options={familyOption}
                        value={familyMember}
                        onChange={(e) => setFamilyMember(e.target.value)}
                        placeholder="select"
                    />
                </Box>
                <Box sx={{ marginTop: 2, width: '100%' }}>
                    <CustomInput
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </Box>
                <Box sx={{ marginTop: 2, width: '100%' }}>
                    <CustomInput
                        label="UserPhone"
                        placeholder="Enter your UserPhone"
                        value={userPhone}
                        onChange={(e) => setuserPhone(e.target.value)}
                    />
                </Box>
                <Box sx={{ marginTop: 2, width: '100%' }}>
                    <CustomInput
                        label="UserEmail"
                        placeholder="Enter your UserEmail"
                        value={useremail}
                        onChange={(e) => setuserEmail(e.target.value)}
                    />
                </Box>
                <Box sx={{ marginTop: 3, width: '100%' }}>
                    <Button
                        text='Continue'
                        size="sm"
                        block={true}
                    onClick={handleSubmit}
                    />
                </Box>
            </Box>
        </Drawer>
    )
}

export default FamilyAdd
