package com.festiflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int groupSize;
    private String status; // e.g., "CONFIRMED", "WAITLISTED"
    private String qrCodeString; // Unique string to generate the QR code
    
    private LocalDateTime bookingTime; // When the user clicked "Book"

    // Many Bookings belong to One User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Many Bookings belong to One Time Slot
    @ManyToOne
    @JoinColumn(name = "time_slot_id")
    private TimeSlot timeSlot;

    // --- Getters and Setters ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getGroupSize() { return groupSize; }
    public void setGroupSize(int groupSize) { this.groupSize = groupSize; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQrCodeString() { return qrCodeString; }
    public void setQrCodeString(String qrCodeString) { this.qrCodeString = qrCodeString; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public TimeSlot getTimeSlot() { return timeSlot; }
    public void setTimeSlot(TimeSlot timeSlot) { this.timeSlot = timeSlot; }
}
