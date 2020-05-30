<template>
  <div id="feed">
    <div v-for="(n, index) in pageOffset" :key="index" class="m-2">
      <div v-if="getPosts[index] != null">
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              <div v-if="getPosts[index].avatar">
                <b-avatar
                  v-bind:src="getPosts[index].avatar"
                  size="2em"
                  variant="primary"
                ></b-avatar>
                @{{ getPosts[index].username }}
              </div>
              <div v-else>
                <b-avatar src="user-placeholder.jpg" size="2em" variant="light"></b-avatar>
                @{{ getPosts[index].username }}
              </div>
              <h5>{{ getPosts[index].text }}</h5>
            </div>
            <p class="card-text text-right">
              <small class="text-muted">
                <!-- if my post, not allowed like,unlick -->
                <div v-if="getPosts[index].ownerId == userData.userInfo.uid">
                  <b-icon icon="heart" variant="danger"></b-icon>
                  {{ getPosts[index].likeCount }} Likes, {{ timeFromCreated(index) }}
                </div>
                <!-- if not my post -->
                <div v-else>
                  <!-- if already like, allowed only unlike -->
                  <div v-if="isMyLike(index)">
                    <b-icon
                      icon="heart-fill"
                      v-on:click="deleteLike(index)"
                      variant="danger"
                    ></b-icon>
                    {{ getPosts[index].likeCount }} Likes, {{ timeFromCreated(index) }}
                  </div>
                  <!-- if not yet, allowed like -->
                  <div v-else>
                    <b-icon icon="heart" v-on:click="addLike(index)" variant="danger"></b-icon>
                    {{ getPosts[index].likeCount }} Likes, {{ timeFromCreated(index) }}
                  </div>
                </div>
              </small>
            </p>
          </div>
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
          <div
            v-else-if="getPosts[index].imageUrl != ''"
            class="text-center border rounded-lg lazyimage"
          >
            <img v-bind:src="getPosts[index].imageUrl" class="img-fluid" loading="lazy" />
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
      currentPage: 1,
      maxPerPage: 2,
      showloader: true,
    };
  },
  computed: {
    ...mapGetters(['userData', 'getPosts']),
    pageOffset() {
      return this.maxPerPage * this.currentPage;
    },
  },
  methods: {
    ...mapActions(['bindPostsRef', 'likePost', 'unlikePost']),
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
      this.likePost(this.getPosts[index].postId);
    },
    deleteLike(index) {
      this.unlikePost(this.getPosts[index].postId);
    },
    timeFromCreated(index) {
      var today = new Date();
      var msPerDay = 24 * 60 * 60 * 1000;
      // var msPerHour = 60 * 60 * 1000;
      var days = (today.getTime() - this.getPosts[index].createdAt.toDate().getTime()) / msPerDay;

      if (days < 1) {
        return Math.round(days * 24) + 'h';
      } else {
        return Math.round(days) + 'd';
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
