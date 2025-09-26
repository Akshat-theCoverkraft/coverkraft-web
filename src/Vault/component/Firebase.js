  // firebase.js
  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider } from "firebase/auth";

  const firebaseConfig = {
    //Dev Environment
  apiKey: "AIzaSyBfct4vLSD8_FsPqblZlvK4HtUZIp0Ix1I",
  authDomain: "coverkraft-dev-8e115.firebaseapp.com",
  projectId: "coverkraft-dev-8e115",
  storageBucket: "coverkraft-dev-8e115.firebasestorage.app",
  messagingSenderId: "716611850735",
  appId: "1:716611850735:web:74e6b57410be2e0ce3261a",
  measurementId: "G-5WETG0HT4H"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/gmail.readonly"); // for Gmail access
  provider.addScope("email"); // ✅ add this to access user's email
  provider.setCustomParameters({
    prompt: "select_account", // ✅ forces account selection each time
  });

  export { auth, provider };
