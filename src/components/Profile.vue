<template>
  <div id="profile">
    <div class="card bg-light text-center">
      <div class="card-body">
        <div>
          <div class="privacy">
            <b-nav>
              <b-nav-item-dropdown right no-caret menu-class="minw-none">
                <template slot="button-content">
                  <b-icon icon="three-dots" font-scale="1.2" variant="dark"></b-icon>
                </template>
                <router-link class="nav-item nav-link" to="/about" style="font-size: 13px">About Us</router-link>
                <router-link
                  class="nav-item nav-link"
                  to="/privacy"
                  style="font-size: 13px"
                >Privacy Policy</router-link>
                <router-link
                  class="nav-item nav-link"
                  to="/terms"
                  style="font-size: 13px"
                >Terms of Service</router-link>
              </b-nav-item-dropdown>
            </b-nav>
          </div>
          <div style="text-align: center; font-size:1.5em;">Profile</div>
        </div>

        <!-- Profile Photo -->
        <div class="mt-3">
          <div v-if="userData.userInfo.avatar">
            <b-avatar v-bind:src="userData.userInfo.avatar" variant="light" size="5em"></b-avatar>
            @{{ userData.userInfo.username }}
          </div>
          <div v-else>
            <b-avatar src="user-placeholder.jpg" variant="light" size="5em"></b-avatar>
            @{{ userData.userInfo.username }}
          </div>
        </div>
      </div>
      <div>
        <b-button to="/editprofile" variant="primary m-1">Edit Profile</b-button>
        <br />
        <b-button v-b-modal.changePwd variant="primary m-1">Change Password</b-button>
        <br />
        <button @click="handleLogout" class="btn btn-dark m-1">Logout</button>
      </div>
      <div class="m-2"></div>
    </div>

    <!-- Change Password Modal -->
    <div>
      <b-modal id="changePwd" title="Change Password">
        <p>We will send you an email to reset your password.</p>
        <input class="form-control" v-model="userData.userInfo.email" disabled />
        <template v-slot:modal-footer="{ cancel }">
          <b-button variant="dark" @click="cancel()">Cancel</b-button>
          <b-button variant="primary m-1" @click="handleResetPassword">Submit</b-button>
        </template>
      </b-modal>
    </div>

    <!-- My Posts -->
    <div class="card mt-3">
      <div class="card-body">
        <div style="text-align: center; font-size:1.5em;">My Posts</div>
        <div v-for="(n, index) in pageOffset" :key="index" class="mt-3">
          <div v-if="getMyPosts[index] != null">
            <div class="card border-0">
              <!-- Header -->
              <div class="m-1 d-flex justify-content-between">
                <span v-if="getMyPosts[index].avatar">
                  <b-avatar v-bind:src="getMyPosts[index].avatar" size="2.3em" variant="light"></b-avatar>
                </span>
                <span v-else>
                  <b-avatar src="user-placeholder.jpg" size="2.3em" variant="light"></b-avatar>
                </span>
                <div class="m-1">{{ getMyPosts[index].username }}</div>
                <div class="ml-auto">
                  <b-nav>
                    <b-nav-item-dropdown right no-caret menu-class="minw-none">
                      <template slot="button-content">
                        <b-icon icon="three-dots" font-scale="1.2" variant="dark"></b-icon>
                      </template>
                      <b-dropdown-item
                        v-if="getMyPosts[index].ownerId == userData.userInfo.uid"
                        v-on:click="showEditMyPost(index)"
                      >Edit</b-dropdown-item>
                      <b-dropdown-item
                        v-if="getMyPosts[index].ownerId == userData.userInfo.uid"
                        v-on:click="handleDelete(index)"
                      >Delete</b-dropdown-item>

                      <b-dropdown-item v-else disabled>Edit</b-dropdown-item>
                    </b-nav-item-dropdown>
                  </b-nav>
                </div>
              </div>
              <!-- Post Text -->
              <div class="ml-2">
                <h5>{{ getMyPosts[index].text }}</h5>
              </div>
              <!-- Youtube Link Post -->
              <div v-if="getMyPosts[index].mediaUrl != ''">
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe
                    id="ytplayer"
                    class="embed-responsive-item rounded-lg"
                    type="text/html"
                    v-bind:src="getMyPosts[index].mediaUrl"
                    frameborder="0"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
              <!-- Photo Post -->
              <div
                v-else-if="getMyPosts[index].imageUrl != ''"
                class="text-center border rounded-lg lazyimage"
              >
                <img v-bind:src="getMyPosts[index].imageUrl" class="img-fluid" loading="lazy" />
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
            <b-form-group
              label="Link:"
              label-for="mediaUrl"
              invalid-feedback="Please put YouTube link"
            >
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
    </div>

    <!-- <div class="card bg-light mt-4">
      <div class="card-body">
        <h2>My Posts</h2>
        <div v-if="getMyPosts.length">
          <div class="container">
            <div v-for="(post, index) in getMyPosts" :key="post.id">
              <div class="row">
                <div class="col-sm-9 p-0">{{ post.text.replace(/(.{50})..+/, '$1…') }}</div>
                <div class="col-12 col-sm-3 text-right p-0">
                  {{ timeFromCreated(index) }}
                  <b-icon
                    icon="pencil-square"
                    v-on:click="showEditMyPost(index)"
                    variant="primary"
                    class="mr-1"
                  ></b-icon>
                  <b-icon
                    icon="x-circle"
                    v-on:click="handleDelete(index)"
                    variant="primary"
                    class="mr-1"
                  ></b-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts.</p>
        </div>
      </div>
    </div>-->

    <!-- My Posts end -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Profile',
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
    ...mapGetters(['userData', 'getMyPosts']),
    pageOffset() {
      return this.maxPerPage * this.currentPage;
    },
  },
  methods: {
    ...mapActions(['bindMyPostsRef', 'editPost', 'deletePost', 'logout', 'resetPassword']),
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
    handleDelete(index) {
      const post = {
        id: this.getMyPosts[index].id,
        text: this.getMyPosts[index].text,
      };
      if (confirm('Delete your post?')) {
        this.deletePost(post);
      }
    },
    handleLogout() {
      this.logout();
    },
    handleResetPassword() {
      this.resetPassword(this.userData.userInfo.email);
      alert('Email sent. Please check your email.');
      this.$nextTick(() => {
        this.$bvModal.hide('changePwd');
      });
    },
    timeFromCreated(index) {
      var today = new Date();
      var msPerDay = 24 * 60 * 60 * 1000;
      var days = (today.getTime() - this.getMyPosts[index].createdAt.toDate().getTime()) / msPerDay;

      if (days < 1) {
        return Math.round(days * 24) + 'h';
      } else {
        return Math.round(days) + 'd';
      }
    },
    showEditMyPost(index) {
      this.postIndex = index;
      this.editedPost.ownerId = this.getMyPosts[index].ownerId;
      this.editedPost.postId = this.getMyPosts[index].postId;
      this.editedPost.text = this.getMyPosts[index].text;
      this.editedPost.mediaUrl = this.getMyPosts[index].mediaUrl;
      this.editedPost.imageUrl = this.getMyPosts[index].imageUrl;
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
    this.bindMyPostsRef();
  },
};
</script>
