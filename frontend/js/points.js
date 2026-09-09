document.addEventListener("DOMContentLoaded", async () => {
    // 1. Authentication Check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const isSmart = urlParams.get('smart');
    const container = document.getElementById("points-container");
    const smartContainer = document.getElementById("smart-recommendation");

    if(isSmart === 'true') {
        smartContainer.style.display = "block";
        smartContainer.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <i class="fa-solid fa-circle-notch fa-spin fa-3x" style="color: var(--primary);"></i>
                <p class="mt-1">Analyzing distance, capacity, and crowd levels...</p>
            </div>`;
        
        const rec = await api.getRecommendation({});
        smartContainer.innerHTML = `
            <div class="card smart-card mb-2">
                <h3 class="mb-1" style="color: var(--primary); display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-star"></i> Recommended for You
                </h3>
                <h2 style="font-size:1.5rem; margin-bottom:5px;">${rec.point.name}</h2>
                <p class="mb-1" style="font-size:1.1rem; color: var(--text-primary);"><i class="fa-regular fa-clock"></i> ${rec.recommendedSlot.time}</p>
                
                <div class="flex gap-1 mb-1">
                    <span class="badge badge-low"><i class="fa-solid fa-users"></i> LOW CROWD</span>
                    <span class="badge" style="background:var(--border); color:var(--text-secondary);"><i class="fa-solid fa-location-dot"></i> ${rec.point.distance} away</span>
                </div>
                
                <div class="mt-2 mb-2" style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: var(--radius-sm);">
                    <p style="font-weight:600; margin-bottom:5px;">Why this slot?</p>
                    <p style="margin-bottom:2px;"><i class="fa-solid fa-check" style="color:var(--success);"></i> High availability</p>
                    <p style="margin-bottom:2px;"><i class="fa-solid fa-check" style="color:var(--success);"></i> Suitable for your group</p>
                    <p><i class="fa-solid fa-check" style="color:var(--success);"></i> Within preferred time</p>
                </div>
                
                <a href="booking.html?point=${rec.point.id}&slot=${rec.recommendedSlot.id}" class="btn btn-primary"><i class="fa-solid fa-ticket"></i> Select This Slot</a>
            </div>
        `;
    }

    const festId = parseInt(urlParams.get('festival')) || 1;
    const points = await api.getPoints(festId); 
    const allSlots = Store.getSlots();
    
    points.forEach(point => {
        // Aggregate exact capacity from slots
        const pointSlots = allSlots.filter(s => s.point === point.id);
        if (pointSlots.length > 0) {
            point.capacity = pointSlots.reduce((sum, s) => sum + s.capacityTotal, 0);
            point.occupancy = point.capacity - pointSlots.reduce((sum, s) => sum + s.capacityRemaining, 0);
            
            // Dynamic Crowd Level
            const occupancyRate = point.capacity > 0 ? (point.occupancy / point.capacity) : 0;
            if (occupancyRate > 0.8) point.crowdLevel = 'High';
            else if (occupancyRate > 0.5) point.crowdLevel = 'Moderate';
            else point.crowdLevel = 'Low';
        } else {
            point.capacity = 0;
            point.occupancy = 0;
            point.crowdLevel = 'Low';
        }

        let badgeClass = 'badge-low';
        let progressClass = 'bg-low';
        if(point.crowdLevel === 'Moderate') { badgeClass = 'badge-moderate'; progressClass = 'bg-moderate'; }
        if(point.crowdLevel === 'High') { badgeClass = 'badge-high'; progressClass = 'bg-high'; }
        
        const pct = point.capacity > 0 ? Math.floor((point.occupancy / point.capacity) * 100) : 0;

        const card = document.createElement("div");
        card.className = "card";
        card.style.borderTop = "4px solid var(--secondary)";
        card.innerHTML = `
            <div class="flex flex-between align-center mb-1">
                <h3 style="font-size:1.3rem;"><i class="fa-solid fa-location-dot" style="color: var(--secondary);"></i> ${point.name}</h3>
                <span style="font-size:0.9rem; color:var(--text-secondary); font-weight:500;">${point.distance} away</span>
            </div>
            
            <div class="flex flex-between align-center mt-2 mb-1">
                <span class="badge ${badgeClass}">${point.crowdLevel}</span>
                <span style="font-weight:600; font-size:0.9rem;">${pct}% occupied</span>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar ${progressClass}" style="width: ${pct}%;"></div>
            </div>
            <p class="mb-2 text-center" style="font-size:0.85rem;">Remaining: ${point.capacity - point.occupancy} / ${point.capacity}</p>
            
            <div id="slots-for-${point.id}">
                <button class="btn btn-outline btn-block" onclick="loadSlots(${point.id})">View Available Slots</button>
            </div>
        `;
        container.appendChild(card);
    });
});

window.loadSlots = async function(pointId) {
    const slotContainer = document.getElementById(`slots-for-${pointId}`);
    
    // Fetch slots from our shared localStorage Store
    const allSlots = Store.getSlots();
    const slots = allSlots.filter(s => s.point === pointId);
    
    // Empty / Error State for Slots
    const availableSlots = slots.filter(s => s.capacityRemaining > 0);
    if (slots.length === 0 || availableSlots.length === 0) {
        slotContainer.innerHTML = `
            <div class="mt-2 text-center" style="padding: 25px 15px; background: var(--bg-warm); border-radius: var(--radius-sm); border: 2px dashed var(--border);">
                <i class="fa-solid fa-calendar-xmark fa-2x mb-1" style="color: var(--text-secondary); opacity: 0.6;"></i>
                <p style="color: var(--text-secondary); font-weight: 500;">No slots currently available at this location.</p>
            </div>
        `;
        return;
    }

    let html = '<div class="mt-2" style="display:flex; flex-direction:column; gap:12px;">';
    
    slots.forEach(slot => {
        const isFull = slot.capacityRemaining <= 0;
        const cardClass = isFull ? 'slot-full' : 'slot-selected'; 
        const badgeColor = isFull ? 'badge-full' : 'badge-low';
        const remaining = slot.capacityRemaining;
        const pct = slot.capacityTotal > 0 ? Math.floor(((slot.capacityTotal - slot.capacityRemaining) / slot.capacityTotal) * 100) : 0;
        
        // Show live "X/100 filled" computed from capacityRemaining
        html += `
            <div class="slot-card ${isFull ? 'slot-full' : ''}">
                <div style="flex:1;">
                    <div style="font-weight:600; font-size:1.1rem; color: var(--text-primary); margin-bottom:4px;">${slot.time}</div>
                    <div class="flex align-center gap-1">
                        <span class="badge ${badgeColor}" style="padding:2px 8px; font-size:0.7rem;">${isFull ? 'FULL' : 'AVAILABLE'} • ${pct}% filled</span>
                        <span style="font-size:0.85rem; color: var(--text-secondary);">${remaining}/${slot.capacityTotal} left</span>
                    </div>
                </div>
                <div>
                    <a href="${isFull ? '#' : 'booking.html?point=' + pointId + '&slot=' + slot.id}" 
                       class="btn ${isFull ? 'btn-secondary' : 'btn-primary'}" 
                       style="${isFull ? 'opacity:0.7; box-shadow:none;' : 'padding: 8px 16px;'}">
                       ${isFull ? 'Waitlist' : 'Select'}
                    </a>
                </div>
            </div>
        `;
    });
    html += '</div>';
    slotContainer.innerHTML = html;
};
