import axios from 'axios'
import {GOOGLE_BASE_URL} from './config'

/**
 * Get Recipes from Google with the given search parameters
 * @param {Object} googleSearch Google Search state object
 */
const getRecipesFromGoogle = async function(googleSearch) {
    //call google api
    const response = await axios.get(`${GOOGLE_BASE_URL}&q=${googleSearch.searchTerms}&num=${googleSearch.count}&start=${googleSearch.startIndex}`);
    
    //check parse response for next page and save data
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
        });
    }

    return {updatedSearch: googleSearch, recipes: recipes};
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
    getRecipesFromGoogle
};