import { firestoreAction } from 'vuexfire';
import { firebaseAuth, postsCollection } from '@/firebase';
// import { usersCollection } from '../../firebase';
import router from '@/router/router';

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
  bindPostsRef: firestoreAction(async context => {
    try {
      return await context.bindFirestoreRef(
        'posts',
        postsCollection.orderBy('createdAt', 'desc').limit(5)
      );
    } catch (error) {
      alert(error);
    }
  }),
  createPost: async (context, post) => {
    try {
      const newPost = {
        text: post.text,
        mediaURL: post.mediaURL,
        uid: firebaseAuth.currentUser.uid,
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
      router.push('/mypage');
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
