import { Card, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import ck from '../Images/ck.png';
import Navbar from '../component/Navbar';
import Footer from '../Landing/component/Footer';
import axios from 'axios';
import API_URL from '../ServiceModule/Service';
import IMAGE_PATH from '../ServiceModule/imagePath';
import { THEME_COLOR } from '../constants';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [open, setOpen] = useState(false);
    const [sentNotificationsCount, setSentNotificationsCount] = useState(0);

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
        <div style={{ backgroundColor: '#121212', color: '#E0E0E0', minHeight: '100vh' }}>
            <Navbar />
            <div className='m-5 p-5'>
                <Typography className='custom-color mb-3' sx={{ p: 2, fontSize: '17px', fontWeight: '500', color: '#E0E0E0' }}>
                    {sentNotificationsCount} new notification{sentNotificationsCount > 1 ? 's' : ""}
                </Typography>
                <div style={{  overflowY: 'auto', width: '80vw', margin: 'auto', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    {notifications.map((notification, index) => (
                        <Card key={index} className='rounded mb-5' sx={{
                            mx: 2, my: 3, backgroundColor: '#1C1C1C', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px'
                        }}>
                            <Grid container spacing={3} style={{ backgroundColor: '#1C1C1C', minWidth: '80vw' }} className="px-5 py-3">
                            <Grid item xs={3}>
                                <img
                                    className='p-3'
                                    src={notification.imagePath}
                                    alt='Notification Icon'
                                    style={{
                                        height: '200px', 
                                        width: '200px', 
                                        objectFit: 'contain', 
                                        borderRadius: '8px'
                                    }}
                                />
                            </Grid>
                                <Grid item xs={7} className="pt-5">
                                    <p style={{ fontSize: '17px', fontWeight: '700', color: '#E0E0E0' }}>{notification.title}</p>
                                    <p style={{ color: '#A0A0A0', fontSize: '16px', fontWeight: '400' }}>
                                        {truncateDescription(notification.description, 20)} {notification?.description?.length > 20 && <span
                                            onClick={() => handleReadMore(notification)} style={{ color: THEME_COLOR.GREEN, cursor: 'pointer' }}>Read more</span>}
                                    </p>
                                </Grid>
                                <Grid item xs={2}>
                                    <p style={{ color: '#A0A0A0', fontSize: '17px', textAlign: 'right' }}>{sentNotificationsCount} day{sentNotificationsCount > 1 ? 's' : ''} ago</p>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </div>
            </div>
            <Footer />
            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#121212', color: '#E0E0E0' } }}>
                <DialogTitle style={{ color: '#E0E0E0' }}>{selectedNotification?.title}</DialogTitle>
                <DialogContent>
                    <Typography style={{ color: '#E0E0E0' }}>{selectedNotification?.description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" style={{ color: '#6200EE' }}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Notification;
