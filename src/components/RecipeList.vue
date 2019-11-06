<template>
    <div class="recipe-list text-left" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="300">
        <span v-if="!myRecipes" class="text-black-50">About {{resultTotal}} results</span>
        <MyRecipes v-else/>
        <div v-for="recipe in recipes" :key="recipe.url" >
            <RecipeListItem :recipe="recipe" />
        </div>
    </div>
</template>

<script>
import RecipeListItem from '@/components/RecipeListItem'
import MyRecipes from '@/components/MyRecipes'
import {mapState,mapActions} from 'vuex'

export default {
    name: "recipeList",
    components: { RecipeListItem, MyRecipes },
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
        ...mapState(['recipes', 'resultTotal', 'myRecipes']),
    }
}
</script>

<style scoped>
</style>