import { firestoreAction } from 'vuexfire';
import { firebase, firebaseAuth, postsCollection, storage } from '@/firebase';
import router from '@/router/router';

const state = {
  posts: [],
  storageURL: '',
};

const getters = {
  getPosts: state => state.posts,
  getStorageURL: state => state.storageURL,
};

const mutations = {
  // setPosts: (state, posts) => {
  //   state.posts = posts;
  // },
  setStorageURL: (state, downloadURL) => {
    state.storageURL = downloadURL;
  },
};

const actions = {
  bindPostsRef: firestoreAction(async context => {
    try {
      return await context.bindFirestoreRef('posts', postsCollection.orderBy('createdAt', 'desc'));
    } catch (error) {
      alert(error);
    }
  }),
  createPost: async (context, post) => {
    try {
      const newPost = {
        text: post.text,
        imageUrl: post.imageUrl,
        mediaUrl: post.mediaUrl,
        ownerId: firebaseAuth.currentUser.uid,
        postId: '',
        username: firebaseAuth.currentUser.displayName,
        likeCount: 0,
        likes: [],
        createdAt: new Date(),
        //comments: 0,
        //updatedAt: new Date(),
      };
      // console.log('=== here ===');
      // console.log(context.rootState.auth.userData.userInfo);
      var newPostRef = await postsCollection.doc();
      newPost.postId = newPostRef.id;
      newPostRef.set(newPost);
      router.push('/feed');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  deletePost: async (context, post) => {
    try {
      await postsCollection.doc(post.id).delete();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  likePost: async (context, postId) => {
    try {
      var postRef = postsCollection.doc(postId);
      // add uid to likes and plus likeCount
      await postRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(firebaseAuth.currentUser.uid),
        likeCount: firebase.firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  unlikePost: async (context, postId) => {
    try {
      var postRef = postsCollection.doc(postId);
      // delete uid to likes and minus likeCount
      await postRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(firebaseAuth.currentUser.uid),
        likeCount: firebase.firestore.FieldValue.increment(-1),
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  uploadFile: async (context, file) => {
    try {
      context.state.storageURL = '';
      var uploadTask = storage.ref('images/' + file.name).put(file);

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
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            context.state.storageURL = downloadURL;
            //context.commit('setStorageURL', downloadURL);
            //console.log('File available at', downloadURL);
          });
        }
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  deleteFile: async (context, fileName) => {
    try {
      await storage.ref('images/' + fileName).delete();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
