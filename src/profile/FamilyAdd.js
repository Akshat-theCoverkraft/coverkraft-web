import React, { useState } from 'react'
import { Drawer, Box, Grid, Card, Typography } from '@mui/material';
import GlobalDropdown from '../component/StateDropdown';
import CustomInput from '../component/CustomInput';
import Button from '../component/Button';
import backArrow from '../Images/ic_back_button.png';
import axios from 'axios';
import API_URL from '../ServiceModule/Service';
import Dropdown from '../component/Dropdown';

const FamilyAdd = ({ familyAdd, onfamilyAddClose }) => {
    const [familyMember, setFamilyMember] = useState('');
    const [fullName, setFullName] = useState('')
    const [userPhone, setuserPhone] = useState('');
    const [useremail, setuserEmail] = useState('');
    const [valid, setValid] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);


    const familyOption = [
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Son', label: 'Son' },
        { value: 'Daughter', label: 'Daughter' },
        { value: 'Father', label: 'Father' },
        { value: 'Mother', label: 'Mother' },
    ]

   //function to handle phone number input field start
   const handlephonechange = (e) => {
    let number = e.target.value.replace(/\D/g, '');
    number = number.slice(0, 10);
    setuserPhone(number);
    const isValid = /^\d{10}$/.test(number.replace('+91', ''));
    setValid(isValid);
}
//function to handle phone number input field end

//function to handle email input field start
const handleEmailChange = (e) => {
    const emailId = e.target.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(useremail);
    setuserEmail(emailId);
    setIsValidEmail(isValid);
};
//function to handle email input field start

    async function handleSubmit() {
        const formData = new FormData();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        formData.append('userId', userId);
        formData.append('fullName', fullName);
        formData.append('familyMember', familyMember);
        formData.append('mobile', userPhone);
        formData.append('email', useremail)
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
                    <Dropdown
                        label="Family Member"
                        options={familyOption}
                        value={familyMember}
                        onChange={(e) => setFamilyMember(e.target.value)}
                        placeholder="select"
                        required
                    />
                </Box>
                <Box sx={{ marginTop: 2, width: '100%' }}>
                    <CustomInput
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </Box>
                <Box sx={{ marginTop: 2, width: '100%' }}>
                    <CustomInput
                        label="UserPhone"
                        type='number'
                        placeholder="Enter your UserPhone"
                        value={userPhone}
                        onChange={handlephonechange}
                        className={!valid ? 'is-invalid' : ''}
                        validationMessage={!valid ? ' Please enter a valid 10-digit mobile number.' : ''}
                        required
                    />
                </Box>
                <Box sx={{ marginTop: 2, width: '100%' }}>
                    <CustomInput
                        label="UserEmail"
                        placeholder="Enter your UserEmail"
                        value={useremail}
                        onChange={handleEmailChange}
                        className={!isValidEmail ? 'is-invalid' : ''}
                        validationMessage={!isValidEmail ? 'Please enter a valid email address containing @.' : ''}
                       required
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
