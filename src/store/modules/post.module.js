const state = {
  posts: [],
};

const getters = {
  getPosts: state => state.posts,
};

const mutations = {
  // images: coming from api
  setPosts: (state, posts) => {
    state.posts = posts;
  },
};

const actions = {
  fetchPosts() {},
  fetchPost()
};
