package com.example.demo.repository;

import com.example.demo.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByHeaviness(int heaviness);
    List<Food> findBySourceType(String sourceType);
    List<Food> findByHeavinessAndSourceType(int heaviness, String sourceType);
    List<Food> findByHeavinessBetween(int min, int max);
    List<Food> findByHeavinessBetweenAndSourceType(int min, int max, String sourceType);
}
