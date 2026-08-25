package com.festiflow.repository;

import com.festiflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // JpaRepository gives us methods like save(), findAll(), findById(), and deleteById() for free!
    
    // We can also define custom queries simply by naming the method correctly.
    // Spring Boot will automatically write the SQL to find a user by their email.
    User findByEmail(String email);
}
