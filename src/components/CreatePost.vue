<template>
  <div>
    <h3 class="text-center">Unknown girls' playground</h3>
    <br />
    <form @submit.prevent>
      <div class="card bg-light">
        <div class="card-body">
          <div class="create-post">
            <h2>Share Link</h2>
            <label for="text1">Text</label>
            <input type="text" placeholder="Text" v-model="post.text" id="text1" class="m-1" />
            <br />
            <label for="link">Link</label>
            <input
              type="text"
              placeholder="Paste link here..."
              v-model="post.mediaURL"
              @keypress.enter="handleSubmit"
              id="link"
              class="m-1"
            />
            <button @click="handleSubmit" class="btn btn-primary">Post</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      post: {
        text: '',
        mediaURL: '',
      },
    };
  },
  methods: {
    ...mapActions(['createPost']),
    handleSubmit: function() {
      if (this.post.text.length === 0 || this.post.mediaURL.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.text = '';
      this.post.mediaURL = '';
    },
  },
};
</script>
