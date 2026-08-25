package com.festiflow.repository;

import com.festiflow.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    
    // Custom query to find all time slots for a specific immersion point
    List<TimeSlot> findByImmersionPointId(Long immersionPointId);
}
