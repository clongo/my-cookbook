<template>
    <b-card no-body class="overflow-hidden recipe-card" :style="{'background-image': 'url(\'' + recipe.image + '\')'}" @click="show">
      <b-row no-gutters>
        <b-col md="3">
        </b-col>
        <b-col md="9" class="recipe-details" >
          <b-card-body>
            <b-card-title class="text-left">{{formattedName}}</b-card-title>
            <b-card-text class="text-left small recipe-desc">
              <star-rating v-if="rating" :starStyle="{starWidth: 20, starHeight: 20}" :rating="rating"></star-rating>
              {{recipe.description}}
            </b-card-text>
            <Favorite :recipe="recipe"/>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
</template>

<script>
import Favorite from '@/components/Favorite'
import {mapActions} from 'vuex'
export default {
    name: "RecipeListItem",
    components: {
      Favorite
    },
    props: {
        recipe: Object
    },
    data() {
        return {}
    },
    methods: {
        ...mapActions(['selectRecipeAction']),
        show: function()
        {
          this.selectRecipeAction(this.recipe);
        }
    },
    computed: {
      formattedName: function()
      {
        if(this.recipe.siteName)
        return this.recipe.name + ' - ' + this.recipe.siteName;
        return this.recipe.name
      },
      rating: function()
      {
        if(this.recipe.ratingCount > 0)
        {
          //format rating for component
          return new Number(this.recipe.ratingValue);
        }
        return undefined;
      }
    }
}
</script>

<style scoped>
    .recipe-card {
        background-size: cover;
        margin-bottom: 10px;
        border:0;
        background-color: #ccc;
    }

    .recipe-details {
        background: rgba(255,255,255,.7);
        border: transparent 1px solid;
        transition: background .2s linear, border .2s linear;
        border-radius: 0 4px 4px 0;
    }
    .recipe-card:hover .recipe-details {
        background: #fff;
        border: #ccc 1px solid;
    }
</style>