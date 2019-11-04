<template>
<b-navbar variant="info" type="dark" toggleable="lg" fixed="top">
    <b-input-group>
        <b-navbar-brand>My Cookbook</b-navbar-brand>
        <b-form-input placeholder="Search" v-model="search" @keydown.enter="doSearch"></b-form-input>
        <b-input-group-append>
            <b-button @click="doSearch" variant="secondary">Search</b-button>
        </b-input-group-append>
    </b-input-group>
</b-navbar>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: "Header",
    data() {
        return {
            search: ""
        }
    },
    methods: {
        ...mapActions(['searchRecipes']),
        doSearch: async function()
        {
            this.searchRecipes(this.search);
        }
    }
}
</script>
<style scoped>
    .input-group input.form-control {
        border-radius: 0.25rem 0 0 0.25rem;
        top: 1px;
    }
</style>