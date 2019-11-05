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
        class="signin-link">Login</b-button>
        <b-button 
        @click="handleClickSignOut"
        v-if="isSignIn"
        class="signin-link">Logout</b-button>
    </b-input-group>
</b-navbar>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: "Header",
    data() {
        return {
            search: "",
            isInit: false,
            isSignIn: false
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