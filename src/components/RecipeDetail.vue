<template>
    <div style="position:fixed">
        <button @click="close">Close</button>
        {{selectedRecipe}}
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    name: 'RecipeDetail',
    methods: {
        ...mapActions(['selectRecipeAction']),
        close: function()
        {
          this.selectRecipeAction(undefined);
        }
    },
    computed: {
        ...mapState(['selectedRecipe']),
    }
}
</script>