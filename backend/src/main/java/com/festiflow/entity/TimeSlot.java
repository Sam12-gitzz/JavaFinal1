package com.festiflow.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
public class TimeSlot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    
    private int maxCapacity;
    private int currentBooked; // Starts at 0, increases as bookings happen

    // Many Time Slots belong to One Immersion Point
    @ManyToOne
    @JoinColumn(name = "immersion_point_id")
    private ImmersionPoint immersionPoint;

    // One Time Slot has Many Bookings
    @OneToMany(mappedBy = "timeSlot", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    // --- Getters and Setters ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public int getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(int maxCapacity) { this.maxCapacity = maxCapacity; }

    public int getCurrentBooked() { return currentBooked; }
    public void setCurrentBooked(int currentBooked) { this.currentBooked = currentBooked; }

    public ImmersionPoint getImmersionPoint() { return immersionPoint; }
    public void setImmersionPoint(ImmersionPoint immersionPoint) { this.immersionPoint = immersionPoint; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}
