package com.festiflow.repository;

import com.festiflow.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FestivalRepository extends JpaRepository<Festival, Long> {
    // Inherits all basic CRUD operations
}
