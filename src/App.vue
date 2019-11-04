<template>
  <div id="app">
    <Header />
    <b-container fluid>
      <b-row v-if=recipes>
        <b-col>
          <RecipeList/>
        </b-col>
        <b-col v-if="selectedRecipe">
          <RecipeDetail />
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
        <h4>Use the form above to find your favorite recipes.</h4>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import RecipeList from '@/components/RecipeList'
import RecipeDetail from '@/components/RecipeDetail'
import {mapState} from 'vuex'

export default {
  name: 'app',
  components: {
    RecipeList,
    Header,
    RecipeDetail
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['selectedRecipe', 'recipes']),
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
  margin-top: 80px;
}
</style>
