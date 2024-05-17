import { getMessaging, getToken } from "firebase/messaging";

const messaging=getMessaging();

export const requestForToken = () => {
    return getToken(messaging, { vapidKey: 'BL7_NqMdbqAZPqZs2FDhbbgu7pBvE4y374HNGBH4SvgK-SW-6WNRVFDe2yFW9u4defdGDuRrNQshF5YvljnXFFs' })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);// Perform any other neccessary action with the token
                localStorage.setItem('fcmToken', currentToken);
            } else {// Show permission request UI        
                console.log('No registration token available. Request permission to generate one.');
            }
        }).catch((err) => { console.log('An error occurred while retrieving token. ', err); });
};

// To retrieve the token from local storage later
export const getStoredToken = () => {
    return localStorage.getItem('fcmToken');
};