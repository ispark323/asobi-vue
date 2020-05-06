<template>
  <div class="create-post">
    <p>Share Link</p>
    <input type="text" placeholder="Title" v-model="post.title" />
    <br />
    <input
      type="text"
      placeholder="Paste link here..."
      v-model="post.content"
      @keypress.enter="handleSubmit"
    />
    <br />
    <button @click="handleSubmit" class="btn btn-primary">
      Post
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      post: {
        title: '',
        content: '',
      },
    };
  },
  methods: {
    ...mapActions(['createPost']),
    handleSubmit: function() {
      if (this.post.content.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.title = '';
      this.post.content = '';
    },
  },
};
</script>
