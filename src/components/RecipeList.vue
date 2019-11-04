<template>
    <div class="recipe-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="300">
        <div v-for="recipe in recipes" :key="recipe.url" >
            <RecipeListItem :recipe="recipe" />
        </div>
    </div>
</template>

<script>
import RecipeListItem from '@/components/RecipeListItem'
import {mapState,mapActions} from 'vuex'

export default {
    name: "recipeList",
    components: { RecipeListItem },
    data() {
      return {busy: false}
    },
    methods: {
        ...mapActions(['searchRecipes']),
        loadMore: function() {
            this.busy = true;
            this.searchRecipes(); //don't pass anything to request new page
            this.busy = false;
        }
    },
    computed: {
        ...mapState(['recipes']),
    }
}
</script>

<style scoped>
</style>