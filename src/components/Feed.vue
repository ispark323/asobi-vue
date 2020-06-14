<template>
  <div id="feed">
    <div v-for="(n, index) in pageOffset" :key="index" class="mt-1">
      <div v-if="getPosts[index] != null">
        <div class="card border-0">
          <!-- Header -->
          <div class="m-1 d-flex justify-content-between">
            <span v-if="getPosts[index].avatar">
              <b-avatar v-bind:src="getPosts[index].avatar" size="2.3em" variant="light"></b-avatar>
            </span>
            <span v-else>
              <b-avatar src="user-placeholder.jpg" size="2.3em" variant="light"></b-avatar>
            </span>
            <div class="m-1">{{ getPosts[index].username }}</div>
            <div class="ml-auto">
              <b-nav>
                <b-nav-item-dropdown right no-caret menu-class="minw-none">
                  <template slot="button-content">
                    <b-icon icon="three-dots" font-scale="1.2" variant="dark"></b-icon>
                  </template>
                  <b-dropdown-item
                    v-if="getPosts[index].ownerId == userData.userInfo.uid"
                    v-on:click="showEditMyPost(index)"
                  >Edit</b-dropdown-item>
                  <b-dropdown-item
                    v-if="getPosts[index].ownerId == userData.userInfo.uid"
                    v-on:click="handleDelete(index)"
                  >Delete</b-dropdown-item>

                  <b-dropdown-item v-else disabled>Edit</b-dropdown-item>
                </b-nav-item-dropdown>
              </b-nav>
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
          <div class="card-text text-right">
            <!-- <small class="text-muted"> -->
            <!-- if already like, allowed only unlike -->
            <div v-if="isMyLike(index)">
              <div class="m-2">
                <b-icon
                  icon="heart-fill"
                  v-on:click="deleteLike(index)"
                  variant="danger"
                  font-scale="1.2"
                ></b-icon>
                <!-- {{ getPosts[index].likeCount }} Likes, {{ timeFromCreated(index) }} -->
              </div>
            </div>
            <!-- if not yet, allowed like -->
            <div v-else>
              <div class="m-2">
                <b-icon icon="heart" v-on:click="addLike(index)" variant="danger" font-scale="1.2"></b-icon>
                <!-- {{ getPosts[index].likeCount }} Likes, {{ timeFromCreated(index) }} -->
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
    <b-modal id="editMyPost" title="Edit Post" @ok="handleEditMyPost">
      <div v-if="postType == 'image'">
        <b-form-group label="Text:" label-for="text1" invalid-feedback="Please enter text">
          <b-form-textarea
            id="text1"
            v-model="editedPost.text"
            :state="textState"
            placeholder="Share your story"
            rows="3"
            max-rows="10"
            required
          ></b-form-textarea>
        </b-form-group>
        <b-form-file
          v-model="editedPost.image"
          accept="image/*"
          placeholder="Choose photo or drop it here..."
          drop-placeholder="Drop file here..."
        >
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="primary">{{ names[0] }}</b-badge>
          </template>
        </b-form-file>
      </div>
      <div v-else-if="postType == 'media'">
        <b-form-group label="Link:" label-for="mediaUrl" invalid-feedback="Please put YouTube link">
          <b-form-textarea
            id="mediaUrl"
            v-model="editedPost.mediaUrl"
            :state="mediaUrlState"
            placeholder="https://"
            rows="1"
            max-rows="3"
            required
          ></b-form-textarea>
        </b-form-group>
      </div>

      <!-- Footer -->
      <template v-slot:modal-footer="{ cancel }">
        <b-button variant="dark" @click="cancel()">Cancel</b-button>
        <b-button variant="primary m-1" @click="handleEditMyPost">Edit</b-button>
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
    ...mapActions(['bindPostsRef', 'editPost', 'deletePost', 'likePost', 'unlikePost']),
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
    validateMediaUrl() {
      let url = this.editedPost.mediaUrl;
      if (url.includes('https://youtu.be/')) {
        url = url.replace('youtu.be', 'youtube.com/embed');
        this.editedPost.mediaUrl = url;
        return true;
      } else if (url.includes('https://www.youtube.com/watch?v')) {
        url = url.replace('watch?v=', 'embed/');
        this.editedPost.mediaUrl = url;
        return true;
      } else if (url.includes('https://www.youtube.com/embed/')) {
        return true;
      }
      console.log('??', url);
      return false;
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

      if (this.postType == 'media' && !this.validateMediaUrl()) {
        this.mediaUrlState = false;
        return;
      }

      this.editPost(this.editedPost);

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('editMyPost');
      });
    },
    handleDelete(index) {
      const post = {
        id: this.getPosts[index].id,
        text: this.getPosts[index].text,
      };
      if (confirm('Delete your post?')) {
        this.deletePost(post);
      }
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
