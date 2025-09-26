  // firebase.js
  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider } from "firebase/auth";

  const firebaseConfig = {
    //Dev Environment
apiKey: "AIzaSyDnwNulEZC1FCtxckUiQ_x637oD74Bp2QI",
  authDomain: "coverkraft-dev-2082b.firebaseapp.com",
  projectId: "coverkraft-dev-2082b",
  storageBucket: "coverkraft-dev-2082b.firebasestorage.app",
  messagingSenderId: "946812362760",
  appId: "1:946812362760:web:853df53b3de23be699f1bd",
  measurementId: "G-K71X2MTYQ5"
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
