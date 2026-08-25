package com.festiflow.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users") // "user" is a reserved keyword in some databases, so we name the table "users"
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments the ID (1, 2, 3...)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String role; // e.g., "USER" or "ADMIN"

    // One User can have Many Bookings
    // mappedBy = "user" means the 'user' field in the Booking class owns this relationship
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    // --- Getters and Setters ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}
