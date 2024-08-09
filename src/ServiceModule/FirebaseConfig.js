import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDZ0QvjCUx3oDtL6prUC1u4xwxyAjNqe0s",
  authDomain: "festivaloutfitter-54b95.firebaseapp.com",
  projectId: "festivaloutfitter-54b95",
  storageBucket: "festivaloutfitter-54b95.appspot.com",
  messagingSenderId: "172595882590",
  appId: "1:172595882590:web:0a5d53fcb47228d67f22cf",
  measurementId: "G-CCNXGC4XH2"
};

  firebase.initializeApp(firebaseConfig);


  
  export default firebase;