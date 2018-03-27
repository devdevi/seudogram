import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBkQ2mKU0wB0rPAPDSnK3ULqCAEfu6H4Sw",
    authDomain: "vegan-place.firebaseapp.com",
    databaseURL: "https://vegan-place.firebaseio.com",
    projectId: "vegan-place",
    storageBucket: "vegan-place.appspot.com",
    messagingSenderId: "456107137524"
  }
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
