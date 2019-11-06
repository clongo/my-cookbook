<template>
    <div class="sticky mobile-close">
        <b-card>
            <font-awesome-icon icon="times" @click="close" class="close-btn" />
            <b-row>
                <b-col>
                    <a :href="selectedRecipe.url" target="_blank">
                        <b-card-img :src="selectedRecipe.image" class="rounded-4 img-fluid"></b-card-img>
                    </a>
                </b-col>
                <b-col>
                    <b-card-body :title="selectedRecipe.name" :sub-title="selectedRecipe.siteName">
                        <b-card-text class="text-left">
                            <star-rating v-if="rating" :starStyle="{starWidth: 20, starHeight: 20}" :rating="rating" :key="rating"></star-rating>
                            <a :href="selectedRecipe.url" target="_blank">View Recipe</a><br/>
                            <span v-if="totalTime">Cook Time: {{totalTime}}</span>
                        </b-card-text>
                    </b-card-body>
                </b-col>
            </b-row>
            <b-row v-if="selectedRecipe.description">
                <b-col>
                    <p class="text-left">
                        {{selectedRecipe.description.trim()}}
                    </p>
                </b-col>
            </b-row>
            <Favorite :recipe="selectedRecipe"/>
        </b-card>
    </div>
</template>

<script>
import Favorite from '@/components/Favorite'
import {mapState, mapActions} from 'vuex'
import {isValid, toFragments} from 'pomeranian-durations'
export default {
    name: 'RecipeDetail',
    components: {
      Favorite
    },
    methods: {
        ...mapActions(['selectRecipeAction']),
        close: function()
        {
          this.selectRecipeAction(undefined);
        }
    },
    computed: {
        ...mapState(['selectedRecipe']),
        totalTime: function()
        {
            //format ISO 8601 durations
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

            //display time as is
            return this.selectedRecipe.totalTime
        },
        rating: function()
        {
            if(this.selectedRecipe.ratingValue > 0)
            {
                //format rating for component
                let rating = new Number(this.selectedRecipe.ratingValue);
                rating = Math.round(10*rating)/10.0; //ropund to the nearest tenth
                return rating;
            }
            return undefined;
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
        max-height: 600px;
        overflow: auto;
    }

    .close-btn {
        cursor: pointer;
        position: absolute;
        top: 2px;
        left: 4px;
    }
</style>