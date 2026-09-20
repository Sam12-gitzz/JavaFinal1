// Mock API Service for FestiFlow
// Thin wrapper around store.js. When a real backend is ready, replace these with fetch() calls.

const mockFestivals = [
    { id: 1, name: "Ganesh Visarjan 2026", date: "Sept 14 - Sept 25, 2026", desc: "City-wide immersion event.", pointsCount: 12, status: "Active" },
    { id: 2, name: "Navratri Durga Puja", date: "Oct 15 - Oct 24, 2026", desc: "Local immersion spots for Durga idols.", pointsCount: 5, status: "Upcoming" }
];

const mockPoints = [
    { id: 1, festivalId: 1, name: "Girgaon Chowpatty", location: "Marine Drive", distance: "2.3 km" },
    { id: 2, festivalId: 1, name: "Juhu Beach", location: "Juhu", distance: "8.5 km" },
    { id: 3, festivalId: 2, name: "Powai Lake", location: "Powai", distance: "12.1 km" }
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const api = {
    // Festivals & Points (Still static mock data, conceptually would come from DB)
    getFestivals: async () => {
        await delay(300);
        return mockFestivals;
    },
    getPoints: async (festivalId) => {
        await delay(300);
        return mockPoints.filter(p => p.festivalId == festivalId);
    },
    
    // Core Data (Wrapped from store.js)
    getSlots: async () => {
        await delay(150);
        return Store.getSlots();
    },
    getSlotById: async (id) => {
        await delay(100);
        return Store.getSlot(id);
    },
    getBookings: async () => {
        await delay(200);
        return Store.getBookings();
    },
    getUsers: async () => {
        await delay(100);
        return Store.getUsers();
    },
    
    // Actions
    login: async (email, password) => {
        await delay(500);
        const users = Store.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            Store.setCurrentUser({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
            return { success: true, user };
        }
        // Fallback for empty system admin
        if(users.length === 0 && email === 'admin@festiflow.com') {
            const mockAdmin = { id: 'admin', name: "Admin", email: email, isAdmin: true };
            Store.setCurrentUser(mockAdmin);
            return { success: true, user: mockAdmin };
        }
        throw new Error("Invalid email or password");
    },
    register: async (userData) => {
        await delay(600);
        const users = Store.getUsers();
        if (users.find(u => u.email === userData.email)) {
            throw new Error("Email already registered");
        }
        const newUser = { 
            id: Date.now().toString(), 
            name: userData.name, 
            email: userData.email, 
            password: userData.password, 
            isAdmin: userData.email === 'admin@festiflow.com' 
        };
        Store.addUser(newUser);
        Store.setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin });
        return { success: true, user: newUser };
    },
    bookSlot: async (bookingData) => {
        await delay(800);
        const slot = Store.getSlot(bookingData.slotId);
        if (!slot) throw new Error("Slot not found");
        if (bookingData.groupSize > slot.capacityRemaining) {
            throw new Error(`Only ${slot.capacityRemaining} spots left.`);
        }
        
        // Execute booking logic
        Store.updateSlotCapacity(bookingData.slotId, slot.capacityRemaining - bookingData.groupSize);
        const bookingId = "BKG-" + Math.floor(Math.random() * 10000);
        const qrPayload = `FESTIFLOW|${bookingId}|${bookingData.userId}|${bookingData.slotId}|${bookingData.groupSize}`;
        
        const newBooking = {
            id: bookingId,
            userId: bookingData.userId,
            userName: bookingData.userName,
            userEmail: bookingData.userEmail,
            festivalName: bookingData.festivalName,
            pointName: bookingData.pointName,
            slotTime: bookingData.slotTime,
            date: bookingData.date,
            slotId: bookingData.slotId,
            groupSize: bookingData.groupSize,
            status: "confirmed",
            qrCode: qrPayload,
            createdAt: new Date().toISOString()
        };
        
        Store.addBooking(newBooking);
        return { success: true, bookingId };
    },
    cancelBooking: async (bookingId) => {
        await delay(500);
        const bookings = Store.getBookings();
        const booking = bookings.find(b => b.id === bookingId);
        if(!booking || booking.status === 'cancelled') return { success: false };
        
        Store.updateBookingStatus(bookingId, "cancelled");
        const slot = Store.getSlot(booking.slotId);
        if(slot) {
            const newRemaining = slot.capacityRemaining + parseInt(booking.groupSize, 10);
            Store.updateSlotCapacity(slot.id, Math.min(newRemaining, slot.capacityTotal));
        }
        return { success: true };
    },
    getRecommendation: async (criteria) => {
        await delay(600);
        const slots = Store.getSlots();
        const available = slots.filter(s => s.capacityRemaining > 0);
        return {
            recommendedSlot: available[1] || available[0] || null,
            point: mockPoints[0],
            reason: "Closest available location with moderate crowd that fits your group size."
        };
    }
};
