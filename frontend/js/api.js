// Mock API Service for FestiFlow
// Later, these will be replaced with actual `fetch()` calls to the Spring Boot REST API.
// e.g. return fetch('/api/festivals').then(r => r.json());

const mockFestivals = [
    { id: 1, name: "Ganesh Visarjan 2026", date: "Sept 14 - Sept 25, 2026", desc: "City-wide immersion event.", pointsCount: 12, status: "Active" },
    { id: 2, name: "Navratri Durga Puja", date: "Oct 15 - Oct 24, 2024", desc: "Local immersion spots for Durga idols.", pointsCount: 5, status: "Upcoming" }
];

const mockPoints = [
    { id: 1, festivalId: 1, name: "Girgaon Chowpatty", location: "Marine Drive", capacity: 500, occupancy: 320, crowdLevel: "Moderate", distance: "2.3 km" },
    { id: 2, festivalId: 1, name: "Juhu Beach", location: "Juhu", capacity: 1000, occupancy: 850, crowdLevel: "High", distance: "8.5 km" },
    { id: 3, festivalId: 1, name: "Powai Lake", location: "Powai", capacity: 300, occupancy: 100, crowdLevel: "Low", distance: "12.1 km" }
];

const mockSlots = [
    { id: 101, pointId: 1, time: "7:00 PM - 8:00 PM", max: 100, booked: 100, status: "Full" },
    { id: 102, pointId: 1, time: "8:00 PM - 9:00 PM", max: 100, booked: 82, status: "Available" },
    { id: 103, pointId: 1, time: "9:00 PM - 10:00 PM", max: 100, booked: 40, status: "Available" }
];

const api = {
    getFestivals: async () => {
        return new Promise(resolve => setTimeout(() => resolve(mockFestivals), 300));
    },
    getPoints: async (festivalId) => {
        return new Promise(resolve => setTimeout(() => resolve(mockPoints.filter(p => p.festivalId == festivalId)), 300));
    },
    getSlots: async (pointId) => {
        return new Promise(resolve => setTimeout(() => resolve(mockSlots.filter(s => s.pointId == pointId)), 300));
    },
    bookSlot: async (bookingData) => {
        console.log("Mock booking saved:", bookingData);
        // Simulate generating a booking ID
        return new Promise(resolve => setTimeout(() => resolve({ success: true, bookingId: "BKG-" + Math.floor(Math.random()*10000) }), 500));
    },
    getRecommendation: async (criteria) => {
        // Smart recommendation deterministic logic mock
        return new Promise(resolve => setTimeout(() => resolve({
            recommendedSlot: mockSlots[1], // Mocking 8PM slot
            point: mockPoints[0],          // Mocking Girgaon
            reason: "Closest available location with moderate crowd that fits your group size."
        }), 600));
    }
};
