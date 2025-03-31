import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them
  try {
    const response = await fetch(`${config.backendEndpoint}/reservations/`);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table

  //Conditionally render the no-reservation-banner and reservation-table-parent
  const tableParent = document.getElementById("reservation-table-parent");
  const noBanner = document.getElementById("no-reservation-banner");
  const table = document.getElementById("reservation-table");
  
  // Check if reservations array is empty
  if (!reservations || reservations.length === 0) {
    tableParent.style.display = "none";
    noBanner.style.display = "block";
    return;
  } else {
    tableParent.style.display = "block";
    noBanner.style.display = "none";
  }

  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */

  // Clear the table first
  table.innerHTML = '';
  
  // Format date as D/MM/YYYY (en-IN)
  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', options);
  }
  
  // Format time as "4 November 2020, 9:32:31 pm"
  function formatTime(timeString) {
    const date = new Date(timeString);
    
    // Format the date part "4 November 2020"
    const day = date.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    // Format the time part "9:32:31 pm"
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Combine in the exact format expected by the test
    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  // Add each reservation to the table
  reservations.forEach(reservation => {
    const row = document.createElement('tr');
    
    // Create cell for the "Visit Adventure" button
    const buttonCell = document.createElement('td');
    const button = document.createElement('div');
    button.className = "reservation-visit-button";
    button.id = reservation.id;
    
    // Create anchor link for the button
    const link = document.createElement('a');
    link.href = `../detail/?adventure=${reservation.adventure}`;
    link.textContent = "Visit Adventure";
    button.appendChild(link);
    buttonCell.appendChild(button);
    
    // Add all cells to the row
    row.innerHTML = `
      <td>${buttonCell.innerHTML}</td>
      <td>${reservation.name}</td>
      <td>${reservation.adventureName}</td>
      <td>${reservation.person}</td>
      <td>${formatDate(reservation.date)}</td>
      <td>${reservation.price}</td>
      <td>${formatTime(reservation.time)}</td>
    `;
    
    // Add the row to the table
    table.appendChild(row);
  });
}

export { fetchReservations, addReservationToTable };