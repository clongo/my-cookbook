<template>
    <div @click.stop>
        <span v-if="googleUser" class="heart" :class="{'favorite': recipe.favorite}" @click.stop="favoriteClicked"><font-awesome-icon icon="heart"/></span>
        <modal v-if="showModal">
            <h3 slot="header">Delete Recipe?</h3>
            <div slot="body">
                <p>Removing this recipe from your saved recipes will remove all data and cannot be undone.</p>
            </div>
            <div slot="footer">
                <b-input-group>
                    <b-input-group-prepend>
                        <b-button @click="showModal = false" variant="info">Cancel</b-button>
                    </b-input-group-prepend>
                    <b-input-group-append>
                        <b-button @click="favoriteClicked(this, true)" variant="danger">Delete</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '@/components/Modal'
import {mapState, mapActions} from 'vuex'
export default {
    name: 'Favorite',
    components: { modal },
    props: {
        recipe: Object
    },
    data() {
        return {
            showModal: false
        }
    },
    methods: {
        ...mapActions(['toggleRecipeFavorite']),
        favoriteClicked: function(e, force = false)
        {
            if(this.recipe.favorite && !force)
            {
                //prompt user before removing recipe
                this.showModal = true;
                return;
            }
            this.toggleRecipeFavorite(this.recipe);
            this.showModal = false;
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