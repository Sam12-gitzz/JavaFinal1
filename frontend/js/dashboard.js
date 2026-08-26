document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("festivals-container");
    container.innerHTML = "<p>Loading festivals...</p>";

    // Fetch mock data from our api.js
    const festivals = await api.getFestivals();
    container.innerHTML = "";

    festivals.forEach(fest => {
        const card = document.createElement("div");
        card.className = "card";
        
        // Decide badge color based on status
        const badgeClass = fest.status === 'Active' ? 'badge-success' : 'badge-warning';
        
        card.innerHTML = `
            <div class="flex flex-between align-center mb-1">
                <h3>${fest.name}</h3>
                <span class="badge ${badgeClass}">${fest.status}</span>
            </div>
            <p class="mb-1" style="color:#64748b;"><i class="fa-regular fa-calendar"></i> ${fest.date}</p>
            <p class="mb-1">${fest.desc}</p>
            <p class="mb-2"><strong>${fest.pointsCount}</strong> Immersion Points</p>
            <a href="points.html?festival=${fest.id}" class="btn btn-outline btn-block">View Points</a>
        `;
        container.appendChild(card);
    });
});
