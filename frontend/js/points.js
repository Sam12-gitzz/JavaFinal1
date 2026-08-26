document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isSmart = urlParams.get('smart');
    const container = document.getElementById("points-container");
    const smartContainer = document.getElementById("smart-recommendation");

    // Handling the Smart "Find Best Slot" Prototype Logic
    if(isSmart === 'true') {
        smartContainer.style.display = "block";
        smartContainer.innerHTML = "<p>Analyzing distance, capacity, and crowd levels...</p>";
        
        const rec = await api.getRecommendation({});
        smartContainer.innerHTML = `
            <div class="card" style="border: 2px solid var(--success); background: #ecfdf5;">
                <h3 class="mb-1" style="color: var(--success);"><i class="fa-solid fa-star"></i> Recommended for You</h3>
                <p><strong>${rec.point.name}</strong> | ${rec.recommendedSlot.time}</p>
                <p class="mb-1">Reason: ${rec.reason}</p>
                <a href="booking.html?point=${rec.point.id}&slot=${rec.recommendedSlot.id}" class="btn btn-success">Book This Slot</a>
            </div>
        `;
    }

    // Load regular points
    const points = await api.getPoints(1); // Defaulting to festival 1 for prototype
    
    points.forEach(point => {
        // Determine badge color for crowd logic
        let badgeClass = 'badge-success';
        if(point.crowdLevel === 'Moderate') badgeClass = 'badge-warning';
        if(point.crowdLevel === 'High') badgeClass = 'badge-danger';

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="flex flex-between align-center mb-1">
                <h3>${point.name}</h3>
                <span class="badge ${badgeClass}">${point.crowdLevel} Crowd</span>
            </div>
            <p style="color:#64748b;"><i class="fa-solid fa-location-dot"></i> ${point.location} (approx ${point.distance})</p>
            <p class="mb-1"><strong>Occupancy:</strong> ${point.occupancy} / ${point.capacity}</p>
            
            <div class="mt-1" id="slots-for-${point.id}">
                <button class="btn btn-secondary btn-block" onclick="loadSlots(${point.id})">View Available Slots</button>
            </div>
        `;
        container.appendChild(card);
    });
});

// Globally exposed function to load slots dynamically when button is clicked
window.loadSlots = async function(pointId) {
    const slotContainer = document.getElementById(`slots-for-${pointId}`);
    slotContainer.innerHTML = "<p>Loading slots...</p>";
    
    const slots = await api.getSlots(pointId);
    
    let html = '<div class="mt-1" style="display:flex; flex-direction:column; gap:10px;">';
    
    slots.forEach(slot => {
        const isFull = slot.status === 'Full';
        const statusColor = isFull ? 'var(--danger)' : 'var(--success)';
        const remaining = slot.max - slot.booked;
        
        html += `
            <div style="border: 1px solid var(--border); padding: 12px; border-radius: var(--radius); display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${slot.time}</strong><br>
                    <small style="color:${statusColor}; font-weight:600;">${slot.status} (${remaining} left)</small>
                </div>
                <a href="${isFull ? '#' : 'booking.html?point=' + pointId + '&slot=' + slot.id}" 
                   class="btn ${isFull ? 'btn-outline' : 'btn-primary'}" 
                   ${isFull ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                   ${isFull ? 'Waitlist' : 'Book'}
                </a>
            </div>
        `;
    });
    html += '</div>';
    slotContainer.innerHTML = html;
};
