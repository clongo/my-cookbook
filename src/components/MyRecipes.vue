<template>
    <div>
        <h3>My Recipes
        <b-button @click="showModal = true" variant="info">Add Recipe</b-button></h3>
        <!-- use the modal component, pass in the prop -->
        <modal v-if="showModal">
            <h3 slot="header">Add Recipe</h3>
            <div slot="body">
                <b-input-group prepend="Url" class="mt-3">
                    <b-form-input v-model="url" @keydown.enter="addRecipe"></b-form-input>
                </b-input-group>
            </div>
            <div slot="footer">
                <b-input-group>
                    <b-input-group-prepend>
                        <b-button @click="showModal = false" variant="secondary">Cancel</b-button>
                    </b-input-group-prepend>
                    <b-input-group-append>
                        <b-button @click="addRecipe" variant="info">Add</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </modal>
    </div>
</template>
<script>
import modal from '@/components/Modal'
import {mapActions} from 'vuex'
export default {
    name: "MyRecipes",
    components: { modal },
    data() {
        return {
            showModal: false,
            url: undefined
        }
    },
    methods: {
        ...mapActions(['addRecipeFromUrl']),
        addRecipe: function()
        {
            this.addRecipeFromUrl(this.url);
            this.showModal = false;
        }
    }
}
</script>