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
  async selectRecipeAction({commit, dispatch}, recipe)
  {
    commit(SELECT_RECIPE, recipe);

    //update recipe data from google if the recipe is saved
    if(recipe.favorite)
    {
      await dispatch("updateSavedRecipeFromUrl", recipe.url);
    }
  },
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
  async setSignedInUserAction({commit}, googleUser)
  {
    //save the google user
    commit(SET_USER, googleUser);
  },
  /**
   * Called when user is first logged in or clicks My Recipes link
   */
  async getUserRecipes({commit, state})
  {
    const response = await dataService.getSavedRecipes(state.googleUser);

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

    //add recipes with unique urls
    if(response.status === 200)
      response.data.map(r => {
        if(r!= undefined && state.recipes.find(function(value){return value.url === r.url}) === undefined)
        {
          r.favorite = true;
          commit(ADD_RECIPE, r);
        }
      });
  },
  /**
   * Called when user is searching google to include their saved recipes at the top
   */
  async searchUserRecipes({commit, state}, searchTerms)
  {
    const response = await dataService.searchSavedRecipes(state.googleUser, searchTerms);

    //add recipes with unique urls
    if(response.status === 200)
      response.data.map(r => {
        r.favorite = true;
        if(state.recipes.find(function(value){return value.url === r.url}) === undefined)
          commit(ADD_RECIPE, r);
      });
  },
  /**
   * Called when user clicks favorite icon. Togggles saving/removing recipe from user cookbook
   * @param {*} param0 
   * @param {Object} args contains the url of the recipe and the the flag for favorite
   */
  async toggleRecipeFavorite({commit, state}, recipe)
  {
    let response;
    if(!recipe.favorite)
      response = await dataService.addSavedRecipe(state.googleUser, recipe);
    else
    {
      response = await dataService.deleteSavedRecipe(state.googleUser, recipe);
      
      if(state.myRecipes && response.status === 200)
      {
        commit(REMOVE_RECIPE, recipe)
      }
    }
    if(response.status === 200)
      commit(SET_RECIPE_FAVORITE, {url: recipe.url, favorite: !recipe.favorite});
  },
  /**
   * Adds the recipe url to the saved recipes
   * @param {*} param0 
   * @param {string} url The url of teh recipe to add
   */
  async addRecipeFromUrl({commit, state, dispatch}, url)
  {
      const recipe = { url: url, favorite: true};
      commit(ADD_RECIPE, recipe);
      await dataService.addSavedRecipe(state.googleUser, recipe);

      //imediately run update logic for new recipe
      await dispatch("updateSavedRecipeFromUrl", url);
  },

  async updateSavedRecipeFromUrl({commit, state}, url)
  {
    //search google by recipe
    const recipe = await dataService.getRecipeFromGoogle(url);
    //commmit recipe to list of recipes in state
    commit(UPDATE_RECIPE, {url: url, recipe: recipe});
    commit(SET_RECIPE_FAVORITE, {url: recipe.url, favorite: true});
    //send recipe to API as POST
    await dataService.updateSavedRecipe(state.googleUser, url, recipe);
  },

  async updateSavedRecipeData({commit, state}, recipe)
  {
    //commmit recipe to list of recipes in state
    commit(UPDATE_RECIPE, {url: recipe.url, recipe: recipe});
    commit(SET_RECIPE_FAVORITE, {url: recipe.url, favorite: true});
    //send recipe to API as POST
    await dataService.updateSavedRecipe(state.googleUser, recipe.url, recipe);
  }
};

const getters = {
  getRecipeByUrl: state => url => state.recipe.find(r => r.url === url)
};

export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  actions,
  getters
})
