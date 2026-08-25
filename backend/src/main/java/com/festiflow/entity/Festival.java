package com.festiflow.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Festival {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(length = 1000) // Allows for a longer description text
    private String description;
    
    private LocalDate startDate;
    private LocalDate endDate;

    // One Festival has Many Immersion Points
    // cascade = CascadeType.ALL means if we delete a Festival, its points are deleted too
    @OneToMany(mappedBy = "festival", cascade = CascadeType.ALL)
    private List<ImmersionPoint> immersionPoints;

    // --- Getters and Setters ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public List<ImmersionPoint> getImmersionPoints() { return immersionPoints; }
    public void setImmersionPoints(List<ImmersionPoint> immersionPoints) { this.immersionPoints = immersionPoints; }
}
