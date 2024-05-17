import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Login from "./LoginModule/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./LoginModule/Register";
// import firebaseConfig from "./ServiceModule/FirebaseConfig";
import { appFire } from "./ServiceModule/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { ToastContainer } from 'react-toastify';
import Landing from "./Landing/Landing";
import Vault from "./Vault/Vault";
import AddPolicy from "./Vault/component/AddPolicy";
import { messaging, getToken } from '../src/ServiceModule/FirebaseConfig';
import { requestForToken } from "./helper";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logout, setLogout] = useState(false)
  const navigate = useNavigate()
  // const firebaseApp = initializeApp(appFire); // Use the named export correctly
  // console.log('app', firebaseApp);
  // const app = initializeApp(firebaseConfig);
  // console.log('app',app);
  // if (!appFire.apps.length) {
  //   appFire.initializeApp(appFire);
  //   console.log('firebaseee',appFire)
  // //  const analytics = getAnalytics(app);
  // }
// Function for sessin time out start
  useEffect(() => {
    let logoutTimer;
    let loginTime;
    if (loginTime) {
      const resetTimer = () => {
        if (logoutTimer) {
          clearTimeout(logoutTimer);
        }
        const excludedPages = ['/','/login'];

        if (!excludedPages.includes(window.location.pathname)) {
          logoutTimer = setTimeout(() => {
            handleLogout();
          }, 30 * 60 * 1000);
        }
      };
    }
    else {
      handleRefresh()
    }
  }, []);
  
// Function for sessin time out start
useEffect(() => {
  requestForToken();
}, []);
// Function for logout start
  const handleLogout = () => {
    setLogout(true)
    setIsLoggedIn(false)
    navigate("/")
  }
// Function for logout end

// Function for refresh start
  const handleRefresh = () => { 
    const excludedPages = ['/','/login'];
    if (!excludedPages.includes(window.location.pathname)) {
      setLogout(true)
      setIsLoggedIn(false)
      navigate("/")
    }
  }
// Function for refreshing start

  return (
    <>
     <ToastContainer />
    <Routes>
       <Route path="/" element={<Landing/>}/>
       <Route path='/register' element={<Register/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path = '/vault' element={<Vault/>}/>
       <Route path='/add-policy' element={<AddPolicy/>}/>
    </Routes>
    </>
  );
}

export default App;
