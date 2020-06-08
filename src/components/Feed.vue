<template>
  <div id="feed">
    <div v-for="(n, index) in pageOffset" :key="index" class="mt-1">
      <div v-if="getPosts[index] != null">
        <div class="card border-0">
          <!-- Header -->
          <div class="m-2 d-flex justify-content-between">
            <span v-if="getPosts[index].avatar">
              <b-avatar v-bind:src="getPosts[index].avatar" size="2.3em" variant="primary"></b-avatar>
            </span>
            <span v-else>
              <b-avatar src="user-placeholder.jpg" size="2.3em" variant="light"></b-avatar>
            </span>
            <div class="m-1">{{ getPosts[index].username }}</div>
            <div class="ml-auto m-1">
              <b-icon icon="three-dots"></b-icon>
            </div>
          </div>
          <!-- Post Text -->
          <div class="ml-2">
            <h5>{{ getPosts[index].text }}</h5>
          </div>
          <!-- Youtube Link Post -->
          <div v-if="getPosts[index].mediaUrl != ''">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe
                id="ytplayer"
                class="embed-responsive-item rounded-lg"
                type="text/html"
                v-bind:src="getPosts[index].mediaUrl"
                frameborder="0"
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <!-- Photo Post -->
          <div
            v-else-if="getPosts[index].imageUrl != ''"
            class="text-center border rounded-lg lazyimage"
          >
            <img v-bind:src="getPosts[index].imageUrl" class="img-fluid" loading="lazy" />
          </div>

          <!-- Footer -->
          <div class="card-text">
            <!-- <small class="text-muted"> -->
            <!-- if already like, allowed only unlike -->
            <div v-if="isMyLike(index)">
              <div class="m-2">
                <b-icon icon="heart-fill" v-on:click="deleteLike(index)" variant="danger"></b-icon>
                <!-- {{ getPosts[index].likeCount }} Likes, {{ timeFromCreated(index) }} -->
                <b-icon
                  icon="pencil-square"
                  v-if="getPosts[index].ownerId == userData.userInfo.uid"
                  v-on:click="showEditMyPost(index)"
                ></b-icon>
              </div>
            </div>
            <!-- if not yet, allowed like -->
            <div v-else>
              <div class="m-2">
                <b-icon icon="heart" v-on:click="addLike(index)" variant="danger"></b-icon>
                <!-- {{ getPosts[index].likeCount }} Likes, {{ timeFromCreated(index) }} -->
                <b-icon
                  icon="pencil-square"
                  v-if="getPosts[index].ownerId == userData.userInfo.uid"
                  v-on:click="showEditMyPost(index)"
                ></b-icon>
              </div>
            </div>
            <!-- </small> -->
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div ref="infiniteScrollTrigger" id="scroll-trigger"></div>
      <div v-if="showloader != false" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </footer>

    <!-- Edit my post -->
    <b-modal id="editMyPost" title="Edit" @ok="handleEditMyPost">
      <b-form-group label="Text:" label-for="text1" invalid-feedback="Text is required">
        <b-form-textarea
          id="text1"
          v-model="editedPost.text"
          :state="textState"
          placeholder="Enter at least 1 letters"
          rows="3"
          max-rows="10"
          required
        ></b-form-textarea>
      </b-form-group>
      <div v-if="postType == 'media'">
        <b-form-group label="Link:" label-for="mediaUrl" invalid-feedback="URL is required">
          <b-form-textarea
            id="mediaUrl"
            v-model="editedPost.mediaUrl"
            :state="mediaUrlState"
            placeholder="Enter at least 1 letters"
            rows="2"
            max-rows="3"
            required
          ></b-form-textarea>
        </b-form-group>
      </div>
      <div v-else-if="postType == 'image'">
        <b-form-file
          v-model="editedPost.image"
          accept="image/*"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
        >
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="primary">{{ names[0] }}</b-badge>
          </template>
        </b-form-file>
      </div>
      <!-- Footer -->
      <template v-slot:modal-footer="{ cancel }">
        <b-button size="sm" variant="primary" @click="handleEditMyPost">Edit</b-button>
        <b-button size="sm" variant="primary" @click="cancel()">Cancel</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script src="https://www.youtube.com/iframe_api"></script>
<script>
// This code loads the IFrame Player API code asynchronously.
//var tag = document.createElement('script');
//tag.src = 'https://www.youtube.com/iframe_api';
//var firstScriptTag = document.getElementsByTagName('script')[0];
//firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    //height: '390',
    //width: '640',
    //videoId: '7hCUu0rtkKA',
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}
// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}
// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}
</script>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Feed',
  data() {
    return {
      editedPost: {
        ownerId: '',
        postId: '',
        text: '',
        mediaUrl: '',
        imageUrl: '',
        image: null,
      },
      currentPage: 1,
      maxPerPage: 2,
      showloader: true,
      textState: null,
      mediaUrlState: null,
      imageUrlState: null,
      postType: '',
      postIndex: '',
    };
  },
  computed: {
    ...mapGetters(['userData', 'getPosts']),
    pageOffset() {
      return this.maxPerPage * this.currentPage;
    },
  },
  methods: {
    ...mapActions(['bindPostsRef', 'likePost', 'unlikePost', 'editPost']),
    scrollTrigger() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            this.showloader = true;
            setTimeout(() => {
              this.currentPage += 1;
              this.showloader = false;
            }, 2000);
          }
        });
      });
      observer.observe(this.$refs.infiniteScrollTrigger);
    },
    isMyLike(index) {
      var likes = this.getPosts[index].likes;
      if (likes != null) {
        return this.getPosts[index].likes.includes(this.userData.userInfo.uid);
      }
      return null;
    },
    addLike(index) {
      this.likePost(this.getPosts[index]);
    },
    deleteLike(index) {
      this.unlikePost(this.getPosts[index]);
    },
    timeFromCreated(index) {
      var today = new Date();
      var msPerDay = 24 * 60 * 60 * 1000;
      var days = (today.getTime() - this.getPosts[index].createdAt.toDate().getTime()) / msPerDay;

      if (days < 1) {
        return Math.round(days * 24) + 'h';
      } else {
        return Math.round(days) + 'd';
      }
    },
    showEditMyPost(index) {
      this.postIndex = index;
      this.editedPost.ownerId = this.getPosts[index].ownerId;
      this.editedPost.postId = this.getPosts[index].postId;
      this.editedPost.text = this.getPosts[index].text;
      this.editedPost.mediaUrl = this.getPosts[index].mediaUrl;
      this.editedPost.imageUrl = this.getPosts[index].imageUrl;
      this.textState = null;
      this.mediaUrlState = null;
      this.imageUrlState = null;
      if (this.editedPost.mediaUrl) {
        this.postType = 'media';
      } else if (this.editedPost.imageUrl) {
        this.postType = 'image';
      }
      this.$bvModal.show('editMyPost');
    },
    handleEditMyPost(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      if (this.editedPost.text.length < 1) {
        this.textState = false;
        return;
      } else if (this.postType == 'media' && this.editedPost.mediaUrl.length < 1) {
        this.mediaUrlState = false;
        return;
      } else if (this.postType == 'image' && this.editedPost.imageUrl.length < 1) {
        this.imageUrlState = false;
        return;
      }

      this.editPost(this.editedPost);

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('editMyPost');
      });
    },
  },
  mounted() {
    this.scrollTrigger();
  },
  created() {
    this.bindPostsRef();
  },
};
</script>
