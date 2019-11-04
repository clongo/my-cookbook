<template>
<b-navbar variant="info" type="dark" toggleable="lg" fixed="top">
    <b-navbar-brand>My Cookbook</b-navbar-brand>
        <input size="md" class="form-control mr-2" placeholder="Search" v-model="search" @keydown.enter="doSearch"/>
        <b-button size="md" class="my-2" @click="doSearch">Search</b-button>
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