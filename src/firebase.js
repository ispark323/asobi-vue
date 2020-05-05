import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_apiKey,
  authDomain: process.env.VUE_APP_authDomain,
  databaseURL: process.env.VUE_APP_databaseURL,
  projectId: process.env.VUE_APP_projectId,
  storageBucket: process.env.VUE_APP_storageBucket,
  messagingSenderId: process.env.VUE_APP_messagingSenderId,
  appId: process.env.VUE_APP_appId,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const firebaseAuth = firebase.auth();
const currentUser = firebaseAuth.currentUser;

// firebase collections
const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');
const likesCollection = db.collection('likes');

export {
  db,
  firebaseAuth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
};
