import { firestoreAction } from 'vuexfire';
import {
  firebase,
  firebaseAuth,
  usersCollection,
  allPostsCollection,
  myPostsCollection,
  likesCollection,
  storage,
} from '@/firebase';
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
      return await context.bindFirestoreRef(
        'posts',
        allPostsCollection.orderBy('createdAt', 'desc')
      );
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
        imageLinkUrl: post.imageLinkUrl,
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

      // Create a post in allPosts
      var newPostRef = await allPostsCollection.doc();
      newPost.postId = newPostRef.id;
      newPostRef.set(newPost);

      // Create a post in myPosts
      var newMyPostRef = await myPostsCollection
        .doc(firebaseAuth.currentUser.uid)
        .collection('userPosts')
        .doc(newPost.postId);
      newMyPostRef.set(newPost);

      router.push('/feed');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  deletePost: async (context, post) => {
    try {
      // delete a post from allPosts
      await allPostsCollection.doc(post.id).delete();

      // delete a post from myPosts
      await myPostsCollection
        .doc(firebaseAuth.currentUser.uid)
        .collection('userPosts')
        .doc(post.id)
        .delete();

      // delete all posts from likes
      usersCollection.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          likesCollection
            .doc(doc.id)
            .collection('myLikes')
            .doc(post.id)
            .delete();
        });
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  editPost: async (context, post) => {
    try {
      // in case of image upload
      if (post.imageUrl) {
        var uploadTask = storage.ref('posts/' + post.postId).put(post.image);

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
              // console.log('File available at', downloadURL);
              // edit the post from allPosts
              var postRef = allPostsCollection.doc(post.postId);
              postRef.update({
                text: post.text,
                mediaUrl: post.mediaUrl,
                imageLinkUrl: post.imageLinkUrl,
                imageUrl: downloadURL,
              });

              // edit the post from myPosts
              var myPostRef = myPostsCollection
                .doc(post.ownerId)
                .collection('userPosts')
                .doc(post.postId);
              myPostRef.update({
                text: post.text,
                mediaUrl: post.mediaUrl,
                imageLinkUrl: post.imageLinkUrl,
                imageUrl: downloadURL,
              });

              // edit all posts from likes
              usersCollection.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  var likesRef = likesCollection
                    .doc(doc.id)
                    .collection('myLikes')
                    .doc(post.postId);
                  likesRef
                    .update({
                      text: post.text,
                      mediaUrl: post.mediaUrl,
                      imageLinkUrl: post.imageLinkUrl,
                      imageUrl: downloadURL,
                    })
                    .then(function() {})
                    .catch(function() {});
                });
              });
            });
          }
        );
      } else {
        // in case of media link or image link
        // edit the post from allPosts
        var postRef = await allPostsCollection.doc(post.postId);
        await postRef.update({
          text: post.text,
          mediaUrl: post.mediaUrl,
          imageLinkUrl: post.imageLinkUrl,
          imageUrl: post.imageUrl,
        });

        // edit the post from myPosts
        var myPostRef = await myPostsCollection
          .doc(post.ownerId)
          .collection('userPosts')
          .doc(post.postId);
        myPostRef.update({
          text: post.text,
          mediaUrl: post.mediaUrl,
          imageLinkUrl: post.imageLinkUrl,
          imageUrl: post.imageUrl,
        });

        // edit all posts from likes
        usersCollection.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var likesRef = likesCollection
              .doc(doc.id)
              .collection('myLikes')
              .doc(post.postId);
            likesRef
              .update({
                text: post.text,
                mediaUrl: post.mediaUrl,
                imageLinkUrl: post.imageLinkUrl,
                imageUrl: post.imageUrl,
              })
              .then(function() {})
              .catch(function() {
                // console.log('No document');
              });
            // Need to Check later ----------------------
            // likesCollection
            // .doc(doc.id)
            // .collection('myLikes')
            // .doc(post.postId)
            // .get()
            // .then(function(doc2) {
            //   if (doc2.exists) {
            //     console.log('doc');
            //     doc2.update({
            //       text: post.text,
            //       mediaUrl: post.mediaUrl,
            //       imageLinkUrl: post.imageLinkUrl,
            //       imageUrl: post.imageUrl,
            //     });
            //   } else {
            //     console.log('no doc');
            //   }
            // })
            // .catch(function(error) {
            //   console.log(error);
            // });
          });
        });
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  likePost: async (context, post) => {
    try {
      // add uid to likes and plus likeCount in allPosts
      var postRef = await allPostsCollection.doc(post.postId);
      await postRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(firebaseAuth.currentUser.uid),
        likeCount: firebase.firestore.FieldValue.increment(1),
      });

      // add uid to likes and plus likeCount in myPosts
      var myPostRef = myPostsCollection
        .doc(post.ownerId)
        .collection('userPosts')
        .doc(post.postId);
      myPostRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(firebaseAuth.currentUser.uid),
        likeCount: firebase.firestore.FieldValue.increment(1),
      });

      // add new post in likes
      postRef.get().then(function(doc) {
        if (doc.exists) {
          var postData = doc.data();

          var likesRef = likesCollection
            .doc(firebaseAuth.currentUser.uid)
            .collection('myLikes')
            .doc(post.postId);
          likesRef.set(postData);
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  unlikePost: async (context, post) => {
    try {
      // delete uid to likes and minus likeCount in all Posts
      var postRef = allPostsCollection.doc(post.postId);
      await postRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(firebaseAuth.currentUser.uid),
        likeCount: firebase.firestore.FieldValue.increment(-1),
      });

      // delete uid to likes and minus likeCount in myPosts
      var myPostRef = myPostsCollection
        .doc(post.ownerId)
        .collection('userPosts')
        .doc(post.postId);
      myPostRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(firebaseAuth.currentUser.uid),
        likeCount: firebase.firestore.FieldValue.increment(-1),
      });

      // delete the post in likes
      var likesRef = likesCollection
        .doc(firebaseAuth.currentUser.uid)
        .collection('myLikes')
        .doc(post.postId);
      likesRef.delete();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  uploadFile: async (context, file) => {
    try {
      context.state.storageURL = '';
      var uploadTask = storage.ref('posts/' + file.name).put(file);

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
      await storage.ref('posts/' + fileName).delete();
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
