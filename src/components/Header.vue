<template>
<b-navbar variant="info" type="dark" toggleable="lg" fixed="top">
    <b-input-group>
        <b-navbar-brand>My Cookbook</b-navbar-brand>
        <b-form-input placeholder="Search" v-model="search" @keydown.enter="doSearch"></b-form-input>
        <b-input-group-append>
            <b-button @click="doSearch" variant="secondary">Search</b-button>
        </b-input-group-append>
        <b-button 
        @click="handleClickSignIn"
        v-if="!isSignIn"
        class="signin-link">Sign In</b-button>

            <b-nav-item-dropdown right class="profile-link"
            v-if="isSignIn">
                <!-- Using 'button-content' slot -->
                <template v-slot:button-content class="profile-image-wrapper">
                    <img :src="userImage" />
                </template>
                <b-dropdown-item @click="getUserRecipes">My Recipes</b-dropdown-item>
                <b-dropdown-item @click="handleClickSignOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
    </b-input-group>

</b-navbar>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    name: "Header",
    data() {
        return {
            search: "",
            isInit: false,
            isSignIn: false
        }
    },
    computed: {
        ...mapState(['googleUser']),
        userImage: function()
        {
           return this.googleUser.getBasicProfile().getImageUrl();
        }
    },
    methods: {
        ...mapActions(['searchRecipes', 'setSignedInUserAction', 'getUserRecipes']),
        doSearch: async function()
        {
            this.searchRecipes(this.search);
        },
        handleClickSignIn() {
            this.$gAuth
                .signIn()
                .then(GoogleUser => {
                    //on success do something
                    // console.log("GoogleUser", GoogleUser);
                    // console.log("getId", GoogleUser.getId());
                    // console.log("getBasicProfile", GoogleUser.getBasicProfile());
                    // console.log("getAuthResponse", GoogleUser.getAuthResponse());
                    // console.log(
                    //   "getAuthResponse",
                    //   this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
                    // );
                    this.setSignedInUserAction(GoogleUser);
                    this.getUserRecipes();
                    this.isSignIn = this.$gAuth.isAuthorized;
                })
                .catch(error => {
                    error == error;
                    //on fail do something
                });
        },
        handleClickSignOut() {
            this.$gAuth
                .signOut()
                .then(() => {
                    //on success do something
                    this.setSignedInUserAction(undefined);
                    this.isSignIn = this.$gAuth.isAuthorized;
                })
                .catch(error => {
                    error == error;
                    //on fail do something
                });
        }
    },
    created() {
        let that = this;
        let checkGauthLoad = setInterval(function() {
        that.isInit = that.$gAuth.isInit;
        that.isSignIn = that.$gAuth.isAuthorized;
        if(that.isSignIn) {
            that.setSignedInUserAction(that.$gAuth.GoogleAuth.currentUser.get());
            that.getUserRecipes();
        }
        if (that.isInit) 
            clearInterval(checkGauthLoad);
        }, 1000);
    }
}
</script>
<style scoped>
    .input-group input.form-control {
        border-radius: 0.25rem 0 0 0.25rem;
        top: 1px;
    }
    .input-group-append button.btn.btn {
        border-radius: 0 0.25rem 0.25rem 0;
    }

    .signin-link,
    .signin-link:hover,
    .signin-link:focus,
    .signin-link.btn-secondary.btn-secondary:active,
    .signin-link.btn-secondary.btn-secondary:active:focus {
        background: none;
        border: 0;
        box-shadow: none;
        -webkit-box-shadow: none;
    }
</style>
<style>
    /* Style the profile button */
    .profile-link > a {
        width: 60px;
    }
    .profile-link > a img {
        width: 38px;
        position: absolute;
        top: 0;
        left: 10px;
        border-radius: 100%;
    }
    .nav-link.dropdown-toggle:after {
        position: absolute;
        margin: 0;
        right: 0;
        top: 50%
    }
</style>