import {
  firebaseAuth,
  usersCollection,
  allPostsCollection,
  myPostsCollection,
  //likesCollection,
  storage,
} from '@/firebase';
import router from '@/router/router';

const state = {
  userData: {
    isLoggedIn: false,
    userInfo: null,
    loading: false,
    error: null,
  },
};

const getters = {
  userData: state => state.userData,
  // isAuthenticated(state) {
  //   return state.userData !== null && state.userData != undefined;
  // },
};

const mutations = {
  setCurrentUser: (state, userInfo) => {
    if (userInfo) {
      state.userData = { ...state.userData, loading: true, isLoggedIn: true, userInfo };
    }
  },
  PENDING: state => {
    state.userData = { ...state.userData, loading: true };
  },
  LOGOUT: state => {
    state.userData = { ...state.userData, loading: true, isLoggedIn: false, userInfo: null };
  },
  FAIL: (state, errorMessage) => {
    state.userData = {
      ...state.userData,
      loading: true,
      isLoggedIn: false,
      userInfo: null,
      error: errorMessage,
    };
  },
};

const actions = {
  login: async ({ commit }, loginData) => {
    commit('PENDING');
    try {
      const res = await firebaseAuth.signInWithEmailAndPassword(
        loginData.email,
        loginData.password
      );

      let profileImageUrl;
      await usersCollection
        .doc(res.user.uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            profileImageUrl = doc.data().avatar;
          } else {
            console.log('No such document');
          }
        });

      const userInfo = {
        username: res.user.displayName,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
        avatar: profileImageUrl,
        uid: res.user.uid,
      };
      commit('setCurrentUser', userInfo);
      router.push('/feed');
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
  logout: async ({ commit }) => {
    commit('PENDING');
    try {
      await firebaseAuth.signOut();
      commit('LOGOUT');
      router.push('/login');
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
  signup: async ({ commit }, signupData) => {
    commit('PENDING');
    try {
      const res = await firebaseAuth.createUserWithEmailAndPassword(
        signupData.email,
        signupData.password
      );
      // let user = fb.firebaseAuth().currentUser;
      await res.user.updateProfile({
        displayName: signupData.username,
      });

      await usersCollection.doc(res.user.uid).set({
        uid: res.user.uid,
        username: signupData.username,
        email: signupData.email,
      });

      const userInfo = {
        username: res.user.displayName,
        email: res.user.email,
        emailVerified: res.user.emailVerified,
      };

      commit('setCurrentUser', userInfo);
      router.push('/feed');
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
  fetchUserProfile: async ({ commit }) => {
    usersCollection
      .doc(state.userData.userInfo.uid)
      .get()
      .then(doc => {
        commit('setCurrentUser', doc.data());
      })
      .catch(err => {
        console.log(err);
      });
  },
  updateProfile: async ({ commit }, profile) => {
    try {
      const newUserInfo = this.userData.userInfo;
      console.log('===', newUserInfo);

      if (profile.username) {
        newUserInfo.username = profile.username;
      }
      if (profile.avatar) {
        let uploadTask = storage.ref('avatar/' + firebaseAuth.currentUser.uid).put(profile.avatar);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          //storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          'state_changed',
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused': //storage.TaskState.PAUSED: // or 'paused'
                // console.log('Upload is paused');
                break;
              case 'running': //storage.TaskState.RUNNING: // or 'running'
                // console.log('Upload is running');
                break;
            }
          },
          function(error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log(error);
                break;
              case 'storage/canceled':
                // User canceled the upload
                console.log(error);
                break;
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log(error);
                break;
            }
          },
          function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              newUserInfo.avatar = downloadURL;
              // usersCollection.doc(firebaseAuth.currentUser.uid).update({
              //   avatar: downloadURL,
              // });
            });
          }
        );
      }

      // Change username in firebaseAuth (displayName) and usersCollection (username)
      await firebaseAuth.currentUser.updateProfile({
        displayName: newUserInfo.username,
      });

      await usersCollection.doc(firebaseAuth.currentUser.uid).update({
        username: newUserInfo.username,
        avatar: newUserInfo.avatar,
      });

      await allPostsCollection
        .where('ownerId', '==', newUserInfo.uid)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.data().username = newUserInfo.username;
            doc.data().avatar = newUserInfo.avatar;
          });
        });

      // edit the post from myPosts
      await myPostsCollection
        .doc(newUserInfo.uid)
        .dollection('userPosts')
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.data().username = newUserInfo.username;
            doc.data().avatar = newUserInfo.avatar;
          });
        });

      // const userInfo = {
      //   username: data.username,
      //   email: data.email,
      // };

      commit('setCurrentUser', newUserInfo);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  },
  uploadAvatar: async (context, avatar) => {
    try {
      let uploadTask = storage.ref('avatar/' + firebaseAuth.currentUser.uid).put(avatar);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        //storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        'state_changed',
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused': //storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case 'running': //storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        },
        function(error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.log(error);
              break;
            case 'storage/canceled':
              // User canceled the upload
              console.log(error);
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              console.log(error);
              break;
          }
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('heheheh');
            usersCollection.doc(firebaseAuth.currentUser.uid).update({
              avatar: downloadURL,
            });
          });
        }
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  resetPassword: async ({ commit }, email) => {
    commit('PENDING');
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      commit('LOGOUT');
      //router.push('login');
    } catch (error) {
      console.log(error);
      alert(error.message);
      commit('FAIL', error.message);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
