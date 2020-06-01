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
const allPostsCollection = db.collection('allPosts');
const myPostsCollection = db.collection('myPosts');
const timelineCollection = db.collection('timeline');
const commentsCollection = db.collection('comments');
const likesCollection = db.collection('likes');

// firebase storage
const storage = firebase.storage();

export {
  firebase,
  db,
  firebaseAuth,
  currentUser,
  usersCollection,
  allPostsCollection,
  myPostsCollection,
  timelineCollection,
  commentsCollection,
  likesCollection,
  storage,
};
