<template>
  <div id="feed">
    <div v-for="(n, index) in pageOffset" :key="index" class="m-2">
      <div v-if="getPosts[index] != null">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ getPosts[index].text }}</h5>
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
          <!-- <p class="card-text text-right">
                <small class="text-muted">
                  {{
                  getPosts[index].createdAt.toDate().toLocaleString()
                  }}
                </small>
          </p>-->
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
      post: {
        text: '',
        mediaUrl: '',
      },
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
    ...mapActions(['bindPostsRef']),
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
  },
  mounted() {
    this.scrollTrigger();
  },
  created() {
    this.bindPostsRef();
  },
};
</script>
