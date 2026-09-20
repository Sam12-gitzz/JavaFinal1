document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("festivals-container");
    
    try {
        const festivals = await api.getFestivals();
        container.innerHTML = "";
        
        if(festivals.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center text-slate-500 py-10">No festivals found.</p>`;
            return;
        }

        festivals.forEach((fest, index) => {
            container.insertAdjacentHTML('beforeend', cardTemplate(fest, index));
        });
    } catch(err) {
        container.innerHTML = `<p class="col-span-full text-center text-red-500 py-10">Error loading festivals.</p>`;
    }
});

function cardTemplate(fest, index) {
    const badgeColor = fest.status === 'Active' 
        ? 'bg-green-100 text-green-700 border-green-200' 
        : 'bg-orange-100 text-orange-700 border-orange-200';
        
    const imgUrl = fest.id === 1 
        ? "images/ganesh-visarjan.jpg" 
        : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80";
        
    const delay = index * 100;

    return `
        <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col group" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="relative h-48 overflow-hidden bg-slate-200">
                <img src="${imgUrl}" alt="${fest.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute top-4 right-4">
                    <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm flex items-center gap-1 ${badgeColor} backdrop-blur-md bg-opacity-90">
                        <i class="fa-solid fa-bolt"></i> ${fest.status}
                    </span>
                </div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-festival-slate mb-2 group-hover:text-festival-violet transition-colors">${fest.name}</h3>
                <p class="text-slate-500 text-sm font-medium mb-3 flex items-center gap-2">
                    <i class="fa-regular fa-calendar text-festival-secondary text-festival-fuchsia"></i> ${fest.date}
                </p>
                <p class="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">${fest.desc}</p>
                
                <div class="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                    <span class="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <i class="fa-solid fa-location-dot text-festival-orange"></i> ${fest.pointsCount} Points
                    </span>
                    <a href="points.html?festival=${fest.id}" class="px-4 py-2 bg-slate-50 hover:bg-festival-violet hover:text-white text-festival-slate rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center gap-2">
                        Explore <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}
