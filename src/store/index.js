import Vue from 'vue'
import Vuex from 'vuex'
import {
  SELECT_RECIPE,
  CLEAR_RECIPES,
  UPDATE_SEARCH,
  UPDATE_RESULT_TOTAL,
  ADD_RECIPE,
  SET_USER,
  SET_RECIPE_FAVORITE,
  SET_MY_RECIPES,
  UPDATE_RECIPE,
  REMOVE_RECIPE
} from './mutation-types'

import {dataService} from '@/shared'

Vue.use(Vuex)

const state = {
  selectedRecipe: undefined,
  resultTotal: undefined,
  recipes: [],
  googleSearch: {
    searchTerms: "",
    count: 10,
    startIndex: 1,
    hasNextPage: false
  },
  googleUser: undefined,
  myRecipes: false
};

const mutations = {
  [SELECT_RECIPE](state, recipe)
  {
    state.selectedRecipe = recipe;
  },
  [CLEAR_RECIPES](state)
  {
    state.recipes = [];
  },
  [ADD_RECIPE](state, recipe)
  {
    state.recipes.push(recipe);
  },
  [UPDATE_RECIPE](state, args)
  {
    for(var i = 0; i < state.recipes.length; i++)
    {
      if(state.recipes[i].url === args.url){
        //use vue set to trigger the components to update in the details and the list
        Vue.set(state.recipes, i, args.recipe);
        return;
      }
    }
  },
  [REMOVE_RECIPE](state, recipes)
  {
    state.recipes.splice(state.recipes.indexOf(recipes), 1);
  },
  [UPDATE_SEARCH](state, search)
  {
    state.googleSearch = search;
  },
  [UPDATE_RESULT_TOTAL](state, totalResults)
  {
    state.resultTotal = totalResults;
  },
  [SET_USER](state, googleUser)
  {
    state.googleUser = googleUser;
  },
  [SET_RECIPE_FAVORITE](state, args)
  {
    for(var i = 0; i < state.recipes.length; i++)
    {
      if(state.recipes[i].url === args.url){
        //use vue set to trigger the components to update in the details and the list
        Vue.set(state.recipes[i], 'favorite', args.favorite);
        return;
      }
    }
  },
  [SET_MY_RECIPES](state, myRecipes)
  {
    state.myRecipes = myRecipes;
  }
};

const actions = {
  /**
   * Select a recipe and show it's detail to the user.
   * Called from RecipeListItem when item is clicked
   * @param {Object} param0 Vuex helpers
   * @param {Object} recipe The recipe selected from the list
   */
  async selectRecipeAction({commit, dispatch}, recipe)
  {
    commit(SELECT_RECIPE, recipe);

    //update recipe data from google if the recipe is saved
    if(recipe.favorite)
    {
      await dispatch("updateSavedRecipeFromUrl", recipe.url);
    }
  },
  /**
   * Do a search in google and saved recipes. If no searchTerm is supplied, load recipes from the next page in google results.
   * Called when user searches in the Header or page is scrolled to bottom, triggering the next page load
   * @param {Object} param0 Vuex helpers
   * @param {string} searchTerm Search terms to search with
   */
  async searchRecipes({commit, state, dispatch}, searchTerm = undefined)
  {
    //do not search if no term or next page
    if(!searchTerm && !state.googleSearch.hasNextPage) return;

    //Hide My Recipe controls
    commit(SET_MY_RECIPES, false);
    //setup new googleSearch object so we can update it
    const newSearch = {...state.googleSearch};

    //new search will send a search term. otherwise we are getting next page of results
    if(searchTerm) 
    {
      //start new search from page one
      commit(CLEAR_RECIPES);
      newSearch.startIndex = 1;
      newSearch.searchTerms = searchTerm;

      //todo get recipes from logged in user and add them to the top of the list
      await dispatch('searchUserRecipes', searchTerm);
    }
    //else, current google state is set up for next page

    //do google search
    const {updatedSearch, recipes, totalResults} = await dataService.getRecipesFromGoogle(newSearch);

    if(searchTerm) //new search
    {
      commit(UPDATE_RESULT_TOTAL, totalResults);
    }

    //update state of google search params
    commit(UPDATE_SEARCH, updatedSearch);

    //add recipes with unique urls
    recipes.map(async r => {
      if(r!= undefined)
      { 
        let savedRecipe = state.recipes.find(function(value){return value.url === r.url}) 
        if(savedRecipe === undefined)
          commit(ADD_RECIPE, r);
        else if(savedRecipe.favorite)
        {
          //update recipe with new data
          await dispatch("updateSavedRecipeData", r);
        }
      }
    });
  },
  /**
   * Sets the signed in the state
   * @param {Object} param0 Vuex helpers
   * @param {Object} googleUser The google user object
   */
  async setSignedInUserAction({state, commit}, googleUser)
  {
    //save the google user
    commit(SET_USER, googleUser);

    if(!googleUser)
    {
      if(state.myRecipes)
      {
        commit(CLEAR_RECIPES);
        commit(SET_MY_RECIPES, false);
      }

      else {
        state.recipes.map(r => {
          commit(SET_RECIPE_FAVORITE, {url: r.url, favorite: false});
        });
      }
    }
  },
  /**
   * Loads all the recipes for the logged in user
   * Called when user is first logged in or clicks My Recipes link
   * @param {Object} param0 Vuex helpers
   */
  async getUserRecipes({commit, state})
  {
    const response = await dataService.getSavedRecipes(state.googleUser);

    //add recipes with unique urls
    if(response && response.status === 200)
    {
      //Show My Recipe controls
      commit(SET_MY_RECIPES, true);
      //keep any search terms, but dont let the page load results when list is scrolled
      const newSearch = {...state.googleSearch};
      newSearch.hasNextPage = false;
      commit(UPDATE_SEARCH, newSearch);
      
      //Show My Cookbook title by removing result total
      commit(UPDATE_RESULT_TOTAL, undefined);

      //clear any search results
      commit(CLEAR_RECIPES);
      commit(SELECT_RECIPE, undefined);

      response.data.map(r => {
        if(r!= undefined && state.recipes.find(function(value){return value.url === r.url}) === undefined)
        {
          r.favorite = true;
          commit(ADD_RECIPE, r);
        }
      });
    }
    else {
      //API server error. TODO show error message to user
    }
  },
  /**
   * Searches user saved recipes for matches to search
   * Called when user is searching google to include their saved recipes at the top
   * @param {Object} param0 Vuex helpers
   * @param {string} searchTerms Search terms to search with
   */
  async searchUserRecipes({commit, state}, searchTerms)
  {
    const response = await dataService.searchSavedRecipes(state.googleUser, searchTerms);

    //add recipes with unique urls
    if(response && response.status === 200)
    {
      response.data.map(r => {
        r.favorite = true;
        if(state.recipes.find(function(value){return value.url === r.url}) === undefined)
          commit(ADD_RECIPE, r);
      });
    }
    else {
      //API server error. TODO show error message to user
    }
  },
  /**
   * Togggles saving/removing recipe from user cookbook.
   * Called when user clicks favorite icon. 
   * @param {Object} param0 Vuex helpers
   * @param {Object} recipe The recipe to toggle favorite and save
   */
  async toggleRecipeFavorite({commit, state}, recipe)
  {
    let response;
    if(!recipe.favorite)
      response = await dataService.addSavedRecipe(state.googleUser, recipe);
    else
    {
      response = await dataService.deleteSavedRecipe(state.googleUser, recipe);
      
      //remove recipe from list if on my recipes "page"
      if(state.myRecipes && response && response.status === 200)
      {
        commit(REMOVE_RECIPE, recipe)
      }
    }
    if(response && response.status === 200)
      commit(SET_RECIPE_FAVORITE, {url: recipe.url, favorite: !recipe.favorite});
  },
  /**
   * Adds the recipe url to the saved recipes
   * Called from Modal when user adds a recipe Url
   * @param {Object} param0 Vuex helpers
   * @param {string} url The url of the recipe to add
   */
  async addRecipeFromUrl({commit, state, dispatch}, url)
  {
      const recipe = { url: url, favorite: true};
      commit(ADD_RECIPE, recipe);
      const response = await dataService.addSavedRecipe(state.googleUser, recipe);

      if(response && response.status === 200)
      {
        //imediately run update logic for new recipe
        await dispatch("updateSavedRecipeFromUrl", url);
      }
      else {
        //API server error. TODO show error message to user
      }
  },
  /**
   * Gets recipe data from Google using the url and updates it in the Users Saved Recipes
   * This keeps saved recipes up to date with google
   * Called when user Adds recipe from Url or User clicks saved recipe from the list.
   * @param {Object} param0 Vuex helpers
   * @param {string} url The Url to load recipe data from google
   */
  async updateSavedRecipeFromUrl({dispatch}, url)
  {
    //search google by recipe
    const recipe = await dataService.getRecipeFromGoogle(url);

    await dispatch("updateSavedRecipeData", recipe);
  },
  /**
   * Updates the Users Saved Recipe with the google recipe data
   * This keeps saved recipes up to date with google
   * Called when Google search contains recipe that is saved for a user
   * @param {Object} param0 Vuex helpers
   * @param {Object} recipe The recipe data from google
   */
  async updateSavedRecipeData({commit, state}, recipe)
  {
    //send recipe to API as POST
    const response = await dataService.updateSavedRecipe(state.googleUser, recipe.url, recipe);
    
    if(response && response.status === 200)
    {
      //commmit recipe to list of recipes in state
      commit(UPDATE_RECIPE, {url: recipe.url, recipe: recipe});
      commit(SET_RECIPE_FAVORITE, {url: recipe.url, favorite: true});
    }
    else {
      //API server error. TODO show error message to user
    }
  }
};

const getters = {
  
};

export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  actions,
  getters
})
