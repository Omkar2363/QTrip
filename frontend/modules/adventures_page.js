
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  let params = new URLSearchParams(search);
  let city = params.get('city');
  return city;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data

  let url = config.backendEndpoint + `/adventures?city=${city}`;

  try{
    let resp = await fetch(url);
    let adventures = await resp.json();
    return adventures;
  }catch(error){
    return null;
  }


}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  let containerElement = document.getElementById("data");
  adventures.forEach((adventure) => {
    let adventureCard = createAdventureCard(adventure); 
    containerElement.appendChild(adventureCard);
  });
}


function createAdventureCard(adventure) {
  let {id, image, category, name, costPerHead, duration } = adventure;

  let divElement = document.createElement("div");
  divElement.className = "col-6 col-lg-3 mb-4";
  divElement.innerHTML = `<div class="card">
                            <a href="detail/?adventure=${id}" id=${id}>           
                                <div class="category-banner">${category}</div>
                                <div class="activity-card">
                                
                                <img class="img-responsive" src=${image} />
                                
                                  <div class="activity-card-text text-md-center w-100 mt-3 px-3">
                                    <div class="d-block d-md-flex justify-content-between flex-wrap pl-3 pr-3">
                                      <h5 class="text-left">${name}</h5>
                                      <p>\u20B9 ${costPerHead}</p>
                                    </div>
                                    <div class="d-block d-md-flex justify-content-between flex-wrap pl-3 pr-3">
                                      <h5 class="text-left">Duration</h5>
                                      <p>${duration}</p>
                                    </div>
                                  </div>
                                </div>      
                            </a>
                          </div>`;
  return divElement;
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  let filteredAdventures = list.filter(adventure => {
    if(adventure.duration >= low && adventure.duration <= high){
      return adventure;
    }
  })
  return filteredAdventures;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  let filteredAdventures = list.filter(adventure => {
    return categoryList.includes(adventure.category);
  })

  return filteredAdventures;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods

  let filteredList = list;
  
  // Apply duration filter if duration is provided
  if (filters.duration && filters.duration !== "") {
    const [low, high] = filters.duration.split("-").map(Number);
    filteredList = filterByDuration(filteredList, low, high);
  }
  
  // Apply category filter if category list is provided and not empty
  if (filters.category && filters.category.length > 0) {
    filteredList = filterByCategory(filteredList, filters.category);
  }

  return filteredList;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  localStorage.setItem("filters", JSON.stringify(filters));

  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object

  let filters = localStorage.getItem("filters")
  if(filters){
    return JSON.parse(filters);
  }

  // Place holder for functionality to work in the Stubs
  return null;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  
  
    // 1. Update duration filter with correct value
    const durationSelect = document.getElementById("duration-select");
    if (durationSelect && filters.duration) {
      durationSelect.value = filters.duration;
    }
  
    // 2. Update the category pills on the DOM
    const categoryList = document.getElementById("category-list");
    if (categoryList) {
      categoryList.innerHTML = ''; // Clear existing pills
  
      if (filters.category && Array.isArray(filters.category)) {
        filters.category.forEach(category => {
          const pill = document.createElement("div");
          pill.className = "category-filter";
          pill.textContent = category;
          categoryList.appendChild(pill);
        });
      }
    } 

}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
