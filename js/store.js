// frontend/js/store.js

// A shared data layer to handle all localStorage read/writes
const Store = {
    // 1. Initialize schema and seed mock data if empty
    init: function() {
        if (!localStorage.getItem('slots')) {
            const initialSlots = [
                // Festival 1 (Ganesh Visarjan), Point 1 (Girgaon)
                { id: 101, festival: 1, point: 1, time: "7:00 PM - 8:00 PM", capacityTotal: 100, capacityRemaining: 0 },
                { id: 102, festival: 1, point: 1, time: "8:00 PM - 9:00 PM", capacityTotal: 100, capacityRemaining: 18 },
                { id: 103, festival: 1, point: 1, time: "9:00 PM - 10:00 PM", capacityTotal: 100, capacityRemaining: 60 },
                
                // Festival 1 (Ganesh Visarjan), Point 2 (Juhu Beach)
                { id: 104, festival: 1, point: 2, time: "6:00 PM - 8:00 PM", capacityTotal: 500, capacityRemaining: 450 },
                { id: 105, festival: 1, point: 2, time: "8:00 PM - 10:00 PM", capacityTotal: 500, capacityRemaining: 50 },
                
                // Festival 2 (Navratri), Point 3 (Powai Lake)
                { id: 201, festival: 2, point: 3, time: "5:00 PM - 7:00 PM", capacityTotal: 200, capacityRemaining: 200 },
                { id: 202, festival: 2, point: 3, time: "7:00 PM - 9:00 PM", capacityTotal: 200, capacityRemaining: 120 }
            ];
            localStorage.setItem('slots', JSON.stringify(initialSlots));
        }
        
        // Ensure other schema arrays exist
        if (!localStorage.getItem('users')) localStorage.setItem('users', '[]');
        if (!localStorage.getItem('bookings')) localStorage.setItem('bookings', '[]');
    },

    // 2. Users (array of {id, name, email, password})
    getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
    setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    addUser: function(user) {
        const users = this.getUsers();
        users.push(user);
        this.setUsers(users);
    },

    // 3. Current User Session ({id, name, email} or null)
    getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
    setCurrentUser: (user) => localStorage.setItem('currentUser', JSON.stringify(user)),
    clearCurrentUser: () => localStorage.removeItem('currentUser'),

    // 4. Slots (array of {id, festival, point, time, capacityTotal, capacityRemaining})
    getSlots: () => JSON.parse(localStorage.getItem('slots') || '[]'),
    setSlots: (slots) => localStorage.setItem('slots', JSON.stringify(slots)),
    getSlot: function(id) {
        return this.getSlots().find(s => s.id == id);
    },
    updateSlotCapacity: function(id, newRemaining) {
        const slots = this.getSlots();
        const index = slots.findIndex(s => s.id == id);
        if(index !== -1) {
            slots[index].capacityRemaining = newRemaining;
            this.setSlots(slots);
        }
    },

    // 5. Bookings (array of {id, userId, slotId, groupSize, status, qrCode, createdAt})
    getBookings: () => JSON.parse(localStorage.getItem('bookings') || '[]'),
    setBookings: (bookings) => localStorage.setItem('bookings', JSON.stringify(bookings)),
    addBooking: function(booking) {
        const bookings = this.getBookings();
        bookings.push(booking);
        this.setBookings(bookings);
    },
    updateBookingStatus: function(id, status) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id == id);
        if(index !== -1) {
            bookings[index].status = status;
            this.setBookings(bookings);
        }
    }
};

// Auto-initialize when the file is loaded
Store.init();
