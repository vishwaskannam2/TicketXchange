// Import the functions you need from the SDKs you need
import { initializeApp } from "c:/Users/sadan/node_modules/firebase/app";
import { getAnalytics } from "c:/Users/sadan/node_modules/firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ-QDiwFi3nrKkoSj-ghf1aAb9Lo56aoA",
  authDomain: "ticketxchange-fd694.firebaseapp.com",
  projectId: "ticketxchange-fd694",
  storageBucket: "ticketxchange-fd694.appspot.com",
  messagingSenderId: "857541548379",
  appId: "1:857541548379:web:1461473ce33e6e04c8e27e",
  measurementId: "G-XC4MFTV1GH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);