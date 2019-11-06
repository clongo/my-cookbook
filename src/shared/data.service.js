import axios from 'axios'
import {GOOGLE_BASE_URL, COOKBOOK_API_URL} from './config'

/**
 * Get Recipes from Google with the given search parameters
 * @param {Object} googleSearch Google Search state object
 */
const getRecipesFromGoogle = async function(googleSearch) {
    //call google api
    const response = await axios.get(`${GOOGLE_BASE_URL}&q=${googleSearch.searchTerms}&num=${googleSearch.count}&start=${googleSearch.startIndex}`).catch((err) => {
      //must catch for vue to continue execution
      return err.response;
    });
    
    if(response.status === 200)
    {
      //check and parse response for next page and save data
      if(response.data.queries.nextPage)
      {
          googleSearch.hasNextPage = true;
          let nextPage = response.data.queries.nextPage[0];
          googleSearch.count = nextPage.count;
          googleSearch.startIndex = nextPage.startIndex;
      } 
      else
      {
          googleSearch.hasNextPage = false;
      }

      let recipes = [];
      if(response.data.items)
      {
          //parse the recipe data
          recipes = response.data.items.map(value => {
              let r = getRecipeData(value);
              if(r.image && r.name)
                return r;
          });
      }

      return {updatedSearch: googleSearch, recipes: recipes, totalResults: response.data.searchInformation.formattedTotalResults};
    }

    else {
      //request failed
      googleSearch.hasNextPage = false;
      return {updatedSearch: googleSearch, recipes: [], totalResults: undefined};
    }
}

/**
 * Get Recipe from Google with url
 * @param {Object} googleSearch Google Search state object
 */
const getRecipeFromGoogle = async function(url) {
    //call google api
    const response = await axios.get(`${GOOGLE_BASE_URL}&q=${url}&siteSearch=${url}`).catch((err) => {
      //must catch for vue to continue execution
      return err.response;
    });

    let recipes = [];
    if(response.data.items)
    {
        //parse the recipe data
        recipes = response.data.items.map(value => {
            return getRecipeData(value);
        });
    }

    return recipes[0];
}

/**
 * Get the users saved recipes from the API
 * @param {Object} googleUser The currently logged in google user
 */
const getSavedRecipes = async function(googleUser)
{
  const response = await axios.get(COOKBOOK_API_URL + '/api/Recipes', {headers: {Authorization: `Bearer ${googleUser.getAuthResponse().id_token}`}}).catch((err) => {
    //must catch for vue to continue execution
    return err.response;
  });
  return response;
}

/**
 * Save a recipe to the favorites of the current user
 * @param {Object} googleUser The currently logged in google user
 * @param {Object} recipe The recipe to save to the users favorites
 */
const addSavedRecipe = async function(googleUser, recipe)
{
  const response = await axios.put(COOKBOOK_API_URL + '/api/Recipes', recipe, {headers: {Authorization: `Bearer ${googleUser.getAuthResponse().id_token}`}}).catch((err) => {
    //must catch for vue to continue execution
    return err.response;
  });
  return response;
}

/**
 * Updates the saved recipe. Used when google data is downloaded that matches the saved url.
 * @param {Object} googleUser The currently logged in google user
 * @param {Object} recipe The recipe to update
 */
const updateSavedRecipe = async function(googleUser, url, recipe)
{
  const response = await axios.post(COOKBOOK_API_URL + `/api/Recipes?url=${url}`, recipe, {headers: {Authorization: `Bearer ${googleUser.getAuthResponse().id_token}`}}).catch((err) => {
    //must catch for vue to continue execution
    return err.response;
  });
  return response;
}

/**
 * Removes a recipe from the favorites of the current user
 * @param {Object} googleUser The currently logged in user
 * @param {Object} recipe The recipe to remove from the users favorites
 */
const deleteSavedRecipe = async function(googleUser, recipe)
{
  const response = await axios.delete(COOKBOOK_API_URL + `/api/Recipes?url=${recipe.url}`, {headers: {Authorization: `Bearer ${googleUser.getAuthResponse().id_token}`}}).catch((err) => {
    //must catch for vue to continue execution
    return err.response;
  });
  return response;
}

/**
 * Search recipes that user saved using search terms
 * @param {Object} googleUser The currently logged in user
 * @param {Object} searchTerms The search to use in user recipes
 */
const searchSavedRecipes = async function(googleUser, searchTerms)
{
  const response = await axios.get(COOKBOOK_API_URL + `/api/Recipes/Search?searchTerms=${searchTerms}`, {headers: {Authorization: `Bearer ${googleUser.getAuthResponse().id_token}`}}).catch((err) => {
    //must catch for vue to continue execution
    return err.response;
  });
  return response;
}

/**
 * Map the recipe data to a usable object
 * @param {Object} obj 
 */
const getRecipeData = function(value) {
  let r = {
      url: value.link,
      siteName: getPagemapVal(value.pagemap.metatags,"og:site_name"),
      name: getPagemapVal(value.pagemap.recipe,"name"),
      image: getPagemapVal(value.pagemap.cse_image,"src"),
      description: getPagemapVal(value.pagemap.metatags,"og:description"),
      ratingValue: getPagemapVal(value.pagemap.aggregaterating,"ratingvalue"),
      ratingCount: getPagemapVal(value.pagemap.aggregaterating,"ratingcount"),
      totalTime: getPagemapVal(value.pagemap.recipe,"totaltime")
  };
  return r;
}

/**
 * Safely get the requested child property value from an Array of objects
 * @param {Array} objArray 
 * @param {string} childProp 
 */
const getPagemapVal = function(objArray, childProp) {
    if(objArray === undefined)
      return undefined;

    let val = objArray.find(function(elm){
      return elm.hasOwnProperty(childProp);
    });

    if (val === undefined)
      return undefined;
    return val[childProp];
}

export const dataService = {
    getRecipesFromGoogle,
    getRecipeFromGoogle,
    getSavedRecipes,
    addSavedRecipe,
    updateSavedRecipe,
    deleteSavedRecipe,
    searchSavedRecipes
};