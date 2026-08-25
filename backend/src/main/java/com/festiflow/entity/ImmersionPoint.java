package com.festiflow.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class ImmersionPoint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String mapCoordinates; // e.g., "19.0968, 72.8265" for Juhu Beach

    // Many Immersion Points belong to One Festival
    // @JoinColumn specifies the foreign key column in the database
    @ManyToOne
    @JoinColumn(name = "festival_id")
    private Festival festival;

    // One Immersion Point has Many Time Slots
    @OneToMany(mappedBy = "immersionPoint", cascade = CascadeType.ALL)
    private List<TimeSlot> timeSlots;

    // --- Getters and Setters ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMapCoordinates() { return mapCoordinates; }
    public void setMapCoordinates(String mapCoordinates) { this.mapCoordinates = mapCoordinates; }

    public Festival getFestival() { return festival; }
    public void setFestival(Festival festival) { this.festival = festival; }

    public List<TimeSlot> getTimeSlots() { return timeSlots; }
    public void setTimeSlots(List<TimeSlot> timeSlots) { this.timeSlots = timeSlots; }
}
