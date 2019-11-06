<template>
  <div id="app">
    <Header />
    <b-container fluid>
      <b-row v-if=hasResults>
        <b-col>
          <RecipeList/>
        </b-col>
        <b-col v-if="selectedRecipe" class="mobile-overlay mobile-close" @click="closeMobileOverlay">
          <RecipeDetail />
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
        <h4>Use the form above to find your favorite recipes. Login with google to view your saved recipes.</h4>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import RecipeList from '@/components/RecipeList'
import RecipeDetail from '@/components/RecipeDetail'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'app',
  components: {
    RecipeList,
    Header,
    RecipeDetail
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['selectedRecipe', 'recipes']),
    hasResults: function()
    {
      return this.recipes.length > 0;
    }
  },
  methods: {
    ...mapActions(['selectRecipeAction']),
    closeMobileOverlay: function(e)
    {
      if(window.innerWidth < 945 && e.target.classList.contains('mobile-close'))
        this.selectRecipeAction(undefined);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 100px;
}
@media only screen and (max-width: 945px) {
  .mobile-overlay.col {
    position: fixed;
    top: 0;
    height: 100%;
    background: rgb(0,0,0,0.6);
    z-index: 1200;
  }

  .mobile-overlay.col .sticky .card {
    position: relative;
  }
}
</style>
