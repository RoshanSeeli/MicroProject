// Array to store all destinations added by user
let destinations = [];

// Run this code when the webpage finishes loading
window.addEventListener('DOMContentLoaded', function() {
    // Get today's date in YYYY-MM-DD format (required by HTML date inputs)
    // new Date() = current date/time, toISOString() = converts to "2024-12-18T09:00:25.123Z"
    // split('T')[0] = takes only the date part "2024-12-18"
    const today = new Date().toISOString().split('T')[0];
    
    // Set minimum selectable date to today for all date input fields
    document.getElementById('start-date').min = today;
    document.getElementById('end-date').min = today;
    document.getElementById('dest-date').min = today;
    
    // Add event listener to check start date when user changes it
    document.getElementById('start-date').addEventListener('change', function() {
        // If selected date is before today, show alert and clear the field
        if (this.value < today) {
            alert('Cannot select a start date before today');
            this.value = ''; // Clear the invalid date
        }
    });
});

// Function called when user clicks "Add" button
function addDestination() {
    // Get values from input fields
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('dest-date').value;
    const time = document.getElementById('time').value;
    const endDate = document.getElementById('end-date').value;
    
    // Check if destination name is entered
    if (!destination) {
        alert('Please enter a destination');
        return; // Stop function execution
    }
    
    // Check if date is selected
    if (!date) {
        alert('Please select a date');
        return; // Stop function execution
    }
    
    // Date validation - get today's date for comparison
    const today = new Date().toISOString().split('T')[0];
    
    // Create date one year from now for maximum date limit
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1); // Add 1 year
    const maxDate = oneYearFromNow.toISOString().split('T')[0];
    
    // Check if selected date is in the past
    if (date < today) {
        alert('Cannot select a date before today');
        return;
    }
    
    // Check if selected date is more than one year in future
    if (date > maxDate) {
        alert('Cannot plan trips more than one year in advance');
        return;
    }
    
    // Check if destination date is after trip end date (if end date is set)
    if (endDate && date > endDate) {
        alert('Destination date cannot be after trip end date');
        return;
    }
    
    // Add new destination to the destinations array
    destinations.push({ 
        name: destination, 
        date: date,
        time: time || '12:00' // Use entered time or default to 12:00
    });
    
    // Sort destinations by date first, then by time if dates are same
    destinations.sort(function(a, b) {
        if (a.date === b.date) {
            return a.time.localeCompare(b.time); // Compare times alphabetically
        }
        return a.date.localeCompare(b.date); // Compare dates alphabetically
    });
    
    // Update the display to show new destination
    updateDisplay();
    
    // Clear input fields after adding destination
    document.getElementById('destination').value = '';
    document.getElementById('dest-date').value = '';
    document.getElementById('time').value = '';
}

// Function to update the display with current destinations
function updateDisplay() {
    // Get HTML elements where we'll display the destinations
    const list = document.getElementById('destination-list');
    const timeline = document.getElementById('timeline-view');
    
    // Get trip details from input fields
    const tripName = document.getElementById('trip-name').value || 'My Travel Itinerary';
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    // Build HTML string for the destination list
    let listHTML = `
        <div class="print-header">
            <h1>${tripName}</h1>
            <p class="trip-dates">${startDate ? 'From: ' + startDate : ''} ${endDate ? 'To: ' + endDate : ''}</p>
            <hr>
        </div>
        <div class="itinerary-details">
            <h2>Travel Itinerary</h2>   
            <p><strong>Total Destinations:</strong> ${destinations.length}</p>
        </div>`;
    
    // Loop through each destination and create HTML for it
    for (let i = 0; i < destinations.length; i++) {
        listHTML += `<li class="destination-item print-item">
            <div class="destination-number">${i + 1}</div>
            <div class="destination-details">
                <strong>${destinations[i].name}</strong>
                <div class="arrival-time">Date: ${destinations[i].date} | Time: ${destinations[i].time}</div>
            </div>
            <button onclick="removeDestination(${i})">Remove</button>
        </li>`;
    }
    
    // Show message if no destinations added yet
    if (destinations.length === 0) {
        listHTML += '<p class="no-destinations">No destinations added yet</p>';
    }
    
    // Add footer with current date
    listHTML += `
        <div class="print-footer">
            <hr>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Travel Planner - Karunya Institute</p>
        </div>`;
    
    // Put the HTML into the destination list element
    list.innerHTML = listHTML;
    
    // Build HTML for timeline view
    let timelineHTML = '';
    for (let i = 0; i < destinations.length; i++) {
        timelineHTML += `<div class="timeline-item">
            <h4>Stop ${i + 1}: ${destinations[i].name}</h4>
            <p>Date: ${destinations[i].date} | Time: ${destinations[i].time}</p>
        </div>`;
    }
    // Put the HTML into the timeline element
    timeline.innerHTML = timelineHTML;
    
    // Update the map display
    updateMap();
}

// Function to update the map/route display
function updateMap() {
    // Get the map container element
    const mapContainer = document.querySelector('.map-placeholder');
    
    // If no destinations, show message
    if (destinations.length === 0) {
        mapContainer.innerHTML = '<p>Add destinations to see route visualization</p>';
        return; // Exit function
    }
    
    // Build HTML for route visualization
    let mapHTML = '<div class="route-map">';
    
    // Loop through destinations to create route points
    for (let i = 0; i < destinations.length; i++) {
        mapHTML += `<div class="route-point">
            <div class="point-marker">${i + 1}</div>
            <div class="point-name">${destinations[i].name}</div>
        </div>`;
        
        // Add connecting line between destinations (except after last one)
        if (i < destinations.length - 1) {
            mapHTML += '<div class="route-line"></div>';
        }
    }
    mapHTML += '</div>';
    
    // Put the HTML into the map container
    mapContainer.innerHTML = mapHTML;
}

// Function to remove a destination from the list
function removeDestination(index) {
    // Remove destination at specified index from array
    // splice(index, 1) means: starting at 'index', remove 1 item
    destinations.splice(index, 1);
    
    // Update the display to reflect the removal
    updateDisplay();
}

// Function to handle star rating
function rate(stars) {
    // Show thank you message with rating
    document.getElementById('rating-message').textContent = `Thank you for rating ${stars} star${stars > 1 ? 's' : ''}!`;
}

/*
=== TRAVEL PLANNER ALGORITHM OVERVIEW ===

1. INITIALIZATION:
   - Create empty destinations array
   - Set minimum date to today for all date inputs
   - Add event listener for start date validation

2. ADD DESTINATION ALGORITHM:
   - Get input values (destination, date, time)
   - Validate inputs:
     * Check if destination name exists
     * Check if date is selected
     * Check if date is not in past
     * Check if date is within one year
     * Check if date is before trip end date
   - Add destination to array with default time if not provided
   - Sort destinations by date, then by time
   - Update display and clear input fields

3. UPDATE DISPLAY ALGORITHM:
   - Get trip details from input fields
   - Build HTML string for destination list:
     * Add header with trip name and dates
     * Loop through destinations and create list items
     * Add footer with generation date
   - Build timeline HTML with destination details
   - Update map visualization

4. UPDATE MAP ALGORITHM:
   - Check if destinations exist
   - If empty, show placeholder message
   - If destinations exist:
     * Loop through destinations
     * Create route points with markers
     * Add connecting lines between points

5. REMOVE DESTINATION ALGORITHM:
   - Use splice() to remove destination at given index
   - Update display to reflect changes

6. RATING ALGORITHM:
   - Accept star rating (1-5)
   - Display thank you message with rating count

7. DATE HANDLING ALGORITHM:
   - Convert JavaScript Date to ISO string
   - Split at 'T' to get date part only
   - Use for HTML date input compatibility

8. SORTING ALGORITHM:
   - Primary sort: by date (chronological)
   - Secondary sort: by time (if same date)
   - Use localeCompare() for string comparison

TIME COMPLEXITY: O(n log n) for sorting, O(n) for display updates
SPACE COMPLEXITY: O(n) for storing destinations
*/
