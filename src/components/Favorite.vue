<template>
    <span v-if="googleUser" class="heart" :class="{'favorite': recipe.favorite}" @click.stop="favoriteClicked"><font-awesome-icon icon="heart"/></span>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    name: 'Favorite',
    props: {
        recipe: Object
    },
    data() {
        return {
        }
    },
    methods: {
        ...mapActions(['setRecipeFavorite']),
        favoriteClicked: function()
        {
          this.setRecipeFavorite({url: this.recipe.url, favorite: !this.recipe.favorite});
        }
    },
    computed: {
        ...mapState(['googleUser'])
    }
}
</script>

<style scoped>
    .heart {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      color: #888;
    }

    .favorite.heart {
      color: #d64c4c;
    }
</style>