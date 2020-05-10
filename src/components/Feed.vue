<template>
  <div class="card-columns p-2">
    <div class="card">
      <div class="card-body">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe
            id="ytplayer"
            class="embed-responsive-item rounded-lg"
            type="text/html"
            src="https://www.youtube.com/embed/XRCVF5qPBKk?autoplay=1"
            frameborder="0"
            loading="lazy"
          ></iframe>
        </div>
        <h5 class="card-title">1. Card title that wraps to a new line</h5>
        <p class="card-text">
          1. This is a longer card with supporting text below as a natural lead-in to additional
          content. This content is a little bit longer.
        </p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe
            id="ytplayer"
            class="embed-responsive-item rounded-lg"
            type="text/html"
            src="https://www.youtube.com/embed/H5SW_xMyESI?autoplay=1"
            frameborder="0"
            loading="lazy"
          ></iframe>
        </div>
        <h5 class="card-title">2. Card title that wraps to a new line</h5>
        <p class="card-text">
          2. This is a longer card with supporting text below as a natural lead-in to additional
          content. This content is a little bit longer.
        </p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe
            id="ytplayer"
            class="embed-responsive-item rounded-lg"
            type="text/html"
            src="https://www.youtube.com/embed/m0daIFQjLIc?autoplay=1"
            frameborder="0"
            loading="lazy"
          ></iframe>
        </div>
        <h5 class="card-title">3. Card title that wraps to a new line</h5>
        <p class="card-text">
          3. This is a longer card with supporting text below as a natural lead-in to additional
          content. This content is a little bit longer.
        </p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe
            id="ytplayer"
            class="embed-responsive-item rounded-lg"
            type="text/html"
            src="https://www.youtube.com/embed/LScZ3DLKly4?autoplay=1"
            frameborder="0"
            loading="lazy"
          ></iframe>
        </div>
        <h5 class="card-title">4. Card title that wraps to a new line</h5>
        <p class="card-text">
          4. This is a longer card with supporting text below as a natural lead-in to additional
          content. This content is a little bit longer.
        </p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe
            id="ytplayer"
            class="embed-responsive-item rounded-lg"
            type="text/html"
            src="https://www.youtube.com/embed/zun-CRis3gg?autoplay=1"
            frameborder="0"
            loading="lazy"
          ></iframe>
        </div>
        <h5 class="card-title">5. Card title that wraps to a new line</h5>
        <p class="card-text">
          5. This is a longer card with supporting text below as a natural lead-in to additional
          content. This content is a little bit longer.
        </p>
        <p class="card-text">
          <small class="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
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
        title: '',
        content: '',
      },
    };
  },
  methods: {
    ...mapActions(['createPost']),
    handleSubmit: function() {
      if (this.content.length === 0) {
        return alert('There is no content.');
      }
      this.createPost(this.post);
      this.post.title = '';
      this.post.content = '';
    },
  },
};
</script>
