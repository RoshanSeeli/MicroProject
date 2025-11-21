let destinations = [];

function addDestination() {
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('dest-date').value;
    const time = document.getElementById('time').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!destination) {
        alert('Please enter a destination');
        return;
    }
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Simple date validation - check if destination date is after end date
    if (endDate && date > endDate) {
        alert('Destination date cannot be after trip end date');
        return;
    }
    
    destinations.push({ 
        name: destination, 
        date: date,
        time: time || '12:00' 
    });
    
    // Sort destinations by date, then by time
    destinations.sort(function(a, b) {
        if (a.date === b.date) {
            return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
    });
    
    updateDisplay();
    document.getElementById('destination').value = '';
    document.getElementById('dest-date').value = '';
    document.getElementById('time').value = '';
}

function updateDisplay() {
    const list = document.getElementById('destination-list');
    const timeline = document.getElementById('timeline-view');
    const tripName = document.getElementById('trip-name').value || 'My Travel Itinerary';
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
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
    
    if (destinations.length === 0) {
        listHTML += '<p class="no-destinations">No destinations added yet</p>';
    }
    
    listHTML += `
        <div class="print-footer">
            <hr>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Travel Planner - Karunya Institute</p>
        </div>`;
    
    list.innerHTML = listHTML;
    
    let timelineHTML = '';
    for (let i = 0; i < destinations.length; i++) {
        timelineHTML += `<div class="timeline-item">
            <h4>Stop ${i + 1}: ${destinations[i].name}</h4>
            <p>Date: ${destinations[i].date} | Time: ${destinations[i].time}</p>
        </div>`;
    }
    timeline.innerHTML = timelineHTML;
    
    updateMap();
}

function updateMap() {
    const mapContainer = document.querySelector('.map-placeholder');
    
    if (destinations.length === 0) {
        mapContainer.innerHTML = '<p>Add destinations to see route visualization</p>';
        return;
    }
    
    let mapHTML = '<div class="route-map">';
    for (let i = 0; i < destinations.length; i++) {
        mapHTML += `<div class="route-point">
            <div class="point-marker">${i + 1}</div>
            <div class="point-name">${destinations[i].name}</div>
        </div>`;
        
        if (i < destinations.length - 1) {
            mapHTML += '<div class="route-line"></div>';
        }
    }
    mapHTML += '</div>';
    
    mapContainer.innerHTML = mapHTML;
}

function removeDestination(index) {
    destinations.splice(index, 1);
    updateDisplay();
}
