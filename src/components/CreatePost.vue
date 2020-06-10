<template>
  <div id="createpost">
    <div class="card bg-light mt-4">
      <div class="card-body">
        <h3>Share Link</h3>
        <button class="btn btn-primary m-1" @click="showYoutubePost = true">YouTube Link</button>
        <br />
        <button class="btn btn-primary m-1" @click="showPhotoPost = true">Photo Link</button>
        <br />
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
                    <label for="mediaUrl" class="col-form-label">YouTube Link:</label>
                    <textarea
                      class="form-control"
                      id="mediaUrl"
                      placeholder="Paste link here..."
                      v-model="post.mediaUrl"
                      @keypress.enter="handleSubmit"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="showYoutubePost = false">Close</button>
                <button @click="handleSubmitYoutube" class="btn btn-primary">Post</button>
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
                    <label for="imageLinkUrl" class="col-form-label">Photo Link:</label>
                    <textarea
                      class="form-control"
                      id="imageLinkUrl"
                      placeholder="Paste link here..."
                      v-model="post.imageLinkUrl"
                      @keypress.enter="handleSubmit"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="showPhotoPost = false">Close</button>
                <button @click="handleSubmitPhoto" class="btn btn-primary">Post</button>
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
                <button class="close" @click="closeUploadPhotoPost()">
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
                    v-bind:src="post.imageUrl"
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
                </div>-->
                <div v-if="uploadEnd" class="text-right">
                  <button class="btn btn-primary m-1" @click="deleteImage()">Delete</button>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="closeUploadPhotoPost()">Close</button>
                <button @click="handleSubmitUploadPhoto" class="btn btn-primary">Post</button>
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
        mediaUrl: '',
        imageUrl: '',
        imageLinkUrl: '',
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
      if (this.post.text.length === 0 || this.post.mediaUrl.length === 0) {
        return alert('There is no content.');
      }
      var url = this.post.mediaUrl;
      if (url.match('youtu.be')) {
        url = url.replace('youtu.be', 'youtube.com/embed');
      } else if (url.match('watch')) {
        url = url.replace('watch?v=', 'embed/');
      }
      this.post.mediaUrl = url;
      this.createPost(this.post);
      this.post.text = '';
      this.post.mediaUrl = '';
      this.showYoutubePost = false;
    },
    handleSubmitPhoto: function() {
      if (this.post.text.length === 0 || this.post.imageUrl.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.text = '';
      this.post.imageLinkUrl = '';
      this.showPhotoPost = false;
    },
    handleSubmitUploadPhoto: function() {
      if (this.post.text.length === 0 || this.post.imageUrl.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.text = '';
      this.post.imageUrl = '';
      this.showUploadPhotoPost = false;
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
      this.post.imageUrl = '';
      // this.progressUpload = 0;
      this.$refs.uploadInputForm.reset();
    },
    closeUploadPhotoPost() {
      this.deleteImage();
      this.showUploadPhotoPost = false;
    },
  },
  watch: {
    getStorageURL: function() {
      this.post.imageUrl = this.getStorageURL;
      // this.progressUpload = 100;
    },
  },
};
</script>
