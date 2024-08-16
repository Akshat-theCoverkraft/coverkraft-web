import { Card, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import ck from '../Images/ck.png';
import Navbar from '../component/Navbar';
import Footer from '../Landing/component/Footer';
import axios from 'axios';
import API_URL from '../ServiceModule/Service';
import IMAGE_PATH from '../ServiceModule/imagePath';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [open, setOpen] = useState(false);
    const [sentNotificationsCount,setSentNotificationsCount]=useState(0)

    useEffect(() => {
        // Fetch notifications
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${API_URL}notification/getAll`, {
                    params: {
                        status: 'active'
                    }
                });
                setNotifications(response.data.data);
                const sentCount = response.data.data.filter((notification) => notification.notificationStatus === 'sent').length;
                setSentNotificationsCount(sentCount);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const markAsSeen = async (id) => {
        console.log('idseen', id);
        try {
            await axios.post(`${API_URL}notification/update`, {
                _id: id,
                notificationStatus: 'seen'
            });
        } catch (error) {
            console.error('Error marking as seen:', error);
        }
    };


    const truncateDescription = (description, wordLimit) => {
        const words = description.split(' ');
        if (words.length <= wordLimit) {
            return description;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    };
    const handleReadMore = (notification) => {
        setSelectedNotification(notification);
        setOpen(true);
        markAsSeen(notification._id);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div className=''>
            <Navbar />
            <div className='m-5 p-5' style={{minHeight:'450px'}}>
                <Typography className='custom-color mb-3' sx={{ p: 2, fontSize: '17px', fontWeight: '500' }}>{sentNotificationsCount} new notification</Typography>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.map((notification, index) => (
                        <Card key={index} className='rounded mb-5' sx={{ mx: 2, my: 3, p: 1, backgroundColor: '#F8FFFE', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px' }}>
                            <Grid container spacing={3} xs={12}>
                                <Grid item xs={2}>
                                    <img className='p-3' src={IMAGE_PATH + notification.imagePath} alt='Notification Icon' height={150} width={250} />
                                </Grid>
                                <Grid item xs={8}>
                                    <p style={{ fontSize: '17px', fontWeight: '700' }}>{notification.title}</p>
                                    <p style={{ color: '#7C7C7C', fontSize: '16px', fontWeight: '400' }}>
                                        {truncateDescription(notification.description, 20)} <span onClick={() => handleReadMore(notification)}>Read more</span>
                                    </p>
                                </Grid>
                                <Grid item xs={2}>
                                    <p style={{ color: '#A0A0A0', fontSize: '17px' }}>{notification.timeAgo}</p>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </div>
            </div>
            <Footer />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{selectedNotification?.title}</DialogTitle>
                <DialogContent>
                    <Typography>{selectedNotification?.description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Notification
