import { firestoreAction } from 'vuexfire';
import { firebaseAuth, postsCollection } from '@/firebase';
// import { usersCollection } from '../../firebase';

const state = {
  posts: [],
};

const getters = {
  getPosts: state => state.posts,
};

const mutations = {
  // setPosts: (state, posts) => {
  //   state.posts = posts;
  // },
};

const actions = {
  bindPosts: firestoreAction(async context => {
    try {
      return await context.bindFirestoreRef('posts', postsCollection.orderBy('createdAt', 'desc'));
    } catch (error) {
      alert(error);
    }
  }),
  createPost: async (context, post) => {
    try {
      const newPost = {
        title: post.title,
        link: post.link,
        uid: firebaseAuth.currentUser.uid,
        //content: post.content,
        // userId: context.rootState.auth.userData.userInfo.uid,
        // username: context.rootState.auth.userData.userInfo,
        comments: 0,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // console.log('=== here ===');
      // console.log(context.rootState.auth.userData.userInfo);
      await postsCollection.add(newPost);
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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
