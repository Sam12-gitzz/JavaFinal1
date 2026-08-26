document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("festivals-container");
    container.innerHTML = "<p>Loading festivals...</p>";

    // Fetch mock data from our api.js
    const festivals = await api.getFestivals();
    container.innerHTML = "";

    festivals.forEach(fest => {
        const card = document.createElement("div");
        card.className = "card card-festival";
        
        const badgeClass = fest.status === 'Active' ? 'badge-success' : 'badge-warning';
        const imgUrl = fest.id === 1 
            ? "https://images.unsplash.com/photo-1600084534484-9dfc29c54e26?auto=format&fit=crop&w=600&q=80" 
            : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80";
        
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${imgUrl}" alt="${fest.name}" class="card-img">
                <div style="position: absolute; top: 15px; right: 15px;">
                    <span class="badge ${badgeClass}"><i class="fa-solid fa-bolt"></i> ${fest.status}</span>
                </div>
            </div>
            <div class="card-festival-body">
                <h3 class="mb-1">${fest.name}</h3>
                <p class="mb-1" style="font-size: 0.9rem;"><i class="fa-regular fa-calendar" style="color: var(--secondary);"></i> ${fest.date}</p>
                <p class="mb-2 flex-1">${fest.desc}</p>
                <div class="flex flex-between align-center mt-auto">
                    <span style="font-weight: 500; font-size: 0.9rem;"><i class="fa-solid fa-location-dot" style="color: var(--secondary);"></i> ${fest.pointsCount} Points</span>
                    <a href="points.html?festival=${fest.id}" class="btn btn-outline">Explore <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
});
