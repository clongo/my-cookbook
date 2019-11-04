<template>
    <div class="sticky">
        <b-card>
            <font-awesome-icon icon="times" @click="close" class="close-btn" />
            <b-row>
            <b-col md="6">
                <a :href="selectedRecipe.url" target="_blank">
                    <b-card-img :src="selectedRecipe.image" class="rounded-4"></b-card-img>
                </a>
            </b-col>
            <b-col md="6">
                <b-card-body :title="selectedRecipe.name" :sub-title="selectedRecipe.siteName">
                    <b-card-text class="text-left">
                        <StarRating v-if="selectedRecipe.rating" :starStyle="{starWidth: 20, starHeight: 20}" :rating="selectedRecipe.rating"/>
                        <a :href="selectedRecipe.url" target="_blank">View Recipe</a>
                        <p>
                            <span v-if="totalTime">Cook Time: {{totalTime}}<br/></span>
                            <br/>
                            {{selectedRecipe.description}}
                        </p>
                    </b-card-text>
                </b-card-body>
            </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {isValid,   toFragments} from 'pomeranian-durations'
import StarRating from 'vue-dynamic-star-rating'
export default {
    name: 'RecipeDetail',
    methods: {
        ...mapActions(['selectRecipeAction']),
        close: function()
        {
          this.selectRecipeAction(undefined);
        }
    },
    components: {
      StarRating
    },
    computed: {
        ...mapState(['selectedRecipe']),
        totalTime: function()
        {
            if(isValid(this.selectedRecipe.totalTime))
            {
                let time = toFragments(this.selectedRecipe.totalTime);
                let date = new Date(0,0,0,time.hours,time.minutes,time.seconds);
                let hours = date.getHours();
                let minutes = date.getMinutes();

                let formated = '';
                if(hours > 0)
                    formated += hours + ' hours '
                if(minutes > 0)
                    formated += minutes + ' minutes'
                return formated.trim();
            }
            return undefined
        }
    }
}
</script>
<style scoped>
    .sticky {
        height: 100%;
    }

    .sticky > * {
        position: sticky;
        top: 80px;
    }

    .card {
        max-height: 100vh;
        overflow: auto;
    }

    .close-btn {
        cursor: pointer;
        position: absolute;
        top: 2px;
        left: 4px;
    }
</style>