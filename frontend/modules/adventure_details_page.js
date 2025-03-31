import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  let urlParams = new URLSearchParams(search); 
  if (urlParams) {
    return urlParams.get("adventure"); 
  }
  // Place holder for functionality to work in the Stubs
  return null;
}

//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  let url = `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`;

  try {
    let adventuresResponse = await fetch(url);
    let adventuresText = await adventuresResponse.text(); 
    let adventureDetails = adventuresText ? JSON.parse(adventuresText) : null; 

    return adventureDetails; 
  } catch (error) {
    return null; 
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
    
  function setInnerHTML(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = content;
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }

  // Set adventure name
  setInnerHTML("adventure-name", adventure.name);

  // Set adventure subtitle
  setInnerHTML("adventure-subtitle", adventure.subtitle);

  // Set adventure content
  setInnerHTML("adventure-content", adventure.content);

  // Add images to photo gallery
  const photoGallery = document.getElementById("photo-gallery");
  if (photoGallery && adventure.images && adventure.images.length > 0) {
    adventure.images.forEach(image => {
      let div = document.createElement("div");
      let img = document.createElement("img");
      img.src = image;
      img.className = "activity-card-image";
      div.appendChild(img);
      photoGallery.appendChild(div);
    });
  }
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images

  let photoGallery = document.getElementById("photo-gallery");
  
  // Create the main carousel structure
  let carouselHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        ${images.map((_, index) => `
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" 
            ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}">
          </button>
        `).join('')}
      </div>
      <div class="carousel-inner">
        ${images.map((image, index) => `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${image}" class="d-block w-100" alt="Adventure image ${index + 1}">
          </div>
        `).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;

  // Set the HTML content of the photo-gallery element
  photoGallery.innerHTML = carouselHTML;
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  const availablePanel = document.getElementById("reservation-panel-available");
  const soldOutPanel = document.getElementById("reservation-panel-sold-out");
  const reservationPersonCost = document.getElementById("reservation-person-cost");
  
  if (adventure.available) {
    availablePanel.style.display = "block";
    soldOutPanel.style.display = "none";
    
    // Set the cost per head in the reservation panel
    if (reservationPersonCost) {
      reservationPersonCost.innerHTML = adventure.costPerHead;
    }
  } else {
    availablePanel.style.display = "none";
    soldOutPanel.style.display = "block";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  const totalCost = adventure.costPerHead * persons;
  document.getElementById("reservation-cost").innerHTML = totalCost;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  const form = document.getElementById("myForm");
  
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    // Get form values
    const name = form.elements.name.value;
    const date = form.elements.date.value;
    const person = form.elements.person.value;
    
    // Prepare data for API call
    const data = {
      name: name,
      date: date,
      person: person,
      adventure: adventure.id
    };
    
    try {
      // Make POST API call
      const response = await fetch(`${config.backendEndpoint}/reservations/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert("Success!");
        window.location.reload();
      } else {
        alert("Failed!");
      }
    } catch (error) {
      alert("Failed!");
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  const reservedBanner = document.getElementById("reserved-banner");
  
  if (adventure.reserved) {
    reservedBanner.style.display = "block";
  } else {
    reservedBanner.style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};