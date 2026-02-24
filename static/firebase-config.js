
const firebaseConfig = {
  apiKey: "AIzaSyDCBH9q0SFbSYBQL1SlLSelDomb3wt4-2A",
  authDomain: "webcrafter-91b4f.firebaseapp.com",
  projectId: "webcrafter-91b4f",
  storageBucket: "webcrafter-91b4f.firebasestorage.app",
  messagingSenderId: "157107706102",
  appId: "1:157107706102:web:ddd3086b6a84434d8034d7",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch(error => console.error('Error de persistencia:', error));