document.addEventListener("DOMContentLoaded", async () => {
    // Authentication Check
    const currentUser = Store.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const isSmart = urlParams.get('smart');
    const container = document.getElementById("points-container");
    const smartContainer = document.getElementById("smart-recommendation");

    if(isSmart === 'true') {
        smartContainer.classList.remove('hidden');
        smartContainer.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center flex flex-col items-center justify-center">
                <i class="fa-solid fa-circle-notch fa-spin text-4xl text-festival-violet mb-4"></i>
                <p class="text-slate-600 font-medium">Analyzing distance, capacity, and crowd levels...</p>
            </div>`;
        
        const rec = await api.getRecommendation({});
        if(rec.recommendedSlot && rec.point) {
            smartContainer.innerHTML = `
                <div class="bg-gradient-to-r from-festival-violet to-festival-fuchsia rounded-2xl p-1 shadow-lg mb-8">
                    <div class="bg-white rounded-xl p-6 sm:p-8 relative overflow-hidden h-full">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-festival-fuchsia opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        
                        <h3 class="text-festival-violet font-bold flex items-center gap-2 mb-2 tracking-wide uppercase text-sm">
                            <i class="fa-solid fa-star"></i> Recommended for You
                        </h3>
                        <h2 class="text-3xl font-extrabold text-festival-slate mb-1">${rec.point.name}</h2>
                        <p class="text-lg text-slate-600 font-medium mb-4 flex items-center gap-2"><i class="fa-regular fa-clock text-festival-fuchsia"></i> ${rec.recommendedSlot.time}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-6">
                            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200"><i class="fa-solid fa-users"></i> LOW CROWD</span>
                            <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1 border border-slate-200"><i class="fa-solid fa-location-dot"></i> ${rec.point.distance} away</span>
                        </div>
                        
                        <div class="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
                            <p class="font-bold text-slate-700 mb-2">Why this slot?</p>
                            <ul class="space-y-1">
                                <li class="text-sm text-slate-600 flex items-center gap-2"><i class="fa-solid fa-check text-green-500"></i> High availability</li>
                                <li class="text-sm text-slate-600 flex items-center gap-2"><i class="fa-solid fa-check text-green-500"></i> Suitable for your group</li>
                                <li class="text-sm text-slate-600 flex items-center gap-2"><i class="fa-solid fa-check text-green-500"></i> Within preferred time</li>
                            </ul>
                        </div>
                        
                        <a href="booking.html?point=${rec.point.id}&slot=${rec.recommendedSlot.id}" class="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 bg-festival-gradient text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 gap-2">
                            <i class="fa-solid fa-ticket"></i> Select This Slot
                        </a>
                    </div>
                </div>
            `;
        }
    }

    const festId = parseInt(urlParams.get('festival')) || 1;
    let points = [];
    try {
        points = await api.getPoints(festId); 
    } catch (e) {
        container.innerHTML = `<p class="col-span-full text-center text-red-500">Error loading points.</p>`;
        return;
    }
    
    const allSlots = Store.getSlots();
    container.innerHTML = '';
    
    if(points.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-slate-500 py-10">No points found for this festival.</p>`;
        return;
    }

    points.forEach((point, index) => {
        // Aggregate exact capacity from slots
        const pointSlots = allSlots.filter(s => s.point === point.id);
        if (pointSlots.length > 0) {
            point.capacity = pointSlots.reduce((sum, s) => sum + s.capacityTotal, 0);
            point.occupancy = point.capacity - pointSlots.reduce((sum, s) => sum + s.capacityRemaining, 0);
            
            const occupancyRate = point.capacity > 0 ? (point.occupancy / point.capacity) : 0;
            if (occupancyRate > 0.8) point.crowdLevel = 'High';
            else if (occupancyRate > 0.5) point.crowdLevel = 'Moderate';
            else point.crowdLevel = 'Low';
        } else {
            point.capacity = 0;
            point.occupancy = 0;
            point.crowdLevel = 'Low';
        }

        container.insertAdjacentHTML('beforeend', pointTemplate(point, index));
    });
});

function pointTemplate(point, index) {
    let badgeClass = 'bg-green-100 text-green-700 border-green-200';
    let progressClass = 'bg-green-500';
    if(point.crowdLevel === 'Moderate') { 
        badgeClass = 'bg-orange-100 text-orange-700 border-orange-200'; 
        progressClass = 'bg-orange-500'; 
    }
    if(point.crowdLevel === 'High') { 
        badgeClass = 'bg-red-100 text-red-700 border-red-200'; 
        progressClass = 'bg-red-500'; 
    }
    
    const pct = point.capacity > 0 ? Math.floor((point.occupancy / point.capacity) * 100) : 0;
    const remaining = point.capacity - point.occupancy;
    const delay = index * 100;

    return `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-t-4 border-t-festival-violet" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-festival-slate leading-tight flex items-center gap-2">
                    <i class="fa-solid fa-location-dot text-festival-fuchsia"></i> ${point.name}
                </h3>
                <span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md shrink-0 whitespace-nowrap">${point.distance}</span>
            </div>
            
            <div class="flex justify-between items-center mb-2">
                <span class="px-2 py-1 rounded-full text-xs font-bold border ${badgeClass}">${point.crowdLevel.toUpperCase()}</span>
                <span class="text-sm font-bold text-slate-700">${pct}% occupied</span>
            </div>
            
            <div class="w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden flex">
                <div class="${progressClass} h-2.5 rounded-full transition-all duration-1000 ease-out" style="width: ${pct}%"></div>
            </div>
            
            <p class="text-xs font-semibold text-slate-500 text-center mb-6">Remaining: ${remaining} / ${point.capacity}</p>
            
            <div id="slots-for-${point.id}" class="mt-auto">
                <button class="w-full py-2.5 px-4 border-2 border-festival-violet text-festival-violet rounded-lg font-bold hover:bg-festival-violet hover:text-white transition-colors" onclick="loadSlots(${point.id})">
                    View Available Slots
                </button>
            </div>
        </div>
    `;
}

window.loadSlots = async function(pointId) {
    const slotContainer = document.getElementById(`slots-for-${pointId}`);
    const allSlots = Store.getSlots();
    const slots = allSlots.filter(s => s.point === pointId);
    
    const availableSlots = slots.filter(s => s.capacityRemaining > 0);
    if (slots.length === 0 || availableSlots.length === 0) {
        slotContainer.innerHTML = `
            <div class="mt-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center">
                <i class="fa-solid fa-calendar-xmark text-3xl text-slate-400 mb-2"></i>
                <p class="text-sm font-medium text-slate-500">No slots currently available at this location.</p>
            </div>
        `;
        return;
    }

    let html = '<div class="mt-4 flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">';
    slots.forEach(slot => html += slotTemplate(slot, pointId));
    html += '</div>';
    
    slotContainer.innerHTML = html;
};

function slotTemplate(slot, pointId) {
    const isFull = slot.capacityRemaining <= 0;
    const badgeColor = isFull ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200';
    const pct = slot.capacityTotal > 0 ? Math.floor(((slot.capacityTotal - slot.capacityRemaining) / slot.capacityTotal) * 100) : 0;
    
    return `
        <div class="flex items-center justify-between p-3 rounded-lg border ${isFull ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-festival-violet/30 hover:border-festival-violet hover:shadow-md'} transition-all">
            <div>
                <div class="font-bold text-slate-800">${slot.time}</div>
                <div class="flex items-center gap-2 mt-1">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}">
                        ${isFull ? 'FULL' : 'AVAILABLE'} • ${pct}%
                    </span>
                    <span class="text-xs text-slate-500 font-semibold">${slot.capacityRemaining}/${slot.capacityTotal} left</span>
                </div>
            </div>
            <div>
                <a href="${isFull ? '#' : 'booking.html?point=' + pointId + '&slot=' + slot.id}" 
                   class="px-4 py-2 rounded-lg font-bold text-sm transition-all ${isFull ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-festival-gradient text-white hover:shadow-lg hover:scale-105'}">
                   ${isFull ? 'Waitlist' : 'Select'}
                </a>
            </div>
        </div>
    `;
}
