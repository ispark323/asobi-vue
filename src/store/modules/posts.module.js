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
  myPosts: [],
};

const getters = {
  getPosts: state => state.posts,
  getMyPosts: state => state.myPosts,
};

const mutations = {
  // setPosts: (state, posts) => {
  //   state.posts = posts;
  // },
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
  bindMyPostsRef: firestoreAction(async context => {
    try {
      return await context.bindFirestoreRef(
        'myPosts',
        myPostsCollection
          .doc(firebaseAuth.currentUser.uid)
          .collection('userPosts')
          .orderBy('createdAt', 'desc')
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
  createPost2: async (context, post) => {
    try {
      const newPost = {
        postId: '',
        text: post.text,
        imageUrl: '',
        mediaUrl: post.mediaUrl,
        ownerId: post.ownerId,
        username: post.username,
        avatar: '',
        likeCount: 0,
        likes: [],
        createdAt: new Date(),
        //comments: 0,
        //updatedAt: new Date(),
      };

      if (post.avatar) {
        newPost.avatar = post.avatar;
      }

      // in case of image upload
      if (post.image != null) {
        console.log('=== photo ===');

        const reader = new FileReader();
        reader.readAsDataURL(post.image);
        reader.onload = function(e) {
          let image = new Image();
          image.src = e.target.result;
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            const max_width = 680;
            // const max_height = 680;

            // if image is bigger than width 680, resize the image
            // if (width > max_width || height > max_height) {

            // calculate the width and height, constraining the proportions
            // if (width > height) {
            if (width > max_width) {
              height = Math.round((height *= max_width / width));
              width = max_width;
            }
            // } else {
            //   if (height > max_height) {
            //     width = Math.round((width *= max_height / height));
            //     height = max_height;
            //   }
            // }

            let canvas = document.createElement('canvas');

            // resize the canvas and draw the image data into it
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            ctx.canvas.toBlob(
              function(blob) {
                const file = new File([blob], 'filenamewillbepostid', {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }); //output image as a file, No support on IE
                //console.log('file ======', file);

                const uploadTask = storage.ref('posts/' + newPost.postId).put(file);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(
                  'state_changed',
                  function(snapshot) {
                    switch (snapshot.state) {
                      case 'paused': //storage.TaskState.PAUSED: // or 'paused'
                        break;
                      case 'running': //storage.TaskState.RUNNING: // or 'running'
                        break;
                    }
                  },
                  function(error) {
                    switch (error.code) {
                      case 'storage/unauthorized':
                        break;
                      case 'storage/canceled':
                        break;
                      case 'storage/unknown':
                        break;
                    }
                  },
                  function() {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                      // Create a post in allPosts
                      const newPostRef = allPostsCollection.doc();
                      newPost.postId = newPostRef.id;
                      newPost.imageUrl = downloadURL;
                      newPostRef.set(newPost);

                      // Create a post in myPosts
                      var newMyPostRef = myPostsCollection
                        .doc(firebaseAuth.currentUser.uid)
                        .collection('userPosts')
                        .doc(newPost.postId);
                      newMyPostRef.set(newPost);
                    });
                  }
                );
              },
              'image/jpeg',
              0.9
            );
          };
        };
      } else {
        console.log('=== youtube ===');
        // Create a post in allPosts
        var newPostRef2 = await allPostsCollection.doc();
        newPost.postId = newPostRef2.id;
        newPostRef2.set(newPost);

        // Create a post in myPosts
        var newMyPostRef = await myPostsCollection
          .doc(firebaseAuth.currentUser.uid)
          .collection('userPosts')
          .doc(newPost.postId);
        newMyPostRef.set(newPost);
      }
      // move the page top after posting
      scroll(0, 0);
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

      // delete image from storage
      var imageRef = storage.ref('posts/' + post.id);
      imageRef.delete();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  },
  editPost: async (context, post) => {
    try {
      // in case image is changed
      if (post.image != null) {
        var uploadTask = storage.ref('posts/' + post.postId).put(post.image);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          'state_changed',
          function(snapshot) {
            switch (snapshot.state) {
              case 'paused': //storage.TaskState.PAUSED: // or 'paused'
                break;
              case 'running': //storage.TaskState.RUNNING: // or 'running'
                break;
            }
          },
          function(error) {
            switch (error.code) {
              case 'storage/unauthorized':
                break;
              case 'storage/canceled':
                break;
              case 'storage/unknown':
                break;
            }
          },
          function() {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              // edit the post from allPosts
              const postRef = allPostsCollection.doc(post.postId);
              postRef.update({
                text: post.text,
                imageUrl: downloadURL,
              });

              // edit the post from myPosts
              const myPostRef = myPostsCollection
                .doc(post.ownerId)
                .collection('userPosts')
                .doc(post.postId);
              myPostRef.update({
                text: post.text,
                imageUrl: downloadURL,
              });

              // edit all posts from likes
              usersCollection.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  const likesRef = likesCollection
                    .doc(doc.id)
                    .collection('myLikes')
                    .doc(post.postId);
                  likesRef
                    .update({
                      text: post.text,
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
        // in case image is not changed
        // edit the post from allPosts
        var postRef = await allPostsCollection.doc(post.postId);
        await postRef.update({
          text: post.text,
          mediaUrl: post.mediaUrl,
        });

        // edit the post from myPosts
        var myPostRef = await myPostsCollection
          .doc(post.ownerId)
          .collection('userPosts')
          .doc(post.postId);
        myPostRef.update({
          text: post.text,
          mediaUrl: post.mediaUrl,
        });

        // edit all posts from likes
        usersCollection.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            likesCollection
              .doc(doc.id)
              .collection('myLikes')
              .where('postId', '==', post.postId)
              .get()
              .then(function(querySnapshot2) {
                querySnapshot2.forEach(function() {
                  likesCollection
                    .doc(doc.id)
                    .collection('myLikes')
                    .doc(post.postId)
                    .update({
                      text: post.text,
                      mediaUrl: post.mediaUrl,
                    });
                });
              });
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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
