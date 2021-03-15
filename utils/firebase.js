import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCtChvut9iVMrOKWHKQJqGpC1zJcatr22w",
    authDomain: "foodanddrinks-581b2.firebaseapp.com",
    projectId: "foodanddrinks-581b2",
    storageBucket: "foodanddrinks-581b2.appspot.com",
    messagingSenderId: "617202629765",
    appId: "1:617202629765:web:2664a6ffa093f76d49fdec"
  }

  export const firebaseApp = firebase.initializeApp(firebaseConfig)