import Vue from 'vue'
import Vuex from 'vuex'
import {
  SELECT_RECIPE,
  CLEAR_RECIPES,
  UPDATE_SEARCH,
  UPDATE_RESULT_TOTAL,
  ADD_RECIPE,
} from './mutation-types'

import {dataService} from '@/shared'

Vue.use(Vuex)

const state = {
  selectedRecipe: undefined,
  resultTotal: "",
  recipes: [],
  googleSearch: {
    searchTerms: "",
    count: 10,
    startIndex: 1,
    hasNextPage: false
  }
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
  [UPDATE_SEARCH](state, search)
  {
    state.googleSearch = search;
  },
  [UPDATE_RESULT_TOTAL](state, totalResults)
  {
    state.resultTotal = totalResults;
  }
};

const actions = {
  selectRecipeAction({commit}, recipe)
  {
    commit(SELECT_RECIPE, recipe);
  },
  async searchRecipes({commit, state}, searchTerm = undefined)
  {
    //setup new googleSearch object so we can update it
    const newSearch = {...state.googleSearch};

    if(searchTerm)
    {
      //start new search from page one
      commit(CLEAR_RECIPES);
      newSearch.startIndex = 1;
      newSearch.searchTerms = searchTerm;

      //todo get recipes from logged in user and add them to the top of the list
    }
    //else, current google state is set up for next page

    //do google search
    const {updatedSearch, recipes, totalResults} = await dataService.getRecipesFromGoogle(newSearch);

    if(searchTerm)
    {
      commit(UPDATE_RESULT_TOTAL, totalResults);
    }

    //update state of google search params
    commit(UPDATE_SEARCH, updatedSearch);

    //add recipes with unique urls
    recipes.map(r => {
      if(state.recipes.find(function(value){return value.url === r.url}) === undefined)
        commit(ADD_RECIPE, r);
    })
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
