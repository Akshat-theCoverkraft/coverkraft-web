import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCx901Va2ohHAC71K_SbNqrKxQ3TCpKCDc",
  authDomain: "coverkraft-f26e1.firebaseapp.com",
  projectId: "coverkraft-f26e1",
  storageBucket: "coverkraft-f26e1.appspot.com",
  messagingSenderId: "317342762",
  appId: "1:317342762:web:eccecf45cf81536e67ef53",
  measurementId: "G-V2WBZB474V"
};

  firebase.initializeApp(firebaseConfig);


  
  export default firebase;