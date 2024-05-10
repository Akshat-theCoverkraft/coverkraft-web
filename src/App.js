import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import Login from "./LoginModule/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./LoginModule/Register";
import firebaseConfig from "./ServiceModule/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { ToastContainer } from 'react-toastify';
import Landing from "./Landing/Landing";
import Vault from "./Vault/Vault";
import AddPolicy from "./Vault/component/AddPolicy";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logout, setLogout] = useState(false)
  const navigate = useNavigate()
  const app = initializeApp(firebaseConfig);
  console.log('app',app);
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
