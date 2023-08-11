// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyATR41bnuoRIAwE4-lFdm3lSp2NwlZAGNw",
    authDomain: "xuong-thuc-hanh-lv2.firebaseapp.com",
    projectId: "xuong-thuc-hanh-lv2",
    storageBucket: "xuong-thuc-hanh-lv2.appspot.com",
    messagingSenderId: "613047817083",
    appId: "1:613047817083:web:9513d53c5da328ddba63de",
    measurementId: "G-D0NTNRDHYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);