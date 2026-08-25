package com.festiflow.repository;

import com.festiflow.entity.ImmersionPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImmersionPointRepository extends JpaRepository<ImmersionPoint, Long> {
    
    // Custom query to find all immersion points for a specific festival
    List<ImmersionPoint> findByFestivalId(Long festivalId);
}
