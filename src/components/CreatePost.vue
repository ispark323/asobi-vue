<template>
  <div id="createPost">
    <h3 class="text-center">Unknown girls' playground</h3>
    <br />
    <div class="card bg-light m-1">
      <div class="card-body">
        <h2>Share Link</h2>
        <button class="btn btn-primary m-1" @click="showYoutubePost = true">
          YouTube Link
        </button>
        <button class="btn btn-primary m-1" @click="showPhotoPost = true">
          Photo Link
        </button>
        <button class="btn btn-primary m-1" @click="showUploadPhotoPost = true">
          Upload Photo
        </button>
      </div>
    </div>

    <transition name="modal">
      <!-- YouTube Link -->
      <div v-if="showYoutubePost" @close="showYoutubePost = false">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header">
                <h5 class="modal-title" id="youtubePostLabel">Share YouTube Link</h5>
                <button class="close" @click="showYoutubePost = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label for="text" class="col-form-label">Content:</label>
                    <textarea class="form-control" id="text" v-model="post.text"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="mediaURL" class="col-form-label">YouTube Link:</label>
                    <textarea
                      class="form-control"
                      id="mediaURL"
                      placeholder="Paste link here..."
                      v-model="post.mediaURL"
                      @keypress.enter="handleSubmit"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="showYoutubePost = false">
                  Close
                </button>
                <button @click="handleSubmitYoutube" class="btn btn-primary">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Photo Link -->
      <div v-if="showPhotoPost" @close="showPhotoPost = false">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header">
                <h5 class="modal-title" id="photoPostLabel">Share Photo Link</h5>
                <button class="close" @click="showPhotoPost = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label for="text" class="col-form-label">Content:</label>
                    <textarea class="form-control" id="text" v-model="post.text"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="photoURL" class="col-form-label">Photo Link:</label>
                    <textarea
                      class="form-control"
                      id="photoURL"
                      placeholder="Paste link here..."
                      v-model="post.photoURL"
                      @keypress.enter="handleSubmit"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="showPhotoPost = false">
                  Close
                </button>
                <button @click="handleSubmitPhoto" class="btn btn-primary">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Photo -->
      <div v-if="showUploadPhotoPost" @close="showUploadPhotoPost = false">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header">
                <h5 class="modal-title" id="uploadPhotoPostLabel">Upload Photo</h5>
                <button class="close" @click="showUploadPhotoPost = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form ref="uploadInputForm">
                  <div class="form-group">
                    <label for="text2" class="col-form-label">Content:</label>
                    <textarea class="form-control" id="text2" v-model="post.text"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="uploadPhoto" class="col-form-label">Upload Photo:</label>
                    <input
                      id="uploadPhotoInput"
                      type="file"
                      accept="image/*"
                      :multiple="false"
                      @change="uploadImage"
                      class="form-control"
                    />
                  </div>
                </form>

                <div v-if="uploadEnd" class="text-center">
                  <img
                    v-if="uploadEnd"
                    v-bind:src="post.photoURL"
                    class="img-thumbnail"
                    style="max-width:200px"
                  />
                </div>
                <!-- Progress Bar -->
                <!-- <div v-if="uploading && !uploadEnd" class="progress"> -->
                <!-- <div class="progress m-1 text-center">
                  <div class="progress-bar bg-secondary" role="progressbar" v-bind:style="{ width: progressUpload + '%' }" >
                    {{ progressUpload }}%
                  </div>
                </div> -->
                <div v-if="uploadEnd" class="text-right">
                  <button class="btn btn-primary btn-sm m-1" @click="deleteImage()">Delete</button>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="showUploadPhotoPost = false">
                  Close
                </button>
                <button @click="handleSubmitUploadPhoto" class="btn btn-primary">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      post: {
        text: '',
        mediaURL: '',
        photoURL: '',
      },
      showYoutubePost: false,
      showPhotoPost: false,
      showUploadPhotoPost: false,
      // progressUpload: 0,
      fileName: '',
      uploading: false,
      uploadEnd: false,
    };
  },
  computed: {
    ...mapGetters(['getStorageURL']),
  },
  methods: {
    ...mapActions(['createPost', 'uploadFile', 'deleteFile']),
    handleSubmitYoutube: function() {
      if (this.post.text.length === 0 || this.post.mediaURL.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.text = '';
      this.post.mediaURL = '';
    },
    handleSubmitPhoto: function() {
      if (this.post.text.length === 0 || this.post.photoURL.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.text = '';
      this.post.photoURL = '';
    },
    handleSubmitUploadPhoto: function() {
      if (this.post.text.length === 0 || this.post.photoURL.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.text = '';
      this.post.photoURL = '';
    },
    uploadImage() {
      let file = document.getElementById('uploadPhotoInput').files[0];
      this.fileName = file.name;
      this.uploadFile(file);
      this.uploading = true;
      this.uploadEnd = true;
    },
    deleteImage() {
      this.deleteFile(this.fileName);
      this.uploading = false;
      this.uploadEnd = false;
      this.photoURL = '';
      // this.progressUpload = 0;
      this.$refs.uploadInputForm.reset();
    },
  },
  watch: {
    getStorageURL: function() {
      this.post.photoURL = this.getStorageURL;
      // this.progressUpload = 100;
    },
  },
};
</script>
